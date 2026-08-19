using BankDataAccess;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Transactions
    {
        static private bool _VerifyAccountOwnership(int userId, string fromAccountNumber, string toAccountNumber)
        {
            Users? user = Users.Find(userId);

            if (user == null)
            {
                return false;
            }

            var fromAccount = Accounts.GetAllAccountsByCustomerID(user.userResponseDTO.CustomerID);

            if (fromAccount == null)
            {
                return false;
            }

            var check = fromAccount.Find(a => a.AccountNumber == fromAccountNumber);

            if(check == null) 
                return false;


            return true;
        }

        static public bool Transfer(int userId, string fromAccountNumber, string toAccountNumber, decimal amount)
        {

            if (amount <= 0)
            {
                throw new ArgumentException("Transfer amount must be greater than zero.");
            }

            if(!_VerifyAccountOwnership(userId , fromAccountNumber, toAccountNumber))
            {
                throw new UnauthorizedAccessException("User is not authorized to perform this transfer.");
            }

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    //Lock the Accounts

                    List<Accounts> lockedAccounts = Accounts.FindByAccountNumberWithLock(fromAccountNumber, toAccountNumber, connection, transaction);

                    if (lockedAccounts.Count != 2)
                    {
                        throw new Exception("One or both accounts not found.");
                    }

                    Accounts? fromAccount = lockedAccounts.FirstOrDefault(a => a._AccountsDTO.AccountNumber == fromAccountNumber);

                    Accounts? toAccount = lockedAccounts.FirstOrDefault(a => a._AccountsDTO.AccountNumber == toAccountNumber);

                    if (fromAccount == null || toAccount == null)
                    {
                        throw new Exception("One or both accounts not found.");
                    }

                    if (fromAccount._AccountsDTO.AccountBalance < amount)
                    {
                        throw new Exception("Insufficient funds in the source account.");
                    }

                    fromAccount._AccountsDTO.AccountBalance -= amount;

                    toAccount._AccountsDTO.AccountBalance += amount;


                    AccountsData.UpdateAccount(fromAccount._AccountsDTO, connection, transaction);

                    AccountsData.UpdateAccount(toAccount._AccountsDTO, connection, transaction);

                    string SharedReference = Guid.NewGuid().ToString();

                    TransactionsDTO trans = new TransactionsDTO()
                    { 
                        TransactionType = TransactionsDTO.transType.transferTo,
                        Amount = amount,
                        BalanceAfter = fromAccount._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = SharedReference,
                        AccountID = fromAccount._AccountsDTO.AccountID,
                        RelatedAccountID = toAccount._AccountsDTO.AccountID,
                    };

                    TransactionsDTO trans2 = new TransactionsDTO()
                    {
                        TransactionType = TransactionsDTO.transType.transferFrom,
                        Amount = amount,
                        BalanceAfter = toAccount._AccountsDTO.AccountBalance,
                        Status = TransactionsDTO.transStatus.completed,
                        Reference = SharedReference,
                        AccountID = toAccount._AccountsDTO.AccountID,
                        RelatedAccountID = fromAccount._AccountsDTO.AccountID,
                    };

                    trans.TransactionID = TransactionsData.AddTransaction(trans, connection, transaction);

                    trans2.TransactionID = TransactionsData.AddTransaction(trans2, connection, transaction);

                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}
