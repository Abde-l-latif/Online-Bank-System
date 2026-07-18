using BankDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Users
    {
        enum enMode { AddMode, UpdateMode }

        enMode mode = enMode.AddMode;

        public UserDTO userDTO { get; set; }

        public Users(UserDTO userDTO)
        {
            this.userDTO = userDTO;
            mode = enMode.UpdateMode;
        }

        public Users() { }

        private bool _AddUser()
        {
            if (string.IsNullOrWhiteSpace(userDTO.EmailAddress) || string.IsNullOrWhiteSpace(userDTO.HashPassword))
            {
                throw new ArgumentException("Email or Password is empty.");
            }

            userDTO.LastLogin = DateTime.MinValue;

            userDTO.UserID = UsersData.InsertUser(userDTO);

            return userDTO.UserID > 0;
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
            }

            return false;
        }
    }
}
