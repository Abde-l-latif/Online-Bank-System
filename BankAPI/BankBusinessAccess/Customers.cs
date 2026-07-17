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

        private bool _AddCustomer()
        {
            if (string.IsNullOrWhiteSpace(customersDTO.FirstName) || string.IsNullOrWhiteSpace(customersDTO.LastName) ||
                string.IsNullOrWhiteSpace(customersDTO.PhoneNumber) || string.IsNullOrWhiteSpace(customersDTO.NationalID))
            {
                throw new ArgumentException("All customer fields must be provided and cannot be empty.");
            }

            if((DateTime.Now.Year - customersDTO.BirthDate.Year) < 18)
            {
                throw new ArgumentException("Customer must be at least 18 years old.");
            }

            if(customersDTO.AddressID <= 0)
            {
                throw new ArgumentException("Invalid address.");
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
