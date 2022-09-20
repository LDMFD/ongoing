using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    // This list also found in ReviewModule.go and ModuleTypes.js
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
        ConclusionsGoals,
        ConclusionsAdviceGiven,
        ConclusionsForecast,
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
        public string Intro { get; set; } = null!;
        
        [Column("text")]
        public string Text { get; set; } = null!;

        [ForeignKey("ClientId")]
        [InverseProperty("Modules")]
        public virtual Client Client { get; set; } = null!;
    }
}

class ModuleConfig : IEntityTypeConfiguration<Module>
{
    public void Configure(EntityTypeBuilder<Module> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Modules)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_client");
        
        builder.HasAlternateKey(p => new { p.ClientId, p.Type });
        
        builder.HasAlternateKey(p => new { p.ClientId, p.Type });
    }
}
