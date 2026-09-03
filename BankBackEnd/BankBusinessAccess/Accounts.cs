using BankDataAccess;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Accounts
    {
        enum enMode { addMode, UpdateMode }

        enMode _Mode = enMode.addMode;

        public AccountsDTO _AccountsDTO;

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



        private string _GenerateAccountNumber()
        {
            int part1 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part2 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part3 = RandomNumberGenerator.GetInt32(1000, 10000);
            int part4 = RandomNumberGenerator.GetInt32(1000, 10000);

            return $"{part1}{part2}{part3}{part4}";
        }


        public bool AddNewAccount(int userID, int AccountType)
        {
            Users? user = Users.Find(userID);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            bool checkAccountTypeExesting = AccountsData.isAccountTypeAlreadyExist(user.userResponseDTO.CustomerID, AccountType);

            if(!checkAccountTypeExesting)
            {
                string accountNumber;
                do
                {
                    accountNumber = _GenerateAccountNumber();
                }
                while (AccountsData.GetAccountByAccountNumber(accountNumber) != null);


                this._AccountsDTO.AccountType = (AccountsDTO.AccountTypeEnum)AccountType;
                this._AccountsDTO.AccountBalance = 0;
                this._AccountsDTO.AccountStatus = AccountsDTO.AccountStatusEnum.Active;
                this._AccountsDTO.CustomerID = user.userResponseDTO.CustomerID;
                this._AccountsDTO.AccountNumber = accountNumber;
                this._AccountsDTO.AccountID = AccountsData.InsertAccount(this._AccountsDTO);

                return true;
            }
        
            return false;

        }

    }
}
