using BankBusinessAccess;
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

            if (!int.TryParse(webhook.Vendor_Data, out int userId))
            {
                return BadRequest("Invalid vendor data.");
            }

            Users? user = Users.Find(userId);

            if (user == null)
            {
                return StatusCode(500, "UserID is unvalide.");
            } 
        
            Customers? C = Customers.Find(user.userResponseDTO.CustomerID);

            if (C == null) {
                return StatusCode(500, "CustomerID is unvalide.");
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
                    // Ignore Not Started, In Progress, etc.
                    break;
            }

            return Ok();
        }
    }
}
