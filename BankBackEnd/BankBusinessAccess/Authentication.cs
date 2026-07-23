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

    public class Authentication
    {
        enum Roles { Admin = 1 , Customer, Employee }

        private readonly IPasswordService _passwordService;

        public Authentication(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        Validations validations = new Validations();

        public userResponseDTO Register(RegisterDTO registerDTO)
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

                    if (CustomersData.IsNationalIDExists(customersDTO.NationalID))
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

                    if (UsersData.IsEmailExists(userDTO.EmailAddress))
                    {
                        throw new CustomExceptions.ValidationException("EmailAddress", "Email address already exists.");
                    }

                    userDTO.UserID = UsersData.InsertUser(userDTO, connection, transaction);

                    transaction.Commit();

                    return new userResponseDTO(userDTO);

                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
            
        }

        public userResponseDTO Login(string emailAddress, string password)
        {
            if (string.IsNullOrWhiteSpace(emailAddress))
            {
                throw new CustomExceptions.ValidationException("EmailAddress", "Email address is required.");
            }
    
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new CustomExceptions.ValidationException("Password", "Password is required.");
            }

            UserDTO? user = UsersData.GetUserByEmail(emailAddress);
            
            if (user == null || !_passwordService.VerifyPassword(password, user.HashPassword))
            {
                throw new CustomExceptions.AuthenticationException("Credentials", "Invalid email or password.");
            }

            if (!user.IsActive)
            {
                throw new CustomExceptions.AuthenticationException(
                    "Account",
                    "Your account has been disabled.");
            }

            user.LastLogin = DateTime.Now;

            Users U = new Users(user);

            try
            {
                U.Save();
            }
            catch (SqlException ex)
            {
                throw new CustomExceptions.DataAccessException("Failed to update last login.", ex);
            }

            return new userResponseDTO(user);
        }
    }
}
