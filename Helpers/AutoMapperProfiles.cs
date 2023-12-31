﻿using AutoMapper;
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
                .ForMember(dest => dest.PhotoUrl,
                opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsProfilePic).Url))
                // This is a custom mapping
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.GetAge()));

            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<RegisterDto, AppUser>();

            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl,
                opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsProfilePic).Url))
                .ForMember(dest => dest.RecipientPhotoUrl,
                opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x => x.IsProfilePic).Url));

            // Mapes DateTimes to universal times
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

            // Maps optional datetimes to universal times
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        }
    }
}
