using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("forecasts")]
    [Index("Uid", Name = "forecasts_uid_key", IsUnique = true)]
    public class Forecast
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("file_ptr_id")]
        public int FilePtrId { get; set; }

        [Column("submitted", TypeName = "timestamp without time zone")]
        public DateTime? Submitted { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("Forecasts")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FilePtrId")]
        [InverseProperty("Forecasts")]
        public virtual FilePtr FilePtr { get; set; } = null!;
    }
}

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

        builder.HasOne(d => d.FilePtr)
            .WithMany(p => p.Forecasts)
            .HasForeignKey(d => d.FilePtrId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("fk_forecast");

        builder.HasAlternateKey(p => p.Uid);
    }
}
