using BankDataAccess;
using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class RegisterDTO
    {
        // Customer
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalID { get; set; }

        // User
        public string EmailAddress { get; set; }
        public string Password { get; set; }
        public string ImagePath { get; set; } = "";

        // Address
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string PostalCode { get; set; }
    }

    public class Authentication
    {
        enum Roles { Admin = 1 , Customer, Employee }

        private readonly IPasswordService _passwordService;

        public Authentication(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        Validations validations = new Validations();

        public UserDTO Register(RegisterDTO registerDTO)
        {

            validations.ValidateRegisterDTO(registerDTO);



            using (SqlConnection connection = new SqlConnection(SettingsData.ConnectionString))
            {
                connection.Open();

                SqlTransaction transaction = connection.BeginTransaction();

                try
                {
                    // Create AddressDTO
                    AddressDTO addressDTO = new AddressDTO(registerDTO.Country, registerDTO.City, registerDTO.Street, registerDTO.PostalCode);
                    addressDTO.AddressID = AddressesData.InsertAddress(addressDTO, connection, transaction);


                    // Create CustomersDTO
                    CustomersDTO customersDTO = new CustomersDTO
                    (
                        registerDTO.FirstName.Trim(),
                        registerDTO.LastName.Trim(),
                        registerDTO.BirthDate,
                        registerDTO.PhoneNumber,
                        addressDTO.AddressID,
                        registerDTO.NationalID
                    );

                    if (CustomersData.IsNationalIDExists(customersDTO))
                    {
                        throw new CustomExceptions.ValidationException("NationalID", "National ID already exists.");
                    }

                    customersDTO.CustomerId = CustomersData.InsertCustomer(customersDTO, connection, transaction);

                    // Create UserDTO
                    UserDTO userDTO = new UserDTO
                    (
                        registerDTO.EmailAddress,
                        _passwordService.HashPassword(registerDTO.Password),
                        true,
                        DateTime.MinValue,
                        customersDTO.CustomerId,
                        (int)Roles.Customer,
                        registerDTO.ImagePath
                    );

                    if (UsersData.IsEmailExists(userDTO))
                    {
                        throw new CustomExceptions.ValidationException("EmailAddress", "Email address already exists.");
                    }

                    userDTO.UserID = UsersData.InsertUser(userDTO, connection, transaction);

                    transaction.Commit();

                    return userDTO;

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
