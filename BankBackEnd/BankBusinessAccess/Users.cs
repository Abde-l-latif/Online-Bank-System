using BankDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Users
    {
        enum enMode { AddMode, UpdateMode }

        enMode mode = enMode.AddMode;

        public UserDTO userDTO { get; set; }
        public userResponseDTO userResponseDTO { get; set; }


        private readonly IPasswordService _passwordService;


        public Users(UserDTO userDTO)
        {
            this.userDTO = userDTO;
            mode = enMode.UpdateMode;
        }

        public Users(userResponseDTO userResponseDTO)
        {
            this.userResponseDTO = userResponseDTO;
            mode = enMode.UpdateMode;
        }

        public Users(IPasswordService passwordService)
        {
            _passwordService = passwordService;
        }

        public Users() { }




        Validations Validations = new Validations();

        private bool _AddUser()
        {
            if (string.IsNullOrWhiteSpace(userDTO.EmailAddress) || string.IsNullOrWhiteSpace(userDTO.HashPassword))
            {
                throw new CustomExceptions.ValidationException("EmailAddress , HashPassword","Email or Password is empty.");
            }

            userDTO.HashPassword = _passwordService.HashPassword(userDTO.HashPassword);

            if (!Validations.ValidateEmail(userDTO.EmailAddress))
            {
                throw new CustomExceptions.ValidationException("EmailAddress", "Invalid email format.");
            } 
            else if (!Validations.ValidatePassword(userDTO.HashPassword))
            {
                throw new CustomExceptions.ValidationException("HashPassword", "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
            }

            if(UsersData.IsEmailExists(userDTO.EmailAddress))
            {
                throw new CustomExceptions.ValidationException("EmailAddress", "Email already exists.");
            }

            userDTO.LastLogin = DateTime.MinValue;

            userDTO.UserID = UsersData.InsertUser(userDTO);

            return userDTO.UserID > 0;
        }

        private bool _UpdateUser()
        {
            return UsersData.UpdateUser(this.userDTO) > 0;
        }

        static public Users? Find(int id)
        {
            UserDTO? userDTO = UsersData.GetUserById(id);
            if (userDTO != null)
            {
                return new Users(new userResponseDTO(userDTO));
            }
            else
            {
                return null;
            }
        }

        public bool Save()
        {

            if (mode == enMode.AddMode)
            {

                if (_AddUser())
                {
                    mode = enMode.UpdateMode;
                    return true;
                }
                else
                    return false;   
            }
            else 
                return _UpdateUser();    
        }
    }
}
