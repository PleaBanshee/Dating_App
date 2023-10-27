using AutoMapper;

namespace Dating_App.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            // This is a one-to-many relationship
            CreateMap<Entities.AppUser, DTOs.MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.ProfilePic).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            // This is a many-to-many relationship
            CreateMap<Entities.Photo, DTOs.PhotoDto>();
            // This is a one-to-many relationship
            CreateMap<DTOs.MemberUpdateDto, Entities.AppUser>();
        }
    }
}
