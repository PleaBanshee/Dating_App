using Dating_App.Extensions;
using Dating_App.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Dating_App.Helpers
{
    // Log the last activity of a user after an action is executed.
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next(); // this will run the action and wait for it to complete

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userName = resultContext.HttpContext.User.GetUsername();

            var repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();

            var user = await repo.GetUserByUsernameAsync(userName);

            user.LastActive = DateTime.UtcNow;

            await repo.SaveAllAsync();
        }
    }
}
