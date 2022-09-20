using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("risk_providers")]
    [Index("Name", Name = "risk_providers_name_key", IsUnique = true)]
    [Index("Uid", Name = "risk_providers_uid_key", IsUnique = true)]
    public class RiskProvider
    {
        public RiskProvider()
        {
            RiskLevels = new HashSet<RiskLevel>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("org_id")]
        public int OrgId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;

        [InverseProperty("RiskProvider")]
        public virtual ICollection<RiskLevel> RiskLevels { get; set; }
    }
}

class RiskProviderConfig : IEntityTypeConfiguration<RiskProvider>
{
    public void Configure(EntityTypeBuilder<RiskProvider> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
        
        builder.HasMany(b => b.RiskLevels).WithOne(p => p.RiskProvider)
            .HasForeignKey(p => p.RiskProviderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
