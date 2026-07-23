using BankBusinessAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace BankWebApi.Controllers
{
    [Route("api/KYC")]
    [ApiController]
    public class KYCController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        private readonly IHttpClientFactory _httpClientFactory;

        public KYCController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("verify/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> VerifyKYC(int userId)
        {
            HttpClient client = _httpClientFactory.CreateClient();

            var apiKey = _configuration["Didit:ApiKey"];
            var workflowId = _configuration["Didit:WorkflowId"];

            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "Didit API key is missing.");

            if (string.IsNullOrWhiteSpace(workflowId))
                return StatusCode(500, "Didit Workflow ID is missing.");

            var body = new
            {

                workflow_id = workflowId,
                vendor_data = userId,
                callback = "https://folic-cackle-barrel.ngrok-free.dev" // where the user's browser is redirected after they finish the verification.
            };

            var json = JsonSerializer.Serialize(body);

            var request = new HttpRequestMessage(HttpMethod.Post,
                "https://verification.didit.me/v3/session/");

            request.Headers.Add("x-api-key", apiKey);

            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(error);
            }

            var content = await response.Content.ReadAsStringAsync();

            return Content(content, "application/json");

        }
    }
}
