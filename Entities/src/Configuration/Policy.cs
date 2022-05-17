using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class PolicyConfig : IEntityTypeConfiguration<Policy>
{
    public void Configure(EntityTypeBuilder<Policy> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Policies)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.File)
            .WithMany(p => p.Policies)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_file");

        builder.HasOne(d => d.PolicyProvider)
            .WithMany(p => p.Policies)
            .HasForeignKey(d => d.PolicyProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_provider");

        builder.HasOne(d => d.PolicyType)
            .WithMany(p => p.Policies)
            .HasForeignKey(d => d.PolicyTypeId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_type");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => p.ExternalId);
    }
}