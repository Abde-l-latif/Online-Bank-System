using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace BankDataAccess
{

    public class AddressDTO
    {
        public int AddressID { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }

        public AddressDTO(string country, string city, string street, string postalCode)
        {
            Country = country;
            City = city;
            Street = street;
            PostalCode = postalCode;
        }
        public AddressDTO() { }
    }
    public class AddressesData
    {

        static public int InsertAddress(AddressDTO address)
        {
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();
                return InsertAddress(address, connection, null);
            }
        }

        static public int InsertAddress(AddressDTO address, SqlConnection connection, SqlTransaction? transaction)
        {
            try
            {

                string query = "INSERT INTO Addresses (Country, City, Street, PostalCode) VALUES (@Country, @City, @Street, @PostalCode); SELECT SCOPE_IDENTITY();";

                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("@Country", address.Country);
                    command.Parameters.AddWithValue("@City", address.City);
                    command.Parameters.AddWithValue("@Street", address.Street);
                    command.Parameters.AddWithValue("@PostalCode", address.PostalCode);

                    int id = Convert.ToInt32(command.ExecuteScalar());

                    return id;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting address: {ex.Message}");
                return -1;
            }
        }

        static public AddressDTO? GetAddressById(int addressID)
        {

            string Query = "SELECT * FROM Addresses WHERE AddressID = @AddressID";

            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand(Query, connection))
                    {

                        command.Parameters.AddWithValue("@AddressID", addressID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new AddressDTO(
                                    reader["Country"].ToString() ?? "",
                                    reader["City"].ToString() ?? "",
                                    reader["Street"].ToString() ?? "",
                                    reader["PostalCode"].ToString() ?? ""
                                );
                            }
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving address: {ex.Message}");
                return null;
            }

            return null;
        }
    }
}
