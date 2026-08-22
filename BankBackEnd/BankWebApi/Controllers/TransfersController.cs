using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Transfers")]
    [ApiController]
    public class TransfersController : ControllerBase
    {
        public class TransferRequest
        {
            public string FromAccount { get; set; }
            public string ToAccount { get; set; }
            public decimal Amount { get; set; }
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost]
        public IActionResult Transfer([FromBody] TransferRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            if (request.ToAccount == null || request.Amount <= 0 || request.FromAccount == null)
            {
                return BadRequest("Invalid transfer request.");
            }

            if (Transactions.Transfer(userIdInt, request.FromAccount, request.ToAccount, request.Amount))
            {
                return Ok("Transfer successful.");
            }
        
            return BadRequest("Transfer failed.");
            
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("All")]
        public IActionResult GetTransfers()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

          
            return Ok(Transactions.GetAllTransactionByUser(userIdInt));

        }


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("Customer/{pageNumber}")]
        public async Task<IActionResult> GetTransfersUsingCustomerID(int pageNumber)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            var result = Transactions.getAllTransactionsUsingCustomerID(userIdInt, pageNumber);

            if (result == null)
            {
                return NotFound();  
            }

            return Ok(await result);

        }
    }
}
