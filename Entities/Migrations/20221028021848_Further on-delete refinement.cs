using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Furtherondeleterefinement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_advisors_organisations_org_id",
                table: "advisors");

            migrationBuilder.DropForeignKey(
                name: "FK_clients_organisations_org_id",
                table: "clients");

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
                name: "FK_organisations_users_creator_id",
                table: "organisations");

            migrationBuilder.DropForeignKey(
                name: "FK_organisations_users_owner_id",
                table: "organisations");

            migrationBuilder.DropForeignKey(
                name: "FK_policy_providers_organisations_org_id",
                table: "policy_providers");

            migrationBuilder.DropForeignKey(
                name: "FK_policy_types_organisations_org_id",
                table: "policy_types");

            migrationBuilder.DropForeignKey(
                name: "FK_risk_providers_organisations_org_id",
                table: "risk_providers");

            migrationBuilder.DropTable(
                name: "riskassessment_templates");

            migrationBuilder.AddForeignKey(
                name: "fk_advisor_org",
                table: "advisors",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_client_org",
                table: "clients",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_fund_org",
                table: "funds",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_model_org",
                table: "models",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_modulepreset_org",
                table: "module_presets",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_operator_org",
                table: "operators",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_org_creator",
                table: "organisations",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_org_owner",
                table: "organisations",
                column: "owner_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_policyprovider_org",
                table: "policy_providers",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_policytype_org",
                table: "policy_types",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_risk_providers_organisations_org_id",
                table: "risk_providers",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_advisor_org",
                table: "advisors");

            migrationBuilder.DropForeignKey(
                name: "fk_client_org",
                table: "clients");

            migrationBuilder.DropForeignKey(
                name: "fk_fund_org",
                table: "funds");

            migrationBuilder.DropForeignKey(
                name: "fk_model_org",
                table: "models");

            migrationBuilder.DropForeignKey(
                name: "fk_modulepreset_org",
                table: "module_presets");

            migrationBuilder.DropForeignKey(
                name: "fk_operator_org",
                table: "operators");

            migrationBuilder.DropForeignKey(
                name: "fk_org_creator",
                table: "organisations");

            migrationBuilder.DropForeignKey(
                name: "fk_org_owner",
                table: "organisations");

            migrationBuilder.DropForeignKey(
                name: "fk_policyprovider_org",
                table: "policy_providers");

            migrationBuilder.DropForeignKey(
                name: "fk_policytype_org",
                table: "policy_types");

            migrationBuilder.DropForeignKey(
                name: "FK_risk_providers_organisations_org_id",
                table: "risk_providers");

            migrationBuilder.CreateTable(
                name: "riskassessment_templates",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    org_id = table.Column<int>(type: "integer", nullable: false),
                    label = table.Column<string>(type: "text", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_riskassessment_templates", x => x.id);
                    table.ForeignKey(
                        name: "FK_riskassessment_templates_organisations_org_id",
                        column: x => x.org_id,
                        principalTable: "organisations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_riskassessment_templates_org_id",
                table: "riskassessment_templates",
                column: "org_id");

            migrationBuilder.AddForeignKey(
                name: "FK_advisors_organisations_org_id",
                table: "advisors",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_clients_organisations_org_id",
                table: "clients",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

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
                name: "FK_organisations_users_creator_id",
                table: "organisations",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_organisations_users_owner_id",
                table: "organisations",
                column: "owner_id",
                principalTable: "users",
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
        }
    }
}
