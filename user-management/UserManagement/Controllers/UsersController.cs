using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using UserManagement.Database;
using UserManagement.General;
using UserManagement.General.Exceptions;
using UserManagement.Models;
using UserManagement.Services.Interfaces;

namespace UserManagement.Controllers
{
    /// <summary>
    /// User management controller
    /// </summary>
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly UserManagementDBContext _context;
        private readonly IMapper _mapper;
        private readonly IAdService _adService;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
        public UsersController(UserManagementDBContext context, IMapper mapper, IAdService adService)
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
        {
            _context = context;
            _mapper = mapper;
            _adService = adService;
        }

        /// <summary>
        /// Get list of registered users
        /// </summary>
        /// <returns>List of UserModel</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserModel>), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public IEnumerable<UserModel> Get()
        {
            return _context.Users
                .Select(c => _mapper.Map<UserModel>(c))
                .ToList();
        }

        /// <summary>
        /// Get details about specific user
        /// </summary>
        /// <returns>UserModel</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> Get(int id)
        {
            var user = _context.Users.FirstOrDefault(c => c.Id == id);
            if (user == null) throw new NotFoundException("There is no user with such Id");


            var result = _mapper.Map<UserModel>(user);
            return Ok(result);
        }

        /// <summary>
        /// Register a new user (by email from Active Directory)
        /// </summary>
        /// <param name="model">Model with email</param>
        [HttpPost]
        [ProducesResponseType(typeof(UserModel), 201)]
        [ProducesResponseType(typeof(ErrorResponse), 404)]
        [ProducesResponseType(typeof(ErrorResponse), 500)]
        public async Task<IActionResult> Post([FromBody]RegisterUserModel model)
        {
            var adUser = _adService.FindByEmail(model.Email); //Note: working only in Materialise network - so needed VPN

            var user = _mapper.Map<User>(adUser);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<UserModel>(user);

            return new JsonResult(result) { StatusCode = 201 };
        }
    }
}
