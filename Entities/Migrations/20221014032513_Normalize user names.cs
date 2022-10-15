using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Normalizeusernames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "forenames",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "surname",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                "UPDATE users SET forenames = advisors.forenames FROM advisors WHERE advisors.user_id = users.id");
            migrationBuilder.Sql(
                "UPDATE users SET surname = advisors.surname FROM advisors WHERE advisors.user_id = users.id");
            migrationBuilder.Sql(
                "UPDATE users SET forenames = clients.forenames FROM clients WHERE clients.user_id = users.id");
            migrationBuilder.Sql(
                "UPDATE users SET surname = clients.surname FROM clients WHERE clients.user_id = users.id");
            
            migrationBuilder.DropColumn(
                name: "forenames",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "surname",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "forenames",
                table: "advisors");

            migrationBuilder.DropColumn(
                name: "surname",
                table: "advisors");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "forenames",
                table: "users");

            migrationBuilder.DropColumn(
                name: "surname",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "forenames",
                table: "clients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "surname",
                table: "clients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "forenames",
                table: "advisors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "surname",
                table: "advisors",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
