using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    static public class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBusinessLayerServices(this IServiceCollection services)
        {
            services.AddScoped<IPasswordService, PasswordService>();
            services.AddScoped<IPasswordHasher<Users>, PasswordHasher<Users>>();
            services.AddScoped<Authentication>();

            return services;
        }
    }
}
