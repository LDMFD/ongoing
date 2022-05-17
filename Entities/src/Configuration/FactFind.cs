using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class FactFindConfig : IEntityTypeConfiguration<FactFind>
{
    public void Configure(EntityTypeBuilder<FactFind> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.FactFinds)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.File)
            .WithMany(p => p.FactFinds)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_fact_find");

        builder.HasAlternateKey(p => p.Uid);
    }
}