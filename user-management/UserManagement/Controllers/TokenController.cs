using Microsoft.AspNetCore.Mvc;
using UserManagement.Models;
using UserManagement.Services;

namespace UserManagement.Controllers
{
    [Produces("application/json")]
    [Route("api/Token")]
    public class TokenController : Controller
    {
        // POST api/users
        [HttpPost]
        public void Post([FromBody]CreateTokenModel model)
        {
            //TODO:
            var adService = new AdService();
            var valid = adService.ValidateCredentials(model.Login, model.Password);

            //generate token
            //return token
        }
    }
}