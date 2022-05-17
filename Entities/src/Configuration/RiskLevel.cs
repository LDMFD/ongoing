using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

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