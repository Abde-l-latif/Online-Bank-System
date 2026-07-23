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


        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUserById(int id)
        {
            var user = Users.Find(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }


        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Register(RegisterDTO registerDTO)
        {
            try
            {  
                var userResponse = _authentication.Register(registerDTO);
                return CreatedAtAction(nameof(GetUserById), new { id = userResponse.UserID }, userResponse);

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

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult Login(string emailAddress, string password)
        {
            try
            {
                var userResponse = _authentication.Login(emailAddress, password);
                return Ok(userResponse);
            }
            catch (CustomExceptions.AuthenticationException ex)
            {
                return Unauthorized($"Authentication error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
