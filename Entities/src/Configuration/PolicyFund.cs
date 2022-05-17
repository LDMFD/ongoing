using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class PolicyFundConfig : IEntityTypeConfiguration<PolicyFund>
{
    public void Configure(EntityTypeBuilder<PolicyFund> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.PolicyFunds)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.Fund)
            .WithMany(p => p.PolicyFunds)
            .HasForeignKey(d => d.FundId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_fund");

        builder.HasOne(d => d.Policy)
            .WithMany(p => p.PolicyFunds)
            .HasForeignKey(d => d.PolicyId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => new { p.ClientId, p.PolicyId, p.FundId });
    }
}