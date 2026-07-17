using BankDataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankBusinessAccess
{
    public class Roles
    {
        enum enMode { AddMode, UpdateMode }

        enMode mode = enMode.AddMode;

        public RoleDTO roleDTO { get; set; }

        public Roles(RoleDTO roleDTO)
        {
            this.roleDTO = roleDTO;
            mode = enMode.UpdateMode;
        }

        private bool _AddRole()
        {
            if (string.IsNullOrWhiteSpace(roleDTO.RoleName))
            {
                throw new ArgumentException("Role name must be provided and cannot be empty.");
            }

            roleDTO.RoleID = RolesData.InsertRole(roleDTO);

            return roleDTO.RoleID > 0;
        }

        public bool Save()
        {
            if (mode == enMode.AddMode)
            {
                if (_AddRole())
                {
                    mode = enMode.UpdateMode;
                    return true;
                }
            }

            return false;
        }
    }
}
