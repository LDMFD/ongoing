using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("fees_reports")]
    [Index("Uid", Name = "fees_reports_uid_key", IsUnique = true)]
    public class FeesReport
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
       
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("file_id")]
        public int FileId { get; set; }
        
        [Column("submitted", TypeName = "timestamp without time zone")]
        public DateTime Submitted { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("FeesReports")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FileId")]
        [InverseProperty("FeesReports")]
        public virtual File File { get; set; } = null!;
    }
}

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

