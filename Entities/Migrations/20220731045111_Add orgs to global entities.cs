using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Addorgstoglobalentities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "riskassessment_templates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "risk_providers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "policy_types",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "policy_providers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "operators",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "module_presets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "funds",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_riskassessment_templates_org_id",
                table: "riskassessment_templates",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_risk_providers_org_id",
                table: "risk_providers",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_types_org_id",
                table: "policy_types",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_providers_org_id",
                table: "policy_providers",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_operators_org_id",
                table: "operators",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_module_presets_org_id",
                table: "module_presets",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_models_org_id",
                table: "models",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_funds_org_id",
                table: "funds",
                column: "org_id");

            migrationBuilder.AddForeignKey(
                name: "FK_funds_organisations_org_id",
                table: "funds",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_models_organisations_org_id",
                table: "models",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_module_presets_organisations_org_id",
                table: "module_presets",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_operators_organisations_org_id",
                table: "operators",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_policy_providers_organisations_org_id",
                table: "policy_providers",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_policy_types_organisations_org_id",
                table: "policy_types",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_risk_providers_organisations_org_id",
                table: "risk_providers",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_riskassessment_templates_organisations_org_id",
                table: "riskassessment_templates",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_funds_organisations_org_id",
                table: "funds");

            migrationBuilder.DropForeignKey(
                name: "FK_models_organisations_org_id",
                table: "models");

            migrationBuilder.DropForeignKey(
                name: "FK_module_presets_organisations_org_id",
                table: "module_presets");

            migrationBuilder.DropForeignKey(
                name: "FK_operators_organisations_org_id",
                table: "operators");

            migrationBuilder.DropForeignKey(
                name: "FK_policy_providers_organisations_org_id",
                table: "policy_providers");

            migrationBuilder.DropForeignKey(
                name: "FK_policy_types_organisations_org_id",
                table: "policy_types");

            migrationBuilder.DropForeignKey(
                name: "FK_risk_providers_organisations_org_id",
                table: "risk_providers");

            migrationBuilder.DropForeignKey(
                name: "FK_riskassessment_templates_organisations_org_id",
                table: "riskassessment_templates");

            migrationBuilder.DropIndex(
                name: "IX_riskassessment_templates_org_id",
                table: "riskassessment_templates");

            migrationBuilder.DropIndex(
                name: "IX_risk_providers_org_id",
                table: "risk_providers");

            migrationBuilder.DropIndex(
                name: "IX_policy_types_org_id",
                table: "policy_types");

            migrationBuilder.DropIndex(
                name: "IX_policy_providers_org_id",
                table: "policy_providers");

            migrationBuilder.DropIndex(
                name: "IX_operators_org_id",
                table: "operators");

            migrationBuilder.DropIndex(
                name: "IX_module_presets_org_id",
                table: "module_presets");

            migrationBuilder.DropIndex(
                name: "IX_models_org_id",
                table: "models");

            migrationBuilder.DropIndex(
                name: "IX_funds_org_id",
                table: "funds");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "riskassessment_templates");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "risk_providers");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "policy_types");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "policy_providers");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "operators");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "module_presets");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "models");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "funds");
        }
    }
}
