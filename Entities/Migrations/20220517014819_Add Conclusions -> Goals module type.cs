using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Entities.Migrations
{
    public partial class AddConclusionsGoalsmoduletype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .Annotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .Annotation("Npgsql:Enum:review_state", "draft,final")
                .Annotation("Npgsql:Enum:user_type", "admin,advisor,client")
                .OldAnnotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_advice_given,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .OldAnnotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .OldAnnotation("Npgsql:Enum:review_state", "draft,final")
                .OldAnnotation("Npgsql:Enum:user_type", "admin,advisor,client");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_advice_given,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .Annotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .Annotation("Npgsql:Enum:review_state", "draft,final")
                .Annotation("Npgsql:Enum:user_type", "admin,advisor,client")
                .OldAnnotation("Npgsql:Enum:module_type", "introduction,profile,profile_fact_find,profile_risk,profile_objectives,policy_valuations,policy_valuations_valuation,policy_valuations_contributions,fees,fees_advice_fee,fees_policy_fees,fees_fund_level,fees_portfolio_level,fees_dim,conclusions,conclusions_goals,conclusions_advice_given,conclusions_due_diligence,conclusions_ongoing_suitability,conclusions_action_points")
                .OldAnnotation("Npgsql:Enum:operator_type", "dim,firm,individual,none")
                .OldAnnotation("Npgsql:Enum:review_state", "draft,final")
                .OldAnnotation("Npgsql:Enum:user_type", "admin,advisor,client");
        }
    }
}
