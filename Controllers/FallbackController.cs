using Microsoft.AspNetCore.Mvc;

namespace Dating_App.Controllers
{
    // Controller which handles unexpected errors or not found resources
    // Inherits from Controller, needs view support
    public class FallbackController : Controller
    {
        public ActionResult Index()
        {
            // returns the index.html file from the wwwroot folder
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
        }
    }
}
