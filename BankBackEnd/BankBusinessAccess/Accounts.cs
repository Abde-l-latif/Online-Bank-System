using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BankDataAccess;

namespace BankBusinessAccess
{
    public class Accounts
    {

        static public List<AccountsDTO> GetAllAccountsByCustomerID(int customerID)
        {
            return AccountsData.GetAllAccountsByCustomerID(customerID);
        }
    }
}
