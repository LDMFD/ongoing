using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class AdduniquenessconstraintforModulePresets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_module_presets_org_id",
                table: "module_presets");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_module_presets_org_id_module_type",
                table: "module_presets",
                columns: new[] { "org_id", "module_type" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_module_presets_org_id_module_type",
                table: "module_presets");

            migrationBuilder.CreateIndex(
                name: "IX_module_presets_org_id",
                table: "module_presets",
                column: "org_id");
        }
    }
}
