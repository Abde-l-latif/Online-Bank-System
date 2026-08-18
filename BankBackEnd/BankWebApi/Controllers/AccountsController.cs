using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BankBusinessAccess;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{customerID}")]
        public IActionResult GetAllAccountsByCustomerID(int customerID)
        {

            if(customerID <= 0) {

                return BadRequest("Customer ID is invalid.");
            }
            var accounts = Accounts.GetAllAccountsByCustomerID(customerID);

            return Ok(accounts);
        }
    }
}
