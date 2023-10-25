using Dating_App.Data;
using Dating_App.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dating_App.Controllers
{
    public class ErrorHandlerController : BaseApiController
    {
        private readonly DataContext _context;

        public ErrorHandlerController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret() 
        {
            return "Hello World!";
        }
        
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var responseObj = _context.Users.Find(-1);

            if (responseObj == null) return NotFound();

            return responseObj;
        }
        
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var responseObj = _context.Users.Find(-1);

            // Will generate an exception
            var responseObjReturn = responseObj.ToString();

            return responseObjReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadReqiuest()
        {
            return BadRequest("A bad request was made to the server");
        }
    }
}
