using BankBusinessAccess;
using BankWebApi.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
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

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public AuthController(IConfiguration configuration, Authentication authentication)
        {
            _authentication = authentication;
            _configuration = configuration;
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
                return Ok(new { code = "REGISTER_SUCCESS" });

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
                var User = _authentication.Login(request.EmailAddress, request.Password);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, User.userDTO.UserID.ToString()),

                    new Claim(ClaimTypes.Email, User.userDTO.EmailAddress),

                    new Claim(ClaimTypes.Role, User.userDTO.Role.RoleName)
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

                var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

                // Create refresh token (random)
                var refreshToken = GenerateRefreshToken();

                // Store refresh token securely (hash + expiry + not revoked)
                User.userDTO.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
                User.userDTO.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
                User.userDTO.RefreshTokenRevokedAt = null;


                if(User.Save())
                {
                    return Ok(new TokenResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        Email = User.userDTO.EmailAddress
                    });

                }
                else
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: Save is returning false");

            }
            catch (CustomExceptions.AuthenticationException ex)
            {
                return Unauthorized(new
                {
                    code = "INVALID_CREDENTIALS"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshRequest request)
        {
            var User = Users.Find(request.Email);

            if (User == null)
                return Unauthorized("Invalid refresh request");

            if (User.userDTO.RefreshTokenRevokedAt != null)
                return Unauthorized("Refresh token is revoked");

            if (User.userDTO.RefreshTokenExpiresAt == null || User.userDTO.RefreshTokenExpiresAt <= DateTime.UtcNow)
                return Unauthorized("Refresh token expired");

            bool refreshValid = BCrypt.Net.BCrypt.Verify(request.RefreshToken, User.userDTO.RefreshTokenHash);
            if (!refreshValid)
                return Unauthorized("Invalid refresh token");

            // Issue NEW access token (same claims & signing settings as login)
            var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, User.userDTO.UserID.ToString()),

                    new Claim(ClaimTypes.Email, User.userDTO.EmailAddress),

                    new Claim(ClaimTypes.Role, User.userDTO.Role.RoleName)
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

            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // Create new refresh token (random)
            var newRefreshToken = GenerateRefreshToken();

            // Rotation: replace refresh token
            User.userDTO.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(newRefreshToken);
            User.userDTO.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(7);
            User.userDTO.RefreshTokenRevokedAt = null;


            if (User.Save())
            {
                return Ok(new TokenResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                });

            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: Save is returning false");
   
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] LogoutRequest request)
        {
            var User = Users.Find(request.Email);

            if (User == null)
                return Ok(); // Do not reveal if user exists

            bool refreshValid = BCrypt.Net.BCrypt.Verify(request.RefreshToken, User.userDTO.RefreshTokenHash);

            if (!refreshValid)
                return Ok();

            User.userDTO.RefreshTokenRevokedAt = DateTime.UtcNow;

            User.Save(); 

            return Ok("Logged out successfully");
        }

    }
}
