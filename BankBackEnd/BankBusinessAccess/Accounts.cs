using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BankDataAccess;
using Microsoft.Data.SqlClient;

namespace BankBusinessAccess
{
    public class Accounts
    {
        enum enMode { addMode, UpdateMode }

        enMode _Mode = enMode.addMode;

        public readonly AccountsDTO _AccountsDTO;

        public Accounts()
        {
            _Mode = enMode.addMode;
            _AccountsDTO = new AccountsDTO();
        }

        public Accounts(AccountsDTO accountsDTO)
        {
            _Mode = enMode.UpdateMode;
            _AccountsDTO = accountsDTO;
        }

        static public Accounts FindByAccountNumber(string AccountNumber, SqlConnection connection, SqlTransaction transaction)
        {
             AccountsDTO account =  AccountsData.GetAccountByAccountNumber(AccountNumber, connection, transaction);

            if(account != null)
                return new Accounts(account);
            else
                return null;
        }

        static public List<Accounts> FindByAccountNumberWithLock(string fromAccountNum, string toAccountNum, SqlConnection connection, SqlTransaction transaction)
        {
            List<AccountsDTO> accounts = AccountsData.GetAccountsByAccountNumberUpdate(fromAccountNum, toAccountNum, connection, transaction);

            if (accounts != null)
                return accounts.Select(a => new Accounts(a)).ToList();
            else
                return null;
        }

        static public List<AccountsDTO> GetAllAccountsByCustomerID(int customerID)
        {
            return AccountsData.GetAllAccountsByCustomerID(customerID);
        }
    }
}
