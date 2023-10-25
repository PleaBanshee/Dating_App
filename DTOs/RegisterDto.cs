using System.ComponentModel.DataAnnotations;

namespace Dating_App.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(50,MinimumLength = 8)]
        public string Password { get; set; }
    }
}
