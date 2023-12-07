using Dating_App.Extensions;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Dating_App.Helpers
{
    // Log the last activity of a user after an action is executed.
    // Makes use of the ClaimsPrincipleExtension class to get the user's id.
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next(); // this will run the action and wait for it to complete

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();

            var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);

            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();
        }
    }
}
