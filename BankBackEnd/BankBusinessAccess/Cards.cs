using BankDataAccess;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        }

        static public List<CardsDTO> getCardsByCustomerID(int customerID)
        {
            return CardsData.GetAllCardsByCustomerID(customerID);

        }
    }
}
