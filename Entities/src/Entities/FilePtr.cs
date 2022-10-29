using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("file_ptrs")]
    [Index("Uid", Name = "file_ptrs_uid_key", IsUnique = true)]
    public class FilePtr
    {
        public FilePtr()
        {
            FactFinds = new HashSet<FactFind>();
            FeesReports = new HashSet<FeesReport>();
            Forecasts = new HashSet<Forecast>();
            Funds = new HashSet<Fund>();
            Models = new HashSet<Model>();
            Policies = new HashSet<Policy>();
            RiskAssessments = new HashSet<RiskAssessment>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("file_id")]
        public int FileId { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("FilePtrId")]
        [InverseProperty("FilePtrs")]
        public virtual File? File { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<FactFind> FactFinds { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<Forecast> Forecasts { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<FeesReport> FeesReports { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<Fund> Funds { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<Model> Models { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<Policy> Policies { get; set; }
        
        [InverseProperty("FilePtr")]
        public virtual ICollection<RiskAssessment> RiskAssessments { get; set; }
    }
}

class FilePtrConfig : IEntityTypeConfiguration<Ongoing.Entities.FilePtr>
{
    public void Configure(EntityTypeBuilder<Ongoing.Entities.FilePtr> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
    }
}
