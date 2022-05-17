using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ModelConfig : IEntityTypeConfiguration<Model>
{
    public void Configure(EntityTypeBuilder<Model> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.File)
            .WithMany(p => p.Models)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_file");

        builder.HasOne(d => d.Operator)
            .WithMany(p => p.Models)
            .HasForeignKey(d => d.OperatorId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_operator");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}