using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dating_App.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProfilePic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfilePic",
                table: "Photos",
                newName: "IsProfilePic");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsProfilePic",
                table: "Photos",
                newName: "ProfilePic");
        }
    }
}
