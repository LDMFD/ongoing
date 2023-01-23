using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Addclienttopolicyuniquenessconstraint : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_policies_external_id_policy_provider_id",
                table: "policies");

            migrationBuilder.DropIndex(
                name: "IX_policies_client_id",
                table: "policies");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policies_client_id_policy_provider_id_external_id",
                table: "policies",
                columns: new[] { "client_id", "policy_provider_id", "external_id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_policies_client_id_policy_provider_id_external_id",
                table: "policies");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policies_external_id_policy_provider_id",
                table: "policies",
                columns: new[] { "external_id", "policy_provider_id" });

            migrationBuilder.CreateIndex(
                name: "IX_policies_client_id",
                table: "policies",
                column: "client_id");
        }
    }
}
