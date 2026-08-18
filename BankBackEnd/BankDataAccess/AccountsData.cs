using Microsoft.Data.SqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
