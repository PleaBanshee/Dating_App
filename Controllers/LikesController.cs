using Dating_App.DTOs;
using Dating_App.Entities;
using Dating_App.Extensions;
using Dating_App.Helpers;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Dating_App.Controllers
{
    public class LikesController: BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        // Unit of Work injected to get context of repositories
        public LikesController(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        // ActionResult not used to wrap an object, since we only want to return a status code
        [HttpPost("{username}")] // api/likes/{username}
        public async Task<ActionResult> AddLike(string username)
        {
            // Retrieves ID from claims
            var sourceUserId = User.GetUserId();
            var likedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if (likedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot like yourself");

            var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null) return BadRequest($"You already liked {likedUser.FullName}");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId = likedUser.Id
            };
            sourceUser.LikedUsers.Add(userLike);

            if (await _unitOfWork.Complete()) return Ok();
            return BadRequest("Failed to like user");
        }

        [HttpGet] // api/likes?{predicate}
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _unitOfWork.LikesRepository.GetUserLikes(likesParams);

            PaginationHeader paginationHeader = new(users.CurrentPage,
                users.PageSize,
                users.TotalCount,
                users.TotalPages);
            Response.AddPaginationHeader(paginationHeader);

            return Ok(users);
        }
    }
}
