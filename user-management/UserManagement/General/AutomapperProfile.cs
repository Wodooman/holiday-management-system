using AutoMapper;
using UserManagement.Database;
using UserManagement.Models;

namespace UserManagement.General
{
    public class AutomapperProfile : Profile
    {
        public AutomapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<ADUser, User>();
        }
    }
}
