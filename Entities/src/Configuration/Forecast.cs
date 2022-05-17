using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ForecastConfig : IEntityTypeConfiguration<Forecast>
{
    public void Configure(EntityTypeBuilder<Forecast> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Forecasts)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.File)
            .WithMany(p => p.Forecasts)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_forecast");

        builder.HasAlternateKey(p => p.Uid);
    }
}