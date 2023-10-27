using AutoMapper;
using Dating_App.DTOs;
using Dating_App.Entities;

namespace Dating_App.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        // Maps the entities to the DTOs
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>();

            CreateMap<Photo, PhotoDto>();
        }
    }
}
