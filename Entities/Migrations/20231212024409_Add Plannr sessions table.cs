using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class AddPlannrsessionstable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "oauth_sessions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    org_id = table.Column<int>(type: "integer", nullable: false),
                    creator_user_id = table.Column<int>(type: "integer", nullable: false),
                    state = table.Column<string>(type: "text", nullable: false),
                    access_token = table.Column<string>(type: "text", nullable: false),
                    refresh_token = table.Column<string>(type: "text", nullable: false),
                    expiry = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    context = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_oauth_sessions", x => x.id);
                    table.UniqueConstraint("AK_oauth_sessions_org_id", x => x.org_id);
                    table.UniqueConstraint("AK_oauth_sessions_state", x => x.state);
                    table.ForeignKey(
                        name: "FK_oauth_sessions_users_creator_user_id",
                        column: x => x.creator_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_operator_org",
                        column: x => x.org_id,
                        principalTable: "organisations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_oauth_sessions_creator_user_id",
                table: "oauth_sessions",
                column: "creator_user_id");

            migrationBuilder.CreateIndex(
                name: "models_org_key",
                table: "oauth_sessions",
                column: "org_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "state",
                table: "oauth_sessions",
                column: "state",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "oauth_sessions");
        }
    }
}
