using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankDataAccess
{
    public class TransactionsDTO
    { 
        public enum transType : byte
        {      
            deposit = 0, withdraw, transferTo, transferFrom
        }

        public enum transStatus : byte
        {
            completed = 0, reversed
        }

        public int TransactionID { get; set; }

        public transType TransactionType { get; set; }

        public decimal Amount { get; set; }

        public decimal BalanceAfter { get; set; }

        public transStatus Status { get; set; }

        public string Reference { get; set; }

        public int AccountID { get; set; }

        public AccountsDTO Account { get; set; }

        public int? RelatedAccountID { get; set; }

        public AccountsDTO RelatedAccount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public TransactionsDTO(int transactionID, transType transactionType, decimal amount, decimal balanceAfter, transStatus status, string reference, int accountID, int? relatedAccountID)
        {
            TransactionID = transactionID;
            TransactionType = transactionType;
            Amount = amount;
            BalanceAfter = balanceAfter;
            Status = status;
            Reference = reference;
            AccountID = accountID;
            RelatedAccountID = relatedAccountID;
        }

        public TransactionsDTO() { }

    }
    public class TransactionsData
    {
        static public int AddTransaction(TransactionsDTO transaction, SqlConnection connection, SqlTransaction sqlTransaction)
        {
            int ID = -1;

            string query = "INSERT INTO Transactions (TransactionType, Amount, BalanceAfter, Status, Reference, AccountID, RelatedAccountID) " +
                           "VALUES (@TransactionType, @Amount, @BalanceAfter, @Status, @Reference, @AccountID, @RelatedAccountID); SELECT CAST(SCOPE_IDENTITY() AS INT);";

            using (SqlCommand command = new SqlCommand(query, connection, sqlTransaction))
            {
                command.Parameters.AddWithValue("@TransactionType", (byte)transaction.TransactionType);
                command.Parameters.AddWithValue("@Amount", transaction.Amount);
                command.Parameters.AddWithValue("@BalanceAfter", transaction.BalanceAfter);
                command.Parameters.AddWithValue("@Status", (byte)transaction.Status);
                command.Parameters.AddWithValue("@Reference", transaction.Reference);
                command.Parameters.AddWithValue("@AccountID", transaction.AccountID);

                if(transaction.RelatedAccountID == null)
                {
                    command.Parameters.AddWithValue("@RelatedAccountID", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@RelatedAccountID", transaction.RelatedAccountID);
                }
         
                ID = (int)command.ExecuteScalar();

                return ID;
            }
        }

        static public List<TransactionsDTO> getTransactionsByAccountID(int accountID)
        {
            List<TransactionsDTO> result = new List<TransactionsDTO> ();
            string query = "SELECT * FROM Transactions WHERE AccountID = @accountID;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@accountID", accountID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {

                                result.Add(new TransactionsDTO(
                                    (int)reader["TransactionID"],
                                    (TransactionsDTO.transType)reader["TransactionType"],
                                    (decimal)reader["Amount"],
                                    (decimal)reader["BalanceAfter"],
                                    (TransactionsDTO.transStatus)reader["Status"],
                                    (string)reader["Reference"],
                                    (int)reader["AccountID"],
                                    reader["RelatedAccountID"] == DBNull.Value
                                    ? (int?)null
                                    : (int)reader["RelatedAccountID"]
                                )
                                {
                                    CreatedAt = (DateTime)reader["CreatedAt"]
                                }
                                );

                            }

                            return result;

                        }

                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving accounts: {ex.Message}");

            }
        }
    }
}
