using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Changeproviderchargetierstodecimal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "desc",
                table: "provider_charges");

            migrationBuilder.DropColumn(
                name: "sequence",
                table: "provider_charges");

            migrationBuilder.AddColumn<decimal>(
                name: "boundary",
                table: "provider_charges",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "boundary",
                table: "provider_charges");

            migrationBuilder.AddColumn<string>(
                name: "desc",
                table: "provider_charges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "sequence",
                table: "provider_charges",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
