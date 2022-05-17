using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Entities
{
    public enum ModuleType
    {
        Introduction,
        Profile,
        ProfileFactFind,
        ProfileRisk,
        ProfileObjectives,
        PolicyValuations,
        PolicyValuationsValuation,
        PolicyValuationsContributions,
        Fees,
        FeesAdviceFee,
        FeesPolicyFees,
        FeesFundLevel,
        FeesPortfolioLevel,
        FeesDim,
        Conclusions,
        ConclusionsAdviceGiven,
        ConclusionsDueDiligence,
        ConclusionsOngoingSuitability,
        ConclusionsActionPoints,
    }
    
    [Table("modules")]
    public class Module
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("type")]
        public ModuleType Type { get; set; }

        [Column("intro")]
        public string Intro { get; set; }
        
        [Column("text")]
        public string Text { get; set; }

        [ForeignKey("ClientId")]
        [InverseProperty("Modules")]
        public virtual Client Client { get; set; }
    }
}
