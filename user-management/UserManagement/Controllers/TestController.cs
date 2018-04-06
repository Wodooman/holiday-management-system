using Microsoft.AspNetCore.Mvc;
using UserManagement.Database;
using UserManagement.Models;
using UserManagement.Services;

namespace UserManagement.Controllers
{
    /// <summary>
    /// Controller with test methods
    /// </summary>
    [Produces("application/json")]
    [Route("api/test")]
    public class TestController : Controller
    {
        private readonly UserManagementDBContext _context;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
        public TestController(UserManagementDBContext context)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
        {
            _context = context;
        }

        /// <summary>
        /// Get user by email from ActiveDirectory (from AD can be get much more details than is stored in UserManagement service)
        /// </summary>
        /// <param name="email">Email of user</param>
        /// <returns>Details about user from Active Directory</returns>
        [HttpGet("api/test/user/{email}")]
        [ProducesResponseType(typeof(ADUser), 200)]
        public ADUser Get(string email)
        {
            var adService = new AdService();
            var result = adService.FindByEmail(email);
            return result;
        }
    }
}