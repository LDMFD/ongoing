using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Adduniquenessconstraintforrisklevels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_risk_levels_risk_provider_id",
                table: "risk_levels");

            migrationBuilder.AlterColumn<int>(
                name: "risk_provider_id",
                table: "risk_levels",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "level",
                table: "risk_levels",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "label",
                table: "risk_levels",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_risk_levels_risk_provider_id_label",
                table: "risk_levels",
                columns: new[] { "risk_provider_id", "label" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_risk_levels_risk_provider_id_level",
                table: "risk_levels",
                columns: new[] { "risk_provider_id", "level" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_risk_levels_risk_provider_id_label",
                table: "risk_levels");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_risk_levels_risk_provider_id_level",
                table: "risk_levels");

            migrationBuilder.AlterColumn<int>(
                name: "risk_provider_id",
                table: "risk_levels",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "level",
                table: "risk_levels",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "label",
                table: "risk_levels",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_risk_levels_risk_provider_id",
                table: "risk_levels",
                column: "risk_provider_id");
        }
    }
}
