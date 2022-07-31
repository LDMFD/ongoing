using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Amplifa.Migrations
{
    public partial class Makeriskassessmentfileoptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "questionnaire_file_id",
                table: "risk_assessments",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "questionnaire_file_id",
                table: "risk_assessments",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
