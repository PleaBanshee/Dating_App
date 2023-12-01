using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dating_App.Interfaces;
using AutoMapper;
using Dating_App.DTOs;
using Dating_App.Extensions;
using Dating_App.Entities;
using Dating_App.Helpers;

namespace Dating_App.Controllers
{
    
    [Authorize] // Requires authentication for all methods in this controller
    public class UsersController : BaseApiController // Inherits from BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        // Dependency Injection: injects the User Repository into the controller
        // Injection of Imapper for mapping objects
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        // [Authorize(Roles = "Admin")] *** Determines which role can access this route
        [HttpGet] // api/users --- parameter passed comes from query string
        public async Task<ActionResult<PagedList<MemberDto>>> GetMembers([FromQuery]UserParams userParams)
        {
            var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = currentUser.UserName;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                // member can view opposite gender
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }

            var users = await _userRepository.GetMembersAsync(userParams);

            // adds pagination headers to response
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

            // returns status code and users
            return Ok(users);
        }

        [HttpGet("{username}")] // api/users/{username}
        public async Task<ActionResult<MemberDto>> GetMember(string userName)
        {
            return await _userRepository.GetMemberByUsernameAsync(userName);
        }

        [HttpGet("{id:int}")] // api/users/{id}
        public async Task<ActionResult<MemberDto>> GetMember(int id)
        {
            return await _userRepository.GetMemberByIdAsync(id);
        }

        [HttpPut] // api/users
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            //  extracts the username of the currently authenticated user from their claims
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent(); // OK status for updates: 204

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")] // api/users/add-photo
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            // upload photo to cloudinary
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);
            
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            // if user has no photos, set the first photo as their main photo
            if (user.Photos.Count == 0) photo.IsProfilePic = true;
            
            user.Photos.Add(photo);

            // add photo to database, if changes saved to DB
            if (await _userRepository.SaveAllAsync())
            {
                // OK status for posts: 201
                // response with a Location header pointing to the new resource
                return CreatedAtAction(
                    nameof(AddPhoto), 
                    new { username = user.UserName }, 
                    _mapper.Map<PhotoDto>(photo)
                );
            }

            return BadRequest("There was a problem uploading your profile pic, please try again");
        }

        [HttpPut("set-profile-pic/{photoId}")] // api/users/set-profile-pic/{id}
        public async Task<ActionResult> SetProfilePic(int photoId)
        {
            // TODO: set value for last updated field
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            if (photo.IsProfilePic) return BadRequest("This photo is already set as your profile picture");

            // set all other photos to false
            var currentMain = user.Photos.FirstOrDefault(x => x.IsProfilePic);
            if (currentMain != null) currentMain.IsProfilePic = false;

            photo.IsProfilePic = true;
            photo.LastUpdated = DateTime.UtcNow;
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")] // api/users/delete-photo/{id}
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();

            if (photo.IsProfilePic) return BadRequest("You cannot delete your profile picture");

            // if photo is stored in cloudinary, delete from cloudinary
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete profile picture. Please try again");
        }
    }
}
