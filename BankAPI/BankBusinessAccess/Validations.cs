using BankDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;


namespace BankBusinessAccess
{
    public class Validations
    {

        public bool ValidateEmail(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern);
        }

        public bool ValidateMorrocanCIN(string nationalID)
        {
            string pattern = @"^[A-Z]{1,2}\d{4,6}$";
            return Regex.IsMatch(nationalID, pattern);
        }

        public bool ValidatePhoneNumber(string phoneNumber)
        {
            string pattern = @"^\+212\d{9}$";
            return Regex.IsMatch(phoneNumber, pattern);
        }

        public bool ValidatePassword(string password)
        {
            // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character
            string pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$";
            return Regex.IsMatch(password, pattern);
        }

        public bool ValidateRegisterDTO(RegisterDTO registerDTO)
        {
            if (string.IsNullOrWhiteSpace(registerDTO.FirstName) || string.IsNullOrWhiteSpace(registerDTO.LastName) ||
                string.IsNullOrWhiteSpace(registerDTO.PhoneNumber) || string.IsNullOrWhiteSpace(registerDTO.NationalID) ||
                string.IsNullOrWhiteSpace(registerDTO.EmailAddress) || string.IsNullOrWhiteSpace(registerDTO.Password) ||
                string.IsNullOrWhiteSpace(registerDTO.Country) || string.IsNullOrWhiteSpace(registerDTO.City) ||
                string.IsNullOrWhiteSpace(registerDTO.Street) || string.IsNullOrWhiteSpace(registerDTO.PostalCode))
            {
                throw new CustomExceptions.ValidationException("registerDTO", "All fields must be provided and cannot be empty.");
            }
            if (registerDTO.BirthDate.Date > DateTime.Today)
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Birth date cannot be in the future.");
            }
            else if (registerDTO.BirthDate.Date > DateTime.Today.AddYears(-18))
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Customer must be at least 18 years old.");
            }
            else if (registerDTO.BirthDate.Date < DateTime.Today.AddYears(-100))
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Customer age cannot be more than 100 years.");
            }
            if (!ValidateEmail(registerDTO.EmailAddress))
            {
                throw new CustomExceptions.ValidationException("EmailAddress", "Invalid email address format.");
            }

            if (!ValidateMorrocanCIN(registerDTO.NationalID))
            {
                throw new CustomExceptions.ValidationException("NationalID", "Invalid Moroccan National ID format.");
            }

            if (!ValidatePhoneNumber(registerDTO.PhoneNumber))
            {
                throw new CustomExceptions.ValidationException("PhoneNumber", "Invalid Moroccan phone number format.");
            }

            if (!ValidatePassword(registerDTO.Password))
            {
                throw new CustomExceptions.ValidationException("Password", "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
            }

            return true;
        }
    }
}
