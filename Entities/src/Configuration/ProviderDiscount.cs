using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ProviderDiscountConfig : IEntityTypeConfiguration<ProviderDiscount>
{
    public void Configure(EntityTypeBuilder<ProviderDiscount> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.ProviderDiscounts)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.PolicyProvider)
            .WithMany(p => p.ProviderDiscounts)
            .HasForeignKey(d => d.PolicyProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_provider");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => new { p.ClientId, p.PolicyProviderId });
    }
}