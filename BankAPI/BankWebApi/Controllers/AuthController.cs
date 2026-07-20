using BankBusinessAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankWebApi.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Authentication _authentication;


        public AuthController(Authentication authentication)
        {
            _authentication = authentication;
        }


        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Register(RegisterDTO registerDTO)
        {
            try
            {  
                var user = _authentication.Register(registerDTO);
                return StatusCode(StatusCodes.Status201Created, user);

            }
            catch (CustomExceptions.ValidationException ex)
            {
                return BadRequest($"Validation error: {ex.Message}");
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
