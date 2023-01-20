using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Fixsomeoverlybroaduniquenessconstraints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_risk_providers_name",
                table: "risk_providers");

            migrationBuilder.DropIndex(
                name: "IX_risk_providers_org_id",
                table: "risk_providers");

            migrationBuilder.DropIndex(
                name: "risk_providers_name_key",
                table: "risk_providers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policy_types_name",
                table: "policy_types");

            migrationBuilder.DropIndex(
                name: "IX_policy_types_org_id",
                table: "policy_types");

            migrationBuilder.DropIndex(
                name: "policy_types_name_key",
                table: "policy_types");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policy_providers_name",
                table: "policy_providers");

            migrationBuilder.DropIndex(
                name: "IX_policy_providers_org_id",
                table: "policy_providers");

            migrationBuilder.DropIndex(
                name: "policy_providers_name_key",
                table: "policy_providers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policies_external_id",
                table: "policies");

            migrationBuilder.DropIndex(
                name: "policies_external_id_key",
                table: "policies");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_operators_name",
                table: "operators");

            migrationBuilder.DropIndex(
                name: "IX_operators_org_id",
                table: "operators");

            migrationBuilder.DropIndex(
                name: "operators_name_key",
                table: "operators");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_models_name",
                table: "models");

            migrationBuilder.DropIndex(
                name: "IX_models_org_id",
                table: "models");

            migrationBuilder.DropIndex(
                name: "models_name_key",
                table: "models");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_funds_name",
                table: "funds");

            migrationBuilder.DropIndex(
                name: "funds_name_key",
                table: "funds");

            migrationBuilder.DropIndex(
                name: "IX_funds_org_id",
                table: "funds");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_risk_providers_org_id_name",
                table: "risk_providers",
                columns: new[] { "org_id", "name" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policy_types_org_id_name",
                table: "policy_types",
                columns: new[] { "org_id", "name" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policy_providers_org_id_name",
                table: "policy_providers",
                columns: new[] { "org_id", "name" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policies_external_id_policy_provider_id",
                table: "policies",
                columns: new[] { "external_id", "policy_provider_id" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_operators_org_id_name",
                table: "operators",
                columns: new[] { "org_id", "name" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_models_org_id_name",
                table: "models",
                columns: new[] { "org_id", "name" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_funds_org_id_name",
                table: "funds",
                columns: new[] { "org_id", "name" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_risk_providers_org_id_name",
                table: "risk_providers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policy_types_org_id_name",
                table: "policy_types");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policy_providers_org_id_name",
                table: "policy_providers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_policies_external_id_policy_provider_id",
                table: "policies");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_operators_org_id_name",
                table: "operators");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_models_org_id_name",
                table: "models");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_funds_org_id_name",
                table: "funds");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_risk_providers_name",
                table: "risk_providers",
                column: "name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policy_types_name",
                table: "policy_types",
                column: "name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policy_providers_name",
                table: "policy_providers",
                column: "name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_policies_external_id",
                table: "policies",
                column: "external_id");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_operators_name",
                table: "operators",
                column: "name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_models_name",
                table: "models",
                column: "name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_funds_name",
                table: "funds",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_risk_providers_org_id",
                table: "risk_providers",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "risk_providers_name_key",
                table: "risk_providers",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_policy_types_org_id",
                table: "policy_types",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "policy_types_name_key",
                table: "policy_types",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_policy_providers_org_id",
                table: "policy_providers",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "policy_providers_name_key",
                table: "policy_providers",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policies_external_id_key",
                table: "policies",
                column: "external_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_operators_org_id",
                table: "operators",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "operators_name_key",
                table: "operators",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_models_org_id",
                table: "models",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "models_name_key",
                table: "models",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "funds_name_key",
                table: "funds",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_funds_org_id",
                table: "funds",
                column: "org_id");
        }
    }
}
