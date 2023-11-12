using System.ComponentModel.DataAnnotations;

namespace Dating_App.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required] 
        public string Gender { get; set;}

        [Required] // make property nullable
        public DateOnly? DateOfBirth { get; set; } 

        [Required] 
        public string City { get; set; }

        [Required] 
        public string Country { get; set; }

        [Required]
        [StringLength(50,MinimumLength = 8)]
        public string Password { get; set; }
    }
}
