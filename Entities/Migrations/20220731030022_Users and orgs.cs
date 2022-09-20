using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Ongoing.Entities;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Usersandorgs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "type",
                table: "users");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_forecast,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .Annotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .Annotation("Npgsql:Enum:review_state", "draft,final")
                .Annotation("Npgsql:Enum:user_type", "superuser,owner,admin,advisor,client")
                .OldAnnotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_forecast,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .OldAnnotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .OldAnnotation("Npgsql:Enum:review_state", "draft,final")
                .OldAnnotation("Npgsql:Enum:user_type", "admin,advisor,client");

            migrationBuilder.AddColumn<int>(
                name: "org_id",
                table: "clients",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "uid",
                table: "clients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_clients_uid",
                table: "clients",
                column: "uid");

            migrationBuilder.CreateTable(
                name: "organisations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    owner_id = table.Column<int>(type: "integer", nullable: false),
                    creator_id = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organisations", x => x.id);
                    table.UniqueConstraint("AK_organisations_name", x => x.name);
                    table.UniqueConstraint("AK_organisations_uid", x => x.uid);
                    table.ForeignKey(
                        name: "FK_organisations_users_creator_id",
                        column: x => x.creator_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_organisations_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "advisors",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    org_id = table.Column<int>(type: "integer", nullable: false),
                    forenames = table.Column<string>(type: "text", nullable: false),
                    surname = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advisors", x => x.id);
                    table.UniqueConstraint("AK_advisors_uid", x => x.uid);
                    table.UniqueConstraint("AK_advisors_user_id", x => x.user_id);
                    table.ForeignKey(
                        name: "FK_advisors_organisations_org_id",
                        column: x => x.org_id,
                        principalTable: "organisations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_clients_org_id",
                table: "clients",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "advisors_user_id_key",
                table: "advisors",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_advisors_org_id",
                table: "advisors",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "IX_organisations_creator_id",
                table: "organisations",
                column: "creator_id");

            migrationBuilder.CreateIndex(
                name: "IX_organisations_owner_id",
                table: "organisations",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "organisations_name_key",
                table: "organisations",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "organisations_uid_key",
                table: "organisations",
                column: "uid",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_clients_organisations_org_id",
                table: "clients",
                column: "org_id",
                principalTable: "organisations",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_clients_organisations_org_id",
                table: "clients");

            migrationBuilder.DropTable(
                name: "advisors");

            migrationBuilder.DropTable(
                name: "organisations");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_clients_uid",
                table: "clients");

            migrationBuilder.DropIndex(
                name: "IX_clients_org_id",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "org_id",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "uid",
                table: "clients");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_forecast,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .Annotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .Annotation("Npgsql:Enum:review_state", "draft,final")
                .Annotation("Npgsql:Enum:user_type", "admin,advisor,client")
                .OldAnnotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_forecast,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .OldAnnotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .OldAnnotation("Npgsql:Enum:review_state", "draft,final")
                .OldAnnotation("Npgsql:Enum:user_type", "superuser,owner,admin,advisor,client");

            migrationBuilder.AddColumn<UserType>(
                name: "type",
                table: "users",
                type: "user_type",
                nullable: false,
                defaultValue: UserType.superuser);
        }
    }
}
