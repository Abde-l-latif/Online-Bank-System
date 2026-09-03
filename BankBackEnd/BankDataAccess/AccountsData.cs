using Microsoft.Data.SqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace BankDataAccess
{

    public class AccountsDTO
    {

        public enum AccountTypeEnum : byte
        {
            Checking = 0,
            Savings = 1
        }

        public enum AccountStatusEnum : byte
        {
            Active = 0,
            Frozen = 1,
            Closed = 2
        }

        public int AccountID { get; set; }
        public string AccountNumber { get; set; }
        public decimal AccountBalance { get; set; }
        public AccountTypeEnum AccountType { get; set; }
        public AccountStatusEnum AccountStatus { get; set; }
        public int CustomerID { get; set; }
        public CustomersDTO Customer { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public AccountsDTO(int accountID, string accountNumber, decimal accountBalance, AccountTypeEnum accountType, AccountStatusEnum accountStatus, int customerID)
        {
            AccountID = accountID;
            AccountNumber = accountNumber;
            AccountBalance = accountBalance;
            AccountType = accountType;
            AccountStatus = accountStatus;
            CustomerID = customerID;
            Customer = CustomersData.GetCustomerById(customerID) ?? new CustomersDTO();
        }
        public AccountsDTO() { }
    }

    public class AccountsData
    {

        static public AccountsDTO GetAccountByAccountNumber(string AccountNumber, SqlConnection connection, SqlTransaction? transaction)
        {
            string query = "SELECT * FROM Accounts where AccountNumber = @AccountNumber;";

            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("@AccountNumber", AccountNumber);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {

                        if (reader.Read())
                        {
                            return new AccountsDTO(
                                reader.GetInt32(reader.GetOrdinal("AccountID")),
                                reader.GetString(reader.GetOrdinal("AccountNumber")),
                                reader.GetDecimal(reader.GetOrdinal("AccountBalance")),
                                (AccountsDTO.AccountTypeEnum)reader.GetByte(reader.GetOrdinal("AccountType")),
                                (AccountsDTO.AccountStatusEnum)reader.GetByte(reader.GetOrdinal("AccountStatus")),
                                reader.GetInt32(reader.GetOrdinal("CustomerID"))
                            );
                        }
                        else
                        {
                            return null;
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving account: {ex.Message}");
            }
        }

        static public AccountsDTO GetAccountByAccountNumber(string AccountNumber)
        {
        
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();
                return GetAccountByAccountNumber(AccountNumber, connection, null);
            }
        
        }

        static public int InsertAccount(AccountsDTO account)
        {
            
            string query = @"INSERT INTO Accounts (AccountNumber, AccountBalance, AccountType, AccountStatus, CustomerID, CreatedAt, UpdatedAt) VALUES 
                            (@AccountNumber, @AccountBalance, @AccountType, @AccountStatus, @CustomerID, GETDATE(), GETDATE()); 
                             SELECT SCOPE_IDENTITY();";
            try
            {

                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@AccountNumber", account.AccountNumber);
                        command.Parameters.AddWithValue("@AccountBalance", account.AccountBalance);
                        command.Parameters.AddWithValue("@AccountType", (int)account.AccountType);
                        command.Parameters.AddWithValue("@AccountStatus", (int)account.AccountStatus);
                        command.Parameters.AddWithValue("@CustomerID", (int)account.CustomerID);


                        int id = Convert.ToInt32(command.ExecuteScalar());
                        return id;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inserting customer: {ex.Message}", ex);
            }


        }

        static public List<AccountsDTO> GetAccountsByAccountNumberUpdate(string FromAccountNumber, string ToAccountNumber, SqlConnection connection, SqlTransaction? transaction)
        {
            List<AccountsDTO> accounts = new List<AccountsDTO>();
            string query = "SELECT * FROM Accounts WITH (UPDLOCK, ROWLOCK) WHERE AccountNumber IN (@FromAccountNumber, @ToAccountNumber) ORDER BY AccountID;";

            try
            {
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("@FromAccountNumber", FromAccountNumber);
                    command.Parameters.AddWithValue("@ToAccountNumber", ToAccountNumber);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            accounts.Add(new AccountsDTO(
                                reader.GetInt32(reader.GetOrdinal("AccountID")),
                                reader.GetString(reader.GetOrdinal("AccountNumber")),
                                reader.GetDecimal(reader.GetOrdinal("AccountBalance")),
                                (AccountsDTO.AccountTypeEnum)reader.GetByte(reader.GetOrdinal("AccountType")),
                                (AccountsDTO.AccountStatusEnum)reader.GetByte(reader.GetOrdinal("AccountStatus")),
                                reader.GetInt32(reader.GetOrdinal("CustomerID"))
                            ));
                        }

                        return accounts;

                    }
                }
                
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving account: {ex.Message}");
            }
        }

        static public AccountsDTO GetAllAccountByAccountID(int AccountID)
        {

            string query = "SELECT * FROM Accounts WHERE AccountID = @AccountID;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@AccountID", AccountID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if(reader.Read())
                            {

                                return new AccountsDTO(
                                    reader.GetInt32(reader.GetOrdinal("AccountID")),
                                    reader.GetString(reader.GetOrdinal("AccountNumber")),
                                    reader.GetDecimal(reader.GetOrdinal("AccountBalance")),
                                    (AccountsDTO.AccountTypeEnum)reader.GetByte(reader.GetOrdinal("AccountType")),
                                    (AccountsDTO.AccountStatusEnum)reader.GetByte(reader.GetOrdinal("AccountStatus")),
                                    reader.GetInt32(reader.GetOrdinal("CustomerID"))
                                );

                            }

                            return null; 
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving accounts: {ex.Message}");

            }

        }


        static public List<AccountsDTO> GetAllAccountsByCustomerID(int customerID)
        {
            List<AccountsDTO> result = new List<AccountsDTO>();

            string query = "SELECT * FROM Accounts WHERE CustomerID = @CustomerID;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@CustomerID", customerID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {

                                result.Add(new AccountsDTO(
                                    reader.GetInt32(reader.GetOrdinal("AccountID")),
                                    reader.GetString(reader.GetOrdinal("AccountNumber")),
                                    reader.GetDecimal(reader.GetOrdinal("AccountBalance")),
                                    (AccountsDTO.AccountTypeEnum)reader.GetByte(reader.GetOrdinal("AccountType")),
                                    (AccountsDTO.AccountStatusEnum)reader.GetByte(reader.GetOrdinal("AccountStatus")),
                                    reader.GetInt32(reader.GetOrdinal("CustomerID"))
                                ));

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

        static public bool isAccountTypeAlreadyExist(int customerID, int accountType)
        {
            string query = "SELECT 1 FROM Accounts WHERE CustomerID = @CustomerID and AccountType = @AccountType;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@CustomerID", customerID);
                        command.Parameters.AddWithValue("@AccountType", accountType);

                        object result = command.ExecuteScalar();
                        
                        return (result != null && (int)result == 1);
                    }
                }


            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving accounts: {ex.Message}");

            }
        }


        static public int UpdateAccount(AccountsDTO account , SqlConnection connection, SqlTransaction? transaction )
        {
            string Query = @"UPDATE Accounts SET AccountBalance = @AccountBalance,
                 AccountType = @AccountType,
                 AccountStatus = @AccountStatus,
                 UpdatedAt = getdate() WHERE AccountID = @AccountID";

             using (SqlCommand command = new SqlCommand(Query, connection, transaction))
             {
                 command.Parameters.AddWithValue("@AccountID", account.AccountID);
                 command.Parameters.AddWithValue("@AccountBalance", account.AccountBalance);
                 command.Parameters.AddWithValue("@AccountType", (byte)account.AccountType);
                 command.Parameters.AddWithValue("@AccountStatus", (byte)account.AccountStatus);

                 return command.ExecuteNonQuery();
             }
            
        }

        static public int UpdateAccount(AccountsDTO account)
        {
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                return UpdateAccount(account, connection, null);

            }

        }
    }
}
