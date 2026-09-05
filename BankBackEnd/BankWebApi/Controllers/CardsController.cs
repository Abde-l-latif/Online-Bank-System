using BankBusinessAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankWebApi.Controllers
{
    [Authorize]
    [Route("api/Cards")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        public class AddCardRequest
        {
            public int AccountID {  get; set; }
            public byte CardType { get; set; }
            public byte CardBrand { get; set; }
        }

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

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("Add")]
        public IActionResult AddCard([FromBody] AddCardRequest CardInfo)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
            {
                return Unauthorized("User ID is missing or invalid.");
            }

            Cards Card = new Cards();

            bool status = Card.AddCard(userIdInt, CardInfo.AccountID, CardInfo.CardType, CardInfo.CardBrand);

            if (status == true)
                return Ok("Card Added successfully");
            else
                return Ok("This Card Type Already exist");
        }
    }
}
