using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace BankBusinessAccess
{
    public class PasswordService : IPasswordService
    {

        private readonly IPasswordHasher<Users> _hashPassword;

        public PasswordService(IPasswordHasher<Users> passwordHasher)
        {
            this._hashPassword = passwordHasher;
        }

        public string HashPassword(string plainPassword)
        {
            return _hashPassword.HashPassword(new Users(), plainPassword);
        }
        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            var result = _hashPassword.VerifyHashedPassword(new Users(), hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success
                || result == PasswordVerificationResult.SuccessRehashNeeded;
        }
        
    }
}
