using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankWebApi.Controllers
{
    [Route("api/webhooks")]
    [ApiController]
    public class WebhooksController : ControllerBase
    {
        public class DiditWebhook
        {
            public string Webhook_Type { get; set; }
            public string Status { get; set; }
            public string Vendor_Data { get; set; }
            public string Session_Id { get; set; }
        }
        
        [HttpPost("didit")]
        public async Task<IActionResult> Didit([FromBody] DiditWebhook webhook)
        {

            if (webhook.Webhook_Type != "status.updated")
                return Ok();

            switch (webhook.Status)
            {
                case "Approved":
                    Console.WriteLine("Approved");
                    break;

                case "Declined":
                    Console.WriteLine("Rejected");
                    break;

                default:
                    // Ignore Not Started, In Progress, etc.
                    break;
            }

            return Ok();
        }
    }
}
