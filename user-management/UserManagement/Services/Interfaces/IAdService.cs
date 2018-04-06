using UserManagement.Models;

namespace UserManagement.Services.Interfaces
{
    public interface IAdService
    {
        bool ValidateCredentials(string username, string password);
        ADUser FindByAccountName(string accountName);
        ADUser FindByEmail(string email);
    }
}
