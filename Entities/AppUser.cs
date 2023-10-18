namespace Dating_App.Entities;

public class AppUser
{
    public int Id { get; set; }

    public string UserName { get; set; } // optional property

    public byte[] PasswordHash { get; set; }

    public byte[] PasswordSalt { get; set; }
}