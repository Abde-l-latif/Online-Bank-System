using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public interface IPasswordService
    {
        string HashPassword(string plainPassword);
        bool VerifyPassword(string hashedPassword, string providedPassword);

    }
}
