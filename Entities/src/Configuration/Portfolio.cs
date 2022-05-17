using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class PortfolioConfig : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.Model)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.ModelId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_model");

        builder.HasOne(d => d.Policy)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.PolicyId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => new { p.ClientId, p.PolicyId, p.ModelId });
    }
}