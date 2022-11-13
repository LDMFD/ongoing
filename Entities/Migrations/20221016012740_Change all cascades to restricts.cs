using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Changeallcascadestorestricts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_advisor_user",
                table: "advisors");

            migrationBuilder.DropForeignKey(
                name: "fk_client_user",
                table: "clients");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_fact_find",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "fees_reports");

            migrationBuilder.DropForeignKey(
                name: "fk_fees_report",
                table: "fees_reports");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "forecasts");

            migrationBuilder.DropForeignKey(
                name: "fk_forecast",
                table: "forecasts");

            migrationBuilder.DropForeignKey(
                name: "fk_fund_file",
                table: "funds");

            migrationBuilder.DropForeignKey(
                name: "fk_model_file",
                table: "models");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "modules");

            migrationBuilder.DropForeignKey(
                name: "fk_client_policy",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_policy_file",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "policy_funds");

            migrationBuilder.DropForeignKey(
                name: "fk_policy",
                table: "policy_funds");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "portfolios");

            migrationBuilder.DropForeignKey(
                name: "fk_policy",
                table: "portfolios");

            migrationBuilder.DropForeignKey(
                name: "fk_client_provider_discount",
                table: "provider_discounts");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "reviews");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_risk_level",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels");

            migrationBuilder.AddForeignKey(
                name: "fk_advisor_user",
                table: "advisors",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client_user",
                table: "clients",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "fact_finds",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_fact_find",
                table: "fact_finds",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "fees_reports",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_fees_report",
                table: "fees_reports",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "forecasts",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_forecast",
                table: "forecasts",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_fund_file",
                table: "funds",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_model_file",
                table: "models",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "modules",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client_policy",
                table: "policies",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_policy_file",
                table: "policies",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "policy_funds",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_policy",
                table: "policy_funds",
                column: "policy_id",
                principalTable: "policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "portfolios",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_policy",
                table: "portfolios",
                column: "policy_id",
                principalTable: "policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client_provider_discount",
                table: "provider_discounts",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "reviews",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "risk_assessments",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments",
                column: "questionnaire_file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_risk_level",
                table: "risk_assessments",
                column: "risk_level_id",
                principalTable: "risk_levels",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels",
                column: "risk_provider_id",
                principalTable: "risk_providers",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_advisor_user",
                table: "advisors");

            migrationBuilder.DropForeignKey(
                name: "fk_client_user",
                table: "clients");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_fact_find",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "fees_reports");

            migrationBuilder.DropForeignKey(
                name: "fk_fees_report",
                table: "fees_reports");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "forecasts");

            migrationBuilder.DropForeignKey(
                name: "fk_forecast",
                table: "forecasts");

            migrationBuilder.DropForeignKey(
                name: "fk_fund_file",
                table: "funds");

            migrationBuilder.DropForeignKey(
                name: "fk_model_file",
                table: "models");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "modules");

            migrationBuilder.DropForeignKey(
                name: "fk_client_policy",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_policy_file",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "policy_funds");

            migrationBuilder.DropForeignKey(
                name: "fk_policy",
                table: "policy_funds");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "portfolios");

            migrationBuilder.DropForeignKey(
                name: "fk_policy",
                table: "portfolios");

            migrationBuilder.DropForeignKey(
                name: "fk_client_provider_discount",
                table: "provider_discounts");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "reviews");

            migrationBuilder.DropForeignKey(
                name: "fk_client",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_risk_level",
                table: "risk_assessments");

            migrationBuilder.DropForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels");

            migrationBuilder.AddForeignKey(
                name: "fk_advisor_user",
                table: "advisors",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client_user",
                table: "clients",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "fact_finds",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_fact_find",
                table: "fact_finds",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "fees_reports",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_fees_report",
                table: "fees_reports",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "forecasts",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_forecast",
                table: "forecasts",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_fund_file",
                table: "funds",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_model_file",
                table: "models",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "modules",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client_policy",
                table: "policies",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_policy_file",
                table: "policies",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "policy_funds",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_policy",
                table: "policy_funds",
                column: "policy_id",
                principalTable: "policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "portfolios",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_policy",
                table: "portfolios",
                column: "policy_id",
                principalTable: "policies",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client_provider_discount",
                table: "provider_discounts",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "reviews",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_client",
                table: "risk_assessments",
                column: "client_id",
                principalTable: "clients",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments",
                column: "questionnaire_file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_risk_level",
                table: "risk_assessments",
                column: "risk_level_id",
                principalTable: "risk_levels",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_risk_provider",
                table: "risk_levels",
                column: "risk_provider_id",
                principalTable: "risk_providers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
