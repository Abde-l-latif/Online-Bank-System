using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Cards")]
    [ApiController]
    public class CardsController : ControllerBase
    {


        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{customerID}")]
        public IActionResult GetAllCardsByCustomerID(int customerID)
        {
            if (customerID <= 0)
            {
                return BadRequest("Customer ID is invalid.");
            }

            var cards = Cards.getCardsByCustomerID(customerID);

            return Ok(cards);
        }
    }
}
