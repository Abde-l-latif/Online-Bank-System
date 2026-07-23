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

        public class AuthenticationException : Exception
        {
            public string Field { get; }

            public AuthenticationException(string field, string message)
                : base(message)
            {
                Field = field;
            }
        }

        public class DataAccessException : Exception
        {
            public DataAccessException(string message, Exception innerException)
                : base(message, innerException)
            {
            }

        }
    }
}
