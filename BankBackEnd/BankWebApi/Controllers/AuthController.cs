using BankBusinessAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankWebApi.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Authentication _authentication;
        private readonly IConfiguration _configuration;

        public class LoginRequest
        {
            public string EmailAddress { get; set; }
            public string Password { get; set; }
        }

        public AuthController(IConfiguration configuration, Authentication authentication)
        {
            _authentication = authentication;
            _configuration = configuration;
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
        public IActionResult Register([FromBody]RegisterDTO registerDTO)
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
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var userResponse = _authentication.Login(request.EmailAddress, request.Password);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userResponse.UserID.ToString()),

                    new Claim(ClaimTypes.Email, userResponse.EmailAddress),

                    new Claim(ClaimTypes.Role, userResponse.Role.RoleName)
                };

                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


                var token = new JwtSecurityToken(
                    issuer: "UserAuthApi",
                    audience: "ApiUsers",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: creds
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });

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
