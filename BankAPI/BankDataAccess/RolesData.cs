using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace BankDataAccess
{

    public class RoleDTO
    {
        public int RoleID; 
        public string RoleName;

        public RoleDTO( string name) {
            RoleName = name;
        }
    }
    public class RolesData
    {

        static public int InsertRole(RoleDTO roleDTO)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
                {
                    connection.Open();
                    string query = "INSERT INTO Addresses (RoleName) VALUES (@RoleName); SELECT SCOPE_IDENTITY();";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@RoleName", roleDTO.RoleName);

                        int id = Convert.ToInt32(command.ExecuteScalar());

                        return id;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inserting address: {ex.Message}");
                return -1;
            }
        }
    }
}
