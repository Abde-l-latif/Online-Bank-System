using BankBusinessAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace BankWebApi.Controllers
{
    [Route("api/webhooks")]
    [ApiController]
    public class WebhooksController : ControllerBase
    {
        public class DiditWebhook
        {
            [JsonPropertyName("webhook_type")]
            public string Webhook_Type { get; set; }

            [JsonPropertyName("status")]
            public string Status { get; set; }

            [JsonPropertyName("vendor_data")]
            public string Vendor_Data { get; set; }

            [JsonPropertyName("session_id")]
            public string Session_Id { get; set; }
        }

        private readonly string _secret;

        public WebhooksController(IConfiguration configuration)
        {
            _secret = configuration["Didit:WebhookSecret"];
        }

        private JsonNode SortAndNormalize(JsonNode node)
        {
            switch (node)
            {
                case JsonObject obj:
                    {
                        var sorted = new JsonObject();

                        foreach (var property in obj.OrderBy(p => p.Key))
                        {
                            sorted[property.Key] =
                                property.Value == null
                                    ? null
                                    : SortAndNormalize(property.Value);
                        }

                        return sorted;
                    }

                case JsonArray array:
                    {
                        var result = new JsonArray();

                        foreach (var item in array)
                        {
                            result.Add(item == null ? null : SortAndNormalize(item));
                        }

                        return result;
                    }

                case JsonValue value:
                    {
                        if (value.TryGetValue<double>(out double d))
                        {
                            if (d % 1 == 0)
                            {
                                return JsonValue.Create((long)d);
                            }
                        }

                        return JsonNode.Parse(value.ToJsonString())!; ;
                    }

                default:
                    return JsonNode.Parse(node.ToJsonString())!;
            }
        }

        private string GetCanonicalPayload(string rawJson)
        {
            JsonNode J = JsonNode.Parse(rawJson)!;
            JsonNode sortedElement = SortAndNormalize(J);

            return sortedElement.ToJsonString(new JsonSerializerOptions
            {
                WriteIndented = false,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            });
        }

        private bool Verify(string payload, string receivedSignature)
        {

            if (string.IsNullOrWhiteSpace(receivedSignature))
                return false;

            string canonicalPayload = GetCanonicalPayload(payload);

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secret));


            var expectedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(canonicalPayload));

            Console.WriteLine(payload);
            Console.WriteLine(canonicalPayload);
            Console.WriteLine(Convert.ToHexString(expectedHash));
            Console.WriteLine(receivedSignature);

            try
            {
                var receivedHash = Convert.FromHexString(receivedSignature);

                Console.WriteLine(receivedHash);

                return CryptographicOperations.FixedTimeEquals(
                    expectedHash, receivedHash);
            }
            catch (FormatException)
            {
                return false;
            }

        }

        [HttpPost("didit")]   
        public async Task<IActionResult> Didit()
        {
            Request.EnableBuffering(); 

            using var reader = new StreamReader(Request.Body, leaveOpen : true);

            string payload = await reader.ReadToEndAsync();

            Request.Body.Position = 0;

            string signature = Request.Headers["X-Signature-V2"];

            if (!Verify(payload, signature))
            {
                return Unauthorized();
            }

            var webhook = JsonSerializer.Deserialize<DiditWebhook>(payload);

            if (webhook == null)
            {
                return BadRequest();
            }

            if (webhook.Webhook_Type != "status.updated")
                return Ok();

            if (!int.TryParse(webhook.Vendor_Data, out int userId))
            {
                return BadRequest("Invalid vendor data.");
            }

            Users? user = Users.Find(userId);

            if (user == null)
            {
                return BadRequest();
            } 
        
            Customers? C = Customers.Find(user.userResponseDTO.CustomerID);

            if (C == null) {
                return BadRequest();
            }
            

            switch (webhook.Status)
            {
                case "Approved":
                    if (!C.Activate())
                    {
                        return StatusCode(500);
                    }
                    break;

                case "Declined":
                    if (!C.Suspend())
                    {
                        return StatusCode(500);
                    }
                    break;

                default:
                    Console.WriteLine($"Unhandled Didit status: {webhook.Status}");
                    break;
            }

            return Ok();
        }
    }
}
