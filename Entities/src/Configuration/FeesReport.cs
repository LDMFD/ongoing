using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class FeesReportConfig : IEntityTypeConfiguration<FeesReport>
{
    public void Configure(EntityTypeBuilder<FeesReport> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.FeesReports)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.File)
            .WithMany(p => p.FeesReports)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_fees_report");
        
        builder.HasAlternateKey(p => p.Uid);
    }
}