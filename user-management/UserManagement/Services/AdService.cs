using System;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using UserManagement.General.Exceptions;
using UserManagement.Models;
using UserManagement.Services.Interfaces;
using UserManagement.General.Logging;

namespace UserManagement.Services
{
    public class AdService : IAdService
    {
        private const string LdapDomain = "";
        private const string LdapPath = "LDAP://matone.materialise:389/DC=matone,DC=materialise";
        private const string LDAPUser = @"";
        private const string LDAPPassword = @"";

        public bool ValidateCredentials(string username, string password)
        {
            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, LdapDomain))
            {
                try
                {
                    return pc.ValidateCredentials(username, password);
                }
                catch (Exception ex)
                {
                    //TODO: Log
                    throw;
                }

            }
        }
     
        public ADUser FindByAccountName(string accountName)
        {
            SearchResult foundEntry = null;
            try
            {
                var entry = new DirectoryEntry(LdapPath, LDAPUser, LDAPPassword, AuthenticationTypes.Secure);

                var directorySearch = new DirectorySearcher(entry);
                directorySearch.Filter = "(&(objectClass=user)(samaccountname=" + accountName + "))";

                foundEntry = directorySearch.FindOne();
            }
            catch (Exception ex)
            {
                Log.For(this).Error(ex);
                throw;
            }
            if (foundEntry == null)
                throw new NotFoundException("User with such email not exists");

            return Convert(foundEntry);
        }

        public ADUser FindByEmail(string email)
        {
            SearchResult foundEntry = null;
            try
            {
                var entry = new DirectoryEntry(LdapPath, LDAPUser, LDAPPassword, AuthenticationTypes.Secure);

                var directorySearch = new DirectorySearcher(entry);
                directorySearch.Filter = "(&(objectClass=user)(mail=" + email + "))";

                foundEntry = directorySearch.FindOne();
            }
            catch (Exception ex)
            {
                Log.For(this).Error(ex);
                throw;
            }

            if (foundEntry == null)
                throw new NotFoundException("User with such email not exists");

            return Convert(foundEntry);
        }

        private ADUser Convert(SearchResult searchResult)
        {
            if (searchResult == null) return null;

            var user = new ADUser
            {
                Description = GetPropertyValue(searchResult, "description"),
                DisplayName = GetPropertyValue(searchResult, "displayname"),
                LastName = GetPropertyValue(searchResult, "sn"),
                FirstName = GetPropertyValue(searchResult, "givenname"),
                Department = GetPropertyValue(searchResult, "department"),
                Email = GetPropertyValue(searchResult, "mail"),
                AccountName = GetPropertyValue(searchResult, "samaccountname"),
                PhysicalDeliveryOfficeName = GetPropertyValue(searchResult, "physicaldeliveryofficename"),
                TelephoneNumber = GetPropertyValue(searchResult, "telephonenumber"),
                Title = GetPropertyValue(searchResult, "title")
            };

            var whencreated = GetPropertyValue(searchResult, "whencreated");
            if (whencreated != null)
            {
                user.WhenCreated = DateTime.Parse(whencreated);
            }

            return user;       
        }

        private string GetPropertyValue(SearchResult searchResult, string propertyName)
        {
            var property = searchResult.Properties.Contains(propertyName) ? searchResult.Properties[propertyName] : null;
            if (property == null || property.Count == 0) return null;

            return property[0].ToString();
        }

        private string ToString(SearchResult searchResult)
        {
            var result = "";
            foreach (var propName in searchResult.Properties.PropertyNames)
            {
                var property = searchResult.Properties[propName.ToString()];
                var value = property.Count == 1 ? property[0].ToString() : "";

                result += $"{propName}={value}\n";
            }
            return result;
        }
    }
}
