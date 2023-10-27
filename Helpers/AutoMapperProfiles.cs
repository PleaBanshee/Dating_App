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
            // Maps PhotoUrl to the Url property of the PhotoDto
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsProfilePic).Url));
                // This is a custom mapping
                // .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDto>();
        }
    }
}
