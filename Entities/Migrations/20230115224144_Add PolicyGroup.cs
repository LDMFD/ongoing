using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class AddPolicyGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "group_id",
                table: "policy_types",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "policy_groups",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    org_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_groups", x => x.id);
                    table.UniqueConstraint("AK_policy_groups_name", x => x.name);
                    table.UniqueConstraint("AK_policy_groups_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_policygroup_org",
                        column: x => x.org_id,
                        principalTable: "organisations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_policy_types_group_id",
                table: "policy_types",
                column: "group_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_groups_org_id",
                table: "policy_groups",
                column: "org_id");

            migrationBuilder.CreateIndex(
                name: "policy_groups_uid_key",
                table: "policy_groups",
                column: "uid",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_policytype_group",
                table: "policy_types",
                column: "group_id",
                principalTable: "policy_groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_policytype_group",
                table: "policy_types");

            migrationBuilder.DropTable(
                name: "policy_groups");

            migrationBuilder.DropIndex(
                name: "IX_policy_types_group_id",
                table: "policy_types");

            migrationBuilder.DropColumn(
                name: "group_id",
                table: "policy_types");
        }
    }
}
