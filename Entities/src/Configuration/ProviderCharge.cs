using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ProviderChargeConfig : IEntityTypeConfiguration<ProviderCharge>
{
    public void Configure(EntityTypeBuilder<ProviderCharge> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.PolicyProvider)
            .WithMany(p => p.ProviderCharges)
            .HasForeignKey(d => d.PolicyProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_provider");
        
        builder.HasAlternateKey(e => e.Uid);
    }
}