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

        static public bool IsNationalIDExists(CustomersDTO customer)
        {
            string query = "SELECT COUNT(*) FROM Customers WHERE NationalID = @NationalID";

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@NationalID", customer.NationalID);
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
    }
}
