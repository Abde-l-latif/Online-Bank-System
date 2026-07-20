using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankDataAccess
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string EmailAddress { get; set; }
        public string HashPassword { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastLogin { get; set; }
        public int CustomerID { get; set; }
        public CustomersDTO Customer { get; set; }
        public int RoleID { get; set; }
        public RoleDTO Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public string ImagePath { get; set; }
        public UserDTO(string EmailAddress, string hashPassword, bool isActive, DateTime lastLogin, int customerId, int roleId, string imagePath)
        {
            this.EmailAddress = EmailAddress;
            this.HashPassword = hashPassword;
            this.IsActive = isActive;
            this.LastLogin = lastLogin;
            this.CustomerID = customerId;
            this.RoleID = roleId;
            this.ImagePath = imagePath;
        }

        public UserDTO() { }
    }   

    public class userResponseDTO
    {
        public int UserID { get; set; }
        public string EmailAddress { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastLogin { get; set; }
        public int CustomerID { get; set; }
        public CustomersDTO Customer { get; set; }
        public int RoleID { get; set; }
        public RoleDTO Role { get; set; }
        public string ImagePath { get; set; }
        public userResponseDTO(UserDTO user)
        {
            UserID = user.UserID;
            EmailAddress = user.EmailAddress;
            IsActive = user.IsActive;
            LastLogin = user.LastLogin;
            CustomerID = user.CustomerID;
            Customer = CustomersData.GetCustomerById(CustomerID) ?? new CustomersDTO();
            RoleID = user.RoleID;
            Role = RolesData.GetRoleById(RoleID) ?? new RoleDTO();
            ImagePath = user.ImagePath;
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
                string query = "INSERT INTO Users (EmailAddress, HashPassword, IsActive, LastLogin, CustomerID, RoleID, ImagePath) VALUES (@EmailAddress, @HashPassword, @IsActive, @LastLogin, @CustomerID, @RoleID, @ImagePath); SELECT SCOPE_IDENTITY();";

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

                    if (string.IsNullOrEmpty(userDTO.ImagePath))
                    {
                        command.Parameters.AddWithValue("@ImagePath", DBNull.Value);
                    }
                    else
                    {
                        command.Parameters.AddWithValue("@ImagePath", userDTO.ImagePath);
                    }

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

        static public bool IsEmailExists(string emailAddress)
        {
            string query = "SELECT COUNT(*) FROM Users WHERE EmailAddress = @EmailAddress";
            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EmailAddress", emailAddress);
                        int count = (int)command.ExecuteScalar();
                        return count > 0;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error checking email existence: {ex.Message}");
                    return false;
                }
            }
        }

        static public userResponseDTO? GetUserById(int userID)
        {
            string query = "SELECT * FROM Users WHERE UserID = @UserID";

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                        command.Parameters.AddWithValue("@UserID", userID);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                return new userResponseDTO(new UserDTO(
                                    reader["EmailAddress"].ToString() ?? "",
                                    reader["HashPassword"].ToString() ?? "",
                                    Convert.ToBoolean(reader["IsActive"]),
                                    reader["LastLogin"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["LastLogin"]),
                                    Convert.ToInt32(reader["CustomerID"]),
                                    Convert.ToInt32(reader["RoleID"]),
                                    reader["ImagePath"].ToString() ?? ""
                                )
                                {
                                    UserID = Convert.ToInt32(reader["UserID"]),
                                    //Customer = CustomersData.GetCustomerById(Convert.ToInt32(reader["CustomerID"])) ?? new CustomersDTO(),
                                    //Role = RolesData.GetRoleById(Convert.ToInt32(reader["RoleID"])) ?? new RoleDTO(),
                                });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error retrieving user: {ex.Message}");
                    return null;
                }
            }
            return null;
        }
    }
}
