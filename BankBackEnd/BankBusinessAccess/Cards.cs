using BankDataAccess;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static BankDataAccess.CardsDTO;

namespace BankBusinessAccess
{
    public class Cards
    {
        enum enMode { AddMode , UpdateMode }

        enMode Mode;

        public CardsDTO Card { get; set; }

        public Cards(CardsDTO card)
        {
            Mode = enMode.UpdateMode;
            Card = card;
        }

        public Cards() 
        { 
            Mode = enMode.AddMode;
            Card = new CardsDTO();
        }

        static public List<CardsDTO> getCardsByCustomerID(int customerID)
        {
            return CardsData.GetAllCardsByCustomerID(customerID);

        }

        private string _GenerateCardNumber()
        {
            int part1 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part2 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part3 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part4 = RandomNumberGenerator.GetInt32(1000, 10000);

            return $"{part1}{part2}{part3}{part4}";
        }


        public bool AddCard(int userID, int AccountID, byte CardType, byte CardBrand)
        {
            Users? user = Users.Find(userID);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            string GeneratedNumber = "";

            do {

                GeneratedNumber = _GenerateCardNumber();

            } while (CardsData.isCardExistsByCardNumber(GeneratedNumber));

            Card.CardNumber = GeneratedNumber;

            Card.AccountID = AccountID;

            Card.CardType = (CardsDTO.cardType)CardType;

            Card.CardHolderName = user.userResponseDTO.Customer.FirstName;

            Card.CardBrand = (CardsDTO.cardBrand)CardBrand;

            Card.CardID = CardsData.InsertCard(Card);

            return Card.CardID != -1 ;

        }

    }
}
