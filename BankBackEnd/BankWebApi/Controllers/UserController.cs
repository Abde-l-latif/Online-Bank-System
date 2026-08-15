using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var user = Users.Find(int.Parse(userId));

            return Ok(user);

        }
    }
}
