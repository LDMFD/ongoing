using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Amplifa.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Amplifa.Entities
{
    [Table("risk_levels")]
    [Index("Uid", Name = "risk_levels_uid_key", IsUnique = true)]
    public class RiskLevel
    {
        public RiskLevel()
        {
            RiskAssessments = new HashSet<RiskAssessment>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("risk_provider_id")]
        public int? RiskProviderId { get; set; }
        
        [Column("level")]
        public int? Level { get; set; }
        
        [Column("label")]
        public string? Label { get; set; }
        
        [Column("desc")]
        public string? Desc { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("RiskProviderId")]
        [InverseProperty("RiskLevels")]
        public virtual RiskProvider? RiskProvider { get; set; }
        
        [InverseProperty("RiskLevel")]
        public virtual ICollection<RiskAssessment> RiskAssessments { get; set; }
    }
}

class RiskLevelConfig : IEntityTypeConfiguration<RiskLevel>
{
    public void Configure(EntityTypeBuilder<RiskLevel> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.RiskProvider)
            .WithMany(p => p.RiskLevels)
            .HasForeignKey(d => d.RiskProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_risk_provider");
        
        builder.HasAlternateKey(e => e.Uid);
    }
}
