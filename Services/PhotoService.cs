﻿using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Dating_App.Helpers;
using Dating_App.Interfaces;
using Microsoft.Extensions.Options;

namespace Dating_App.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IHostEnvironment _env;

        // Inject cloudinary settings
        public PhotoService(IOptions<CloudinarySettings> config, IHostEnvironment env)
        {
            _env = env;
            var account = new Account();

            if (_env.IsDevelopment()) 
            {
                account = new Account
                (
                    config.Value.CloudName,
                    config.Value.ApiKey,
                    config.Value.ApiSecret
                );
            }
            else
            {
                account = new Account
                {
                    Cloud = Environment.GetEnvironmentVariable("CloudName"),
                    ApiKey = Environment.GetEnvironmentVariable("ApiKey"),
                    ApiSecret = Environment.GetEnvironmentVariable("ApiSecret")
                };
            }

            _cloudinary = new Cloudinary(account);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // create and manage a Stream from a file's open read stream, dispose of it when no longer in use
                // Gravity: image focus
                using var stream = file.OpenReadStream();
    
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                    Folder = "dating_app_images"
                };
    
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
             }
    
             return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result;
        }
    }
}
