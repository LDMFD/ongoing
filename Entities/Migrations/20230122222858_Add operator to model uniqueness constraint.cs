using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Addoperatortomodeluniquenessconstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_models_org_id_name",
                table: "models");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_models_org_id_name_operator_id",
                table: "models",
                columns: new[] { "org_id", "name", "operator_id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_models_org_id_name_operator_id",
                table: "models");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_models_org_id_name",
                table: "models",
                columns: new[] { "org_id", "name" });
        }
    }
}
