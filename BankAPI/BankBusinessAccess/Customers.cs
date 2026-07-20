using BankDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Customers
    {
        enum enMode { AddMode, UpdateMode }

        enMode mode = enMode.AddMode;
        public CustomersDTO customersDTO { get; set; }

        public Customers(CustomersDTO customersDTO)
        {
            this.customersDTO = customersDTO;
            mode = enMode.UpdateMode; 
        }

        Validations Validations = new Validations();

        static public Customers? Find(int id)
        {
            CustomersDTO? customersDTO = CustomersData.GetCustomerById(id);

            if (customersDTO != null)
            {
                return new Customers(customersDTO);
            }
            else
            {
                return null;
            }
        }

        private bool _AddCustomer()
        {
            if (string.IsNullOrWhiteSpace(customersDTO.FirstName) || string.IsNullOrWhiteSpace(customersDTO.LastName) ||
                string.IsNullOrWhiteSpace(customersDTO.PhoneNumber) || string.IsNullOrWhiteSpace(customersDTO.NationalID))
            {
                throw new CustomExceptions.ValidationException("FirstName, LastName, PhoneNumber, NationalID", "All customer fields must be provided and cannot be empty.");
            }

            if(!Validations.ValidatePhoneNumber(customersDTO.PhoneNumber))
            {
                throw new CustomExceptions.ValidationException("PhoneNumber", "Invalid phone number format.");
            }

            if(!Validations.ValidateMorrocanCIN(customersDTO.NationalID))
            {
                throw new CustomExceptions.ValidationException("NationalID", "Invalid national ID format.");
            }

            if(CustomersData.IsNationalIDExists(customersDTO.NationalID))
            {
                throw new CustomExceptions.ValidationException("NationalID", "National ID already exists.");
            }

            if (customersDTO.BirthDate.Date > DateTime.Today)
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Birth date cannot be in the future.");
            }
            else if (customersDTO.BirthDate.Date > DateTime.Today.AddYears(-18))
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Customer must be at least 18 years old.");
            }
            else if (customersDTO.BirthDate.Date < DateTime.Today.AddYears(-100))
            {
                throw new CustomExceptions.ValidationException("BirthDate", "Customer age cannot be more than 100 years.");
            }

            if (customersDTO.AddressID <= 0)
            {
                throw new CustomExceptions.ValidationException("AddressID", "Invalid address.");
            }

            customersDTO.Status = CustomersDTO.CustomerStatus.pending;

            customersDTO.CustomerId = CustomersData.InsertCustomer(customersDTO);


            return customersDTO.CustomerId > 0;
        }

        public bool Save()
        {
            if (mode == enMode.AddMode)
            {
                if (_AddCustomer())
                {
                    mode = enMode.UpdateMode;
                    return true;
                }
            }

            return false;
        }
    }
}
