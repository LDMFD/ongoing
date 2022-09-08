using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class RiskProviderneedstocascadedeletes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels");

            migrationBuilder.AddForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels",
                column: "risk_provider_id",
                principalTable: "risk_providers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels");

            migrationBuilder.AddForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels",
                column: "risk_provider_id",
                principalTable: "risk_providers",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
