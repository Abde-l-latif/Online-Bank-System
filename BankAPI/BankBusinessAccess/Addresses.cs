using BankDataAccess;
using System.Xml.Linq;

namespace BankBusinessAccess
{
    public class Addresses
    {

        enum enMode { AddMode, UpdateMode }

        enMode mode = enMode.AddMode;

        public AddressDTO addressDTO { get; set; }

        public Addresses(AddressDTO addressDTO)
        {
            this.addressDTO = addressDTO;
            mode = enMode.UpdateMode;
        }

        private bool _AddAddress()
        {
            if(string.IsNullOrWhiteSpace(addressDTO.Country) || string.IsNullOrWhiteSpace(addressDTO.City) || 
                string.IsNullOrWhiteSpace(addressDTO.Street) || string.IsNullOrWhiteSpace(addressDTO.PostalCode))
            {
                throw new ArgumentException("All address fields must be provided and cannot be empty.");
            }

            addressDTO.AddressID = AddressesData.InsertAddress(addressDTO);

            return addressDTO.AddressID > 0;
        }

        public bool Save()
        {
            if (mode == enMode.AddMode)
            {
                if( _AddAddress())
                {
                    mode = enMode.UpdateMode;
                    return true;
                }
            }
            
            return false;
        }

    }
}
