using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BankDataAccess.CardsDTO;

namespace BankDataAccess
{

    public class CardsDTO
    {
        public enum cardType : byte
        {
            Debit = 0, Credit
        }

        public enum cardStatus : byte
        {
            Active = 0, Frozen, Blocked, Expired
        }

        public enum cardBrand : byte
        {
            Visa = 0, Mastercard
        }

        public int CardID { get; set; }

        public int AccountID { get; set; }

        public cardType CardType { get; set; }

        public string CardNumber { get; set; }

        public string CardHolderName { get; set; }

        public cardStatus Status { get; set; }

        public DateTime ExpirationDate { get; set; }

        public cardBrand CardBrand { get; set; }

        public AccountsDTO Account { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public CardsDTO(int cardID, int accountID, cardType cardType, string cardNumber, string cardHolderName, cardStatus status, DateTime expirationDate, cardBrand cardBrand)
        {
            CardID = cardID;
            AccountID = accountID;
            CardType = cardType;
            CardNumber = cardNumber;
            CardHolderName = cardHolderName;
            Status = status;
            ExpirationDate = expirationDate;
            CardBrand = cardBrand;
            Account = AccountsData.GetAllAccountByAccountID(accountID);
        }

        public CardsDTO() { }

    }

    public  class CardsData
    {

        static public List<CardsDTO> GetAllCardsByCustomerID(int customerID)
        {
            List<CardsDTO> Cards = new List<CardsDTO>();

            string query = @"SELECT *
                                FROM Cards
                            WHERE AccountID in (select AccountID from Accounts where CustomerID = @customerID);";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@customerID", customerID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Cards.Add(new CardsDTO(
                                        (int)reader["CardID"],
                                        (int)reader["AccountID"],
                                        (cardType)reader["CardType"],
                                        (string)reader["CardNumber"],
                                        (string)reader["CardHolderName"],
                                        (cardStatus)reader["Status"],
                                        (DateTime)reader["ExpirationDate"],
                                        (cardBrand)reader["CardBrand"]
                                )
                                {
                                    CreatedAt = (DateTime)reader["CreatedAt"]
                                });
                            }
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Cards;
        }

        static public bool isCardExistsByCardNumber(string cardNumber)
        {
            string query = @"select 1 from Cards where CardNumber = @CardNumber;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CardNumber", cardNumber);

                        object res = command.ExecuteScalar();

                        if (res != null)
                            return (Convert.ToInt32(res) == 1);
          
                    
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return false;

        }

        static public int InsertCard(CardsDTO Card)
        {
            string query = @"insert into Cards (AccountID, CardNumber, CardHolderName, ExpirationDate, CardType, CardBrand, Status, CreatedAt, UpdatedAt) 
            values (@AccountID, @CardNumber, @CardHolderName, DATEADD(year, 10, GETDATE()), @CardType, @CardBrand, 0, GETDATE(), GETDATE());
            SELECT SCOPE_IDENTITY() ;";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@AccountID", Card.AccountID);
                        command.Parameters.AddWithValue("@CardNumber", Card.CardNumber);
                        command.Parameters.AddWithValue("@CardHolderName", Card.CardHolderName);
                        command.Parameters.AddWithValue("@CardType", (int)Card.CardType);
                        command.Parameters.AddWithValue("@CardBrand", (int)Card.CardBrand);

                        object res = command.ExecuteScalar();

                        if (res != null)
                            return Convert.ToInt32(res);


                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return -1;

        }
    }
}
