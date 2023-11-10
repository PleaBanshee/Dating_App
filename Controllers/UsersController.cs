using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Dating_App.Interfaces;
using AutoMapper;
using Dating_App.DTOs;
using System.Security.Claims;
using Dating_App.Extensions;
using Dating_App.Entities;

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

        [HttpGet] // api/users
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            // returns status code and users
            return Ok(users);
        }

        [HttpGet("{username}")] // api/users/{username}
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            return await _userRepository.GetMemberByUsernameAsync(userName);
        }

        [HttpGet("{id:int}")] // api/users/{id}
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            return await _userRepository.GetMemberByIdAsync(id);
        }

        [HttpPut] // api/users
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            //  extracts the username of the currently authenticated user from their claims
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent(); // OK status for updates: 204

            // TODO: return message or status for updating content with same values
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
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to set main photo");
        }
    }
}
