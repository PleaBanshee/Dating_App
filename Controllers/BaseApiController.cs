using Dating_App.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Dating_App.Controllers
{
    // ControllerBase is a class that has all the base functionalities of a controller
    // Applies the LogUserActivity filter to all actions in the controller.
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")] // api/controllername
    public class BaseApiController : ControllerBase
    {
                
    }
}
