using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class FilereferencecountingFilePtrs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_fact_find",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_fees_report",
                table: "fees_reports");

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
                name: "fk_policy_file",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments");

            migrationBuilder.RenameColumn(
                name: "questionnaire_file_id",
                table: "risk_assessments",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_risk_assessments_questionnaire_file_id",
                table: "risk_assessments",
                newName: "IX_risk_assessments_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "policies",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_policies_file_id",
                table: "policies",
                newName: "IX_policies_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "models",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_models_file_id",
                table: "models",
                newName: "IX_models_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "funds",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_funds_file_id",
                table: "funds",
                newName: "IX_funds_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "forecasts",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_forecasts_file_id",
                table: "forecasts",
                newName: "IX_forecasts_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "fees_reports",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_fees_reports_file_id",
                table: "fees_reports",
                newName: "IX_fees_reports_file_ptr_id");

            migrationBuilder.RenameColumn(
                name: "file_id",
                table: "fact_finds",
                newName: "file_ptr_id");

            migrationBuilder.RenameIndex(
                name: "IX_fact_finds_file_id",
                table: "fact_finds",
                newName: "IX_fact_finds_file_ptr_id");

            migrationBuilder.CreateTable(
                name: "file_ptrs",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    file_id = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    FilePtrId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_file_ptrs", x => x.id);
                    table.UniqueConstraint("AK_file_ptrs_uid", x => x.uid);
                    table.ForeignKey(
                        name: "FK_file_ptrs_files_file_id",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "file_ptrs_uid_key",
                table: "file_ptrs",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_file_ptrs_file_id",
                table: "file_ptrs",
                column: "file_id");

            migrationBuilder.AddForeignKey(
                name: "fk_fact_find",
                table: "fact_finds",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_fees_report",
                table: "fees_reports",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_forecast",
                table: "forecasts",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_fund_file",
                table: "funds",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_model_file",
                table: "models",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_policy_file",
                table: "policies",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_file",
                table: "risk_assessments",
                column: "file_ptr_id",
                principalTable: "file_ptrs",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_fact_find",
                table: "fact_finds");

            migrationBuilder.DropForeignKey(
                name: "fk_fees_report",
                table: "fees_reports");

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
                name: "fk_policy_file",
                table: "policies");

            migrationBuilder.DropForeignKey(
                name: "fk_file",
                table: "risk_assessments");

            migrationBuilder.DropTable(
                name: "file_ptrs");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "risk_assessments",
                newName: "questionnaire_file_id");

            migrationBuilder.RenameIndex(
                name: "IX_risk_assessments_file_ptr_id",
                table: "risk_assessments",
                newName: "IX_risk_assessments_questionnaire_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "policies",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_policies_file_ptr_id",
                table: "policies",
                newName: "IX_policies_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "models",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_models_file_ptr_id",
                table: "models",
                newName: "IX_models_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "funds",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_funds_file_ptr_id",
                table: "funds",
                newName: "IX_funds_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "forecasts",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_forecasts_file_ptr_id",
                table: "forecasts",
                newName: "IX_forecasts_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "fees_reports",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_fees_reports_file_ptr_id",
                table: "fees_reports",
                newName: "IX_fees_reports_file_id");

            migrationBuilder.RenameColumn(
                name: "file_ptr_id",
                table: "fact_finds",
                newName: "file_id");

            migrationBuilder.RenameIndex(
                name: "IX_fact_finds_file_ptr_id",
                table: "fact_finds",
                newName: "IX_fact_finds_file_id");

            migrationBuilder.AddForeignKey(
                name: "fk_fact_find",
                table: "fact_finds",
                column: "file_id",
                principalTable: "files",
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
                name: "fk_policy_file",
                table: "policies",
                column: "file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire",
                table: "risk_assessments",
                column: "questionnaire_file_id",
                principalTable: "files",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
