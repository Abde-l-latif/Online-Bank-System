using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using static BankBusinessAccess.UserService;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public class passwordRequest
        {
            public string CurrPassword {  get; set; }

            public string NewPassword { get; set; }
        }

        readonly private UserService _userService;

        public UserController(UserService service)
        {
            _userService = service;
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var user = Users.Find(int.Parse(userId));

            return Ok(user);
        }

        [HttpPost("changePassword")]
        public IActionResult ChangeUserPassword([FromBody] passwordRequest data)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int result))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (_userService.ChangePassword(result, data.CurrPassword, data.NewPassword))
                return Ok("password has been changed changed successfully");
            else
                return BadRequest();
        }

        [HttpPost("updateProfile")]
        public IActionResult UpdateUserProfile([FromBody] UpdateProfileDTO data)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int result))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (_userService.UpdateProfile(result, data))
                return Ok("your profile has been changed changed successfully");
            else
                return BadRequest();
        }
    }


}
