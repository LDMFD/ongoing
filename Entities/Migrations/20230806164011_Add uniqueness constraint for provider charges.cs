using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Adduniquenessconstraintforprovidercharges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_provider_charges_policy_provider_id",
                table: "provider_charges");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_provider_charges_policy_provider_id_boundary_charge",
                table: "provider_charges",
                columns: new[] { "policy_provider_id", "boundary", "charge" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_provider_charges_policy_provider_id_boundary_charge",
                table: "provider_charges");

            migrationBuilder.CreateIndex(
                name: "IX_provider_charges_policy_provider_id",
                table: "provider_charges",
                column: "policy_provider_id");
        }
    }
}
