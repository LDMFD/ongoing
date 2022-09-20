using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class AddUUIDtoModulePreset : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "uid",
                table: "module_presets",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_module_presets_uid",
                table: "module_presets",
                column: "uid");

            migrationBuilder.CreateIndex(
                name: "module_presets_uid_key",
                table: "module_presets",
                column: "uid",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_module_presets_uid",
                table: "module_presets");

            migrationBuilder.DropIndex(
                name: "module_presets_uid_key",
                table: "module_presets");

            migrationBuilder.DropColumn(
                name: "uid",
                table: "module_presets");
        }
    }
}
