using BankDataAccess;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class UserService
    {

        public class UpdateProfileDTO
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
        }

        private readonly IPasswordService _passwordService;

        public UserService(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        public bool ChangePassword(int userID, string currentPassword, string newPassword)
        {
            Users? user = Users.Find(userID);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }


            if(!_passwordService.VerifyPassword(currentPassword, user.userDTO.HashPassword))
            {
                throw new CustomExceptions.AuthenticationException("Credentials", "Current password is incorrect.");
            }

            user.userDTO.HashPassword = _passwordService.HashPassword(newPassword);

            return user.Save();

        }

        public bool UpdateProfile(int userID, UpdateProfileDTO dto)
        {
            Users? user = Users.Find(userID);

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            Customers? customer = Customers.Find(user.userDTO.CustomerID);

            if (customer == null)
            {
                throw new KeyNotFoundException("Customer not found.");
            }

            user.userDTO.EmailAddress = dto.Email;

            customer.customersDTO.FirstName = dto.FirstName;
            customer.customersDTO.LastName = dto.LastName;
            customer.customersDTO.PhoneNumber = dto.PhoneNumber;

            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                using SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    CustomersData.UpdateCustomer(customer.customersDTO , connection, transaction);

                    UsersData.UpdateUser(user.userDTO , connection, transaction);

                    transaction.Commit();

                    return true;

                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

    }
}
