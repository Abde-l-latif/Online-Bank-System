using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace BankDataAccess
{
    public class UserDTO
    {
        public int UserID;
        public string EmailAddress;
        public string HashPassword;
        public bool IsActive;
        public DateTime LastLogin;
        public int CustomerID;
        public CustomersDTO Customer;
        public int RoleID;
        public RoleDTO Role;
        public DateTime CreatedAt;
        public DateTime UpdatedAt;
        public UserDTO(string EmailAddress, string hashPassword, bool isActive, DateTime lastLogin, int customerId, int roleId)
        {
            this.EmailAddress = EmailAddress;
            this.HashPassword = hashPassword;
            this.IsActive = isActive;
            this.LastLogin = lastLogin;
            this.CustomerID = customerId;
            this.RoleID = roleId;
        }
    }   
    public class UsersData
    {
        static public int InsertUser(UserDTO userDTO)
        {
            
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();
                
                return InsertUser(userDTO, connection, null);

            }

        }

        static public int InsertUser(UserDTO userDTO, SqlConnection connection, SqlTransaction? transaction)
        {
            try
            {
                string query = "INSERT INTO Users (EmailAddress, HashPassword, IsActive, LastLogin, CustomerID, RoleID) VALUES (@EmailAddress, @HashPassword, @IsActive, @LastLogin, @CustomerID, @RoleID); SELECT SCOPE_IDENTITY();";

                using (SqlCommand command = new SqlCommand(query, connection, transaction))
                {
                    command.Parameters.AddWithValue("@EmailAddress", userDTO.EmailAddress);
                    command.Parameters.AddWithValue("@HashPassword", userDTO.HashPassword);
                    command.Parameters.AddWithValue("@IsActive", userDTO.IsActive);

                    if (userDTO.LastLogin == DateTime.MinValue)
                    {
                        command.Parameters.AddWithValue("@LastLogin", DBNull.Value);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@LastLogin", userDTO.LastLogin);
                    }

                    command.Parameters.AddWithValue("@CustomerID", userDTO.CustomerID);
                    command.Parameters.AddWithValue("@RoleID", userDTO.RoleID);
                    int id = Convert.ToInt32(command.ExecuteScalar());
                    return id;
                }
              
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting user: {ex.Message}");
                return -1;
            }
        }
    }
}
