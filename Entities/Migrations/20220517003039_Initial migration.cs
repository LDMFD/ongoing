using System;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ongoing.Migrations
{
    public partial class Initialmigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_advice_given,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .Annotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .Annotation("Npgsql:Enum:review_state", "draft,final")
                .Annotation("Npgsql:Enum:user_type", "admin,advisor,client");

            migrationBuilder.CreateTable(
                name: "files",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    filename = table.Column<string>(type: "text", nullable: false),
                    size = table.Column<int>(type: "integer", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_files", x => x.id);
                    table.UniqueConstraint("AK_files_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "module_presets",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    text = table.Column<string>(type: "text", nullable: true),
                    module_type = table.Column<ModuleType>(type: "module_type", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_module_presets", x => x.id);
                    table.UniqueConstraint("AK_module_presets_module_type", x => x.module_type);
                });

            migrationBuilder.CreateTable(
                name: "operators",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    type = table.Column<OperatorType>(type: "operator_type", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_operators", x => x.id);
                    table.UniqueConstraint("AK_operators_name", x => x.name);
                    table.UniqueConstraint("AK_operators_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "policy_providers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    pricing = table.Column<string>(type: "text", nullable: false),
                    custom_pricing = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_providers", x => x.id);
                    table.UniqueConstraint("AK_policy_providers_name", x => x.name);
                    table.UniqueConstraint("AK_policy_providers_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "policy_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_types", x => x.id);
                    table.UniqueConstraint("AK_policy_types_name", x => x.name);
                    table.UniqueConstraint("AK_policy_types_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "risk_providers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_risk_providers", x => x.id);
                    table.UniqueConstraint("AK_risk_providers_name", x => x.name);
                    table.UniqueConstraint("AK_risk_providers_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "riskassessment_templates",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    label = table.Column<string>(type: "text", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_riskassessment_templates", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    verified = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    type = table.Column<UserType>(type: "user_type", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.UniqueConstraint("AK_users_email", x => x.email);
                    table.UniqueConstraint("AK_users_uid", x => x.uid);
                });

            migrationBuilder.CreateTable(
                name: "funds",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    ocf_fee = table.Column<decimal>(type: "numeric", nullable: false),
                    ex_ante_fee = table.Column<decimal>(type: "numeric", nullable: false),
                    sedol_code = table.Column<string>(type: "text", nullable: true),
                    isin_number = table.Column<string>(type: "text", nullable: true),
                    citicode = table.Column<string>(type: "text", nullable: true),
                    file_id = table.Column<int>(type: "integer", nullable: true),
                    modified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_funds", x => x.id);
                    table.UniqueConstraint("AK_funds_name", x => x.name);
                    table.UniqueConstraint("AK_funds_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_file",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "models",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    operator_id = table.Column<int>(type: "integer", nullable: false),
                    weighted_ocf_fee = table.Column<decimal>(type: "numeric", nullable: false),
                    weighted_ex_ante_fee = table.Column<decimal>(type: "numeric", nullable: false),
                    file_id = table.Column<int>(type: "integer", nullable: true),
                    modified = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_models", x => x.id);
                    table.UniqueConstraint("AK_models_name", x => x.name);
                    table.UniqueConstraint("AK_models_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_file",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_operator",
                        column: x => x.operator_id,
                        principalTable: "operators",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_charges",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    policy_provider_id = table.Column<int>(type: "integer", nullable: false),
                    desc = table.Column<string>(type: "text", nullable: false),
                    charge = table.Column<decimal>(type: "numeric", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_charges", x => x.id);
                    table.UniqueConstraint("AK_provider_charges_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_policy_provider",
                        column: x => x.policy_provider_id,
                        principalTable: "policy_providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "risk_levels",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    risk_provider_id = table.Column<int>(type: "integer", nullable: true),
                    level = table.Column<int>(type: "integer", nullable: true),
                    label = table.Column<string>(type: "text", nullable: true),
                    desc = table.Column<string>(type: "text", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_risk_levels", x => x.id);
                    table.UniqueConstraint("AK_risk_levels_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_risk_provider",
                        column: x => x.risk_provider_id,
                        principalTable: "risk_providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    forenames = table.Column<string>(type: "text", nullable: false),
                    surname = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false, defaultValueSql: "0.75"),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.id);
                    table.UniqueConstraint("AK_clients_user_id", x => x.user_id);
                    table.ForeignKey(
                        name: "fk_user",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "fact_finds",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    file_id = table.Column<int>(type: "integer", nullable: false),
                    submitted = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fact_finds", x => x.id);
                    table.UniqueConstraint("AK_fact_finds_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_fact_find",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "fees_reports",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    file_id = table.Column<int>(type: "integer", nullable: false),
                    submitted = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fees_reports", x => x.id);
                    table.UniqueConstraint("AK_fees_reports_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_fees_report",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "modules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<ModuleType>(type: "module_type", nullable: false),
                    intro = table.Column<string>(type: "text", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_modules", x => x.id);
                    table.UniqueConstraint("AK_modules_client_id_type", x => new { x.client_id, x.type });
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "policies",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    external_id = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    policy_type_id = table.Column<int>(type: "integer", nullable: false),
                    policy_provider_id = table.Column<int>(type: "integer", nullable: false),
                    monthly_contributions = table.Column<int>(type: "integer", nullable: true),
                    start_value = table.Column<int>(type: "integer", nullable: true),
                    end_value = table.Column<int>(type: "integer", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: false),
                    file_id = table.Column<int>(type: "integer", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policies", x => x.id);
                    table.UniqueConstraint("AK_policies_external_id", x => x.external_id);
                    table.UniqueConstraint("AK_policies_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_file",
                        column: x => x.file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_policy_provider",
                        column: x => x.policy_provider_id,
                        principalTable: "policy_providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_policy_type",
                        column: x => x.policy_type_id,
                        principalTable: "policy_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "provider_discounts",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    policy_provider_id = table.Column<int>(type: "integer", nullable: false),
                    discount = table.Column<decimal>(type: "numeric", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_provider_discounts", x => x.id);
                    table.UniqueConstraint("AK_provider_discounts_client_id_policy_provider_id", x => new { x.client_id, x.policy_provider_id });
                    table.UniqueConstraint("AK_provider_discounts_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_policy_provider",
                        column: x => x.policy_provider_id,
                        principalTable: "policy_providers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    report = table.Column<string>(type: "json", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    finalized_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    state = table.Column<ReviewState>(type: "review_state", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.UniqueConstraint("AK_reviews_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "risk_assessments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    risk_level_id = table.Column<int>(type: "integer", nullable: false),
                    questionnaire_file_id = table.Column<int>(type: "integer", nullable: false),
                    completed = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_risk_assessments", x => x.id);
                    table.UniqueConstraint("AK_risk_assessments_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_questionnaire",
                        column: x => x.questionnaire_file_id,
                        principalTable: "files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_risk_level",
                        column: x => x.risk_level_id,
                        principalTable: "risk_levels",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "policy_funds",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    policy_id = table.Column<int>(type: "integer", nullable: false),
                    fund_id = table.Column<int>(type: "integer", nullable: false),
                    proportion = table.Column<decimal>(type: "numeric", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_funds", x => x.id);
                    table.UniqueConstraint("AK_policy_funds_client_id_policy_id_fund_id", x => new { x.client_id, x.policy_id, x.fund_id });
                    table.UniqueConstraint("AK_policy_funds_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_fund",
                        column: x => x.fund_id,
                        principalTable: "funds",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_policy",
                        column: x => x.policy_id,
                        principalTable: "policies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "portfolios",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    uid = table.Column<string>(type: "text", nullable: false),
                    client_id = table.Column<int>(type: "integer", nullable: false),
                    policy_id = table.Column<int>(type: "integer", nullable: false),
                    model_id = table.Column<int>(type: "integer", nullable: false),
                    proportion = table.Column<decimal>(type: "numeric", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_portfolios", x => x.id);
                    table.UniqueConstraint("AK_portfolios_client_id_policy_id_model_id", x => new { x.client_id, x.policy_id, x.model_id });
                    table.UniqueConstraint("AK_portfolios_uid", x => x.uid);
                    table.ForeignKey(
                        name: "fk_client",
                        column: x => x.client_id,
                        principalTable: "clients",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_model",
                        column: x => x.model_id,
                        principalTable: "models",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_policy",
                        column: x => x.policy_id,
                        principalTable: "policies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "clients_user_id_key",
                table: "clients",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "fact_finds_uid_key",
                table: "fact_finds",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_fact_finds_client_id",
                table: "fact_finds",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_fact_finds_file_id",
                table: "fact_finds",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "fees_reports_uid_key",
                table: "fees_reports",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_fees_reports_client_id",
                table: "fees_reports",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_fees_reports_file_id",
                table: "fees_reports",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "files_uid_key",
                table: "files",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "funds_name_key",
                table: "funds",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "funds_uid_key",
                table: "funds",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_funds_file_id",
                table: "funds",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "IX_models_file_id",
                table: "models",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "IX_models_operator_id",
                table: "models",
                column: "operator_id");

            migrationBuilder.CreateIndex(
                name: "models_name_key",
                table: "models",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "models_uid_key",
                table: "models",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "operators_name_key",
                table: "operators",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "operators_uid_key",
                table: "operators",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_policies_client_id",
                table: "policies",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_policies_file_id",
                table: "policies",
                column: "file_id");

            migrationBuilder.CreateIndex(
                name: "IX_policies_policy_provider_id",
                table: "policies",
                column: "policy_provider_id");

            migrationBuilder.CreateIndex(
                name: "IX_policies_policy_type_id",
                table: "policies",
                column: "policy_type_id");

            migrationBuilder.CreateIndex(
                name: "policies_external_id_key",
                table: "policies",
                column: "external_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policies_uid_key",
                table: "policies",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_policy_funds_fund_id",
                table: "policy_funds",
                column: "fund_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_funds_policy_id",
                table: "policy_funds",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "policy_funds_client_id_policy_id_fund_id_key",
                table: "policy_funds",
                columns: new[] { "client_id", "policy_id", "fund_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policy_funds_uid_key",
                table: "policy_funds",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policy_providers_name_key",
                table: "policy_providers",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policy_providers_uid_key",
                table: "policy_providers",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policy_types_name_key",
                table: "policy_types",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "policy_types_uid_key",
                table: "policy_types",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_portfolios_model_id",
                table: "portfolios",
                column: "model_id");

            migrationBuilder.CreateIndex(
                name: "IX_portfolios_policy_id",
                table: "portfolios",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "portfolios_client_id_policy_id_model_id_key",
                table: "portfolios",
                columns: new[] { "client_id", "policy_id", "model_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "portfolios_uid_key",
                table: "portfolios",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_charges_policy_provider_id",
                table: "provider_charges",
                column: "policy_provider_id");

            migrationBuilder.CreateIndex(
                name: "provider_charges_uid_key",
                table: "provider_charges",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_provider_discounts_policy_provider_id",
                table: "provider_discounts",
                column: "policy_provider_id");

            migrationBuilder.CreateIndex(
                name: "provider_discounts_client_id_policy_provider_id_key",
                table: "provider_discounts",
                columns: new[] { "client_id", "policy_provider_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "provider_discounts_uid_key",
                table: "provider_discounts",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_client_id",
                table: "reviews",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "reviews_uid_key",
                table: "reviews",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_risk_assessments_client_id",
                table: "risk_assessments",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "IX_risk_assessments_questionnaire_file_id",
                table: "risk_assessments",
                column: "questionnaire_file_id");

            migrationBuilder.CreateIndex(
                name: "IX_risk_assessments_risk_level_id",
                table: "risk_assessments",
                column: "risk_level_id");

            migrationBuilder.CreateIndex(
                name: "risk_assessments_uid_key",
                table: "risk_assessments",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_risk_levels_risk_provider_id",
                table: "risk_levels",
                column: "risk_provider_id");

            migrationBuilder.CreateIndex(
                name: "risk_levels_uid_key",
                table: "risk_levels",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "risk_providers_name_key",
                table: "risk_providers",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "risk_providers_uid_key",
                table: "risk_providers",
                column: "uid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "users_email_key",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "users_uid_key",
                table: "users",
                column: "uid",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fact_finds");

            migrationBuilder.DropTable(
                name: "fees_reports");

            migrationBuilder.DropTable(
                name: "module_presets");

            migrationBuilder.DropTable(
                name: "modules");

            migrationBuilder.DropTable(
                name: "policy_funds");

            migrationBuilder.DropTable(
                name: "portfolios");

            migrationBuilder.DropTable(
                name: "provider_charges");

            migrationBuilder.DropTable(
                name: "provider_discounts");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "risk_assessments");

            migrationBuilder.DropTable(
                name: "riskassessment_templates");

            migrationBuilder.DropTable(
                name: "funds");

            migrationBuilder.DropTable(
                name: "models");

            migrationBuilder.DropTable(
                name: "policies");

            migrationBuilder.DropTable(
                name: "risk_levels");

            migrationBuilder.DropTable(
                name: "operators");

            migrationBuilder.DropTable(
                name: "clients");

            migrationBuilder.DropTable(
                name: "files");

            migrationBuilder.DropTable(
                name: "policy_providers");

            migrationBuilder.DropTable(
                name: "policy_types");

            migrationBuilder.DropTable(
                name: "risk_providers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
