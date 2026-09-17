namespace BankWebApi.DTOs.Auth
{
    public class TokenResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public string Email { get; set; } = null;
    }
}
