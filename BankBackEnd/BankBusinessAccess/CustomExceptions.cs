using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class CustomExceptions
    {
        public class ValidationException : Exception
        {
            public string Field { get; }

            public ValidationException(string field, string message)
                : base(message)
            {
                Field = field;
            }
        }

    }
}
