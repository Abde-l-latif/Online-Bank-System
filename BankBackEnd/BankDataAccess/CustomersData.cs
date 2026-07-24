using Microsoft.Data.SqlClient;

namespace BankDataAccess
{
    public class CustomersDTO
    {
        public enum CustomerStatus
        {
            pending = 0,
            active,
            suspended, 
            closed
        }
        public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }

        public CustomerStatus Status { get; set; } = CustomerStatus.pending;
        public string PhoneNumber { get; set; }
        public int AddressID { get; set; }
        public AddressDTO Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public string NationalID { get; set; }

        public CustomersDTO( string firstName, string lastName, DateTime birthDate, string phoneNumber, int addressId, string nationalID)
        {
            FirstName = firstName;
            LastName = lastName;
            BirthDate = birthDate;
            PhoneNumber = phoneNumber;
            AddressID = addressId;
            NationalID = nationalID;
        }

        public CustomersDTO() { }
    }
    public class CustomersData
    {
        static public int InsertCustomer(CustomersDTO customer)
        {
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();
                return InsertCustomer(customer, connection, null);
            }

        }

        static public int InsertCustomer(CustomersDTO customer, SqlConnection connection, SqlTransaction? transaction)
        {
            try
            {
                string query = "INSERT INTO Customers (FirstName, LastName, BirthDate, Status, PhoneNumber, AddressID, NationalID) VALUES (@FirstName, @LastName, @BirthDate, @Status, @PhoneNumber, @AddressID, @NationalID); SELECT SCOPE_IDENTITY();";
                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("@FirstName", customer.FirstName);
                    command.Parameters.AddWithValue("@LastName", customer.LastName);
                    command.Parameters.AddWithValue("@BirthDate", customer.BirthDate);
                    command.Parameters.AddWithValue("@Status", (int)customer.Status);
                    command.Parameters.AddWithValue("@PhoneNumber", customer.PhoneNumber);
                    command.Parameters.AddWithValue("@AddressID", customer.AddressID);
                    command.Parameters.AddWithValue("@NationalID", customer.NationalID);
                    int id = Convert.ToInt32(command.ExecuteScalar());
                    return id;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting customer: {ex.Message}");
                return -1;
            }
        }

        static public bool IsNationalIDExists(string nationalId)
        {
            string query = "SELECT COUNT(*) FROM Customers WHERE NationalID = @NationalID";

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@NationalID", nationalId);
                        int count = (int)command.ExecuteScalar();
                        return count > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error checking NationalID existence: {ex.Message}");
                    return false;
                }
            }
        }

        static public CustomersDTO? GetCustomerById(int customerID)
        {
            string query = "SELECT * FROM Customers WHERE CustomerID = @CustomerID";

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CustomerID", customerID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new CustomersDTO(
                                    reader["FirstName"].ToString() ?? "",
                                    reader["LastName"].ToString() ?? "",
                                    Convert.ToDateTime(reader["BirthDate"]),
                                    reader["PhoneNumber"].ToString() ?? "",
                                    Convert.ToInt32(reader["AddressID"]),
                                    reader["NationalID"].ToString() ?? ""
                                )
                                {
                                    CustomerId = Convert.ToInt32(reader["CustomerID"]),
                                    Status = (CustomersDTO.CustomerStatus)Convert.ToInt32(reader["Status"]),
                                    Address = AddressesData.GetAddressById(Convert.ToInt32(reader["AddressID"])) ?? new AddressDTO()
                                };
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error retrieving customer: {ex.Message}");
                }
            }

            return null;
        }

        static public int UpdateCustomer(CustomersDTO customer)
        {
            string Query = @"UPDATE Customers SET FirstName = @FirstName,
                 LastName = @LastName,
                 BirthDate = @BirthDate,
                 Status = @Status,
                 PhoneNumber = @PhoneNumber,
                 NationalID = @NationalID,
                 UpdatedAt = getdate() WHERE CustomerID = @CustomerID";

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(Query, connection))
                {
                    command.Parameters.AddWithValue("@CustomerID", customer.CustomerId);
                    command.Parameters.AddWithValue("@FirstName", customer.FirstName);
                    command.Parameters.AddWithValue("@LastName", customer.LastName);
                    command.Parameters.AddWithValue("@BirthDate", customer.BirthDate);
                    command.Parameters.AddWithValue("@Status", (int)customer.Status);
                    command.Parameters.AddWithValue("@PhoneNumber", customer.PhoneNumber);
                    command.Parameters.AddWithValue("@NationalID", customer.NationalID);

                    try
                    {
                        return command.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error updating customer: {ex.Message}");
                        return -1;
                    }
                }
            }
        }
    }
}
