using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("files")]
    [Index("Uid", Name = "files_uid_key", IsUnique = true)]
    public class File
    {
        public File()
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
        
        [Column("filename")]
        public string Filename { get; set; } = null!;
        
        [Column("size")]
        public int Size { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [InverseProperty("File")]
        public virtual ICollection<FactFind> FactFinds { get; set; }
        
        [InverseProperty("File")]
        public virtual ICollection<Forecast> Forecasts { get; set; }
        
        [InverseProperty("File")]
        public virtual ICollection<FeesReport> FeesReports { get; set; }
        
        [InverseProperty("File")]
        public virtual ICollection<Fund> Funds { get; set; }
        
        [InverseProperty("File")]
        public virtual ICollection<Model> Models { get; set; }
        
        [InverseProperty("File")]
        public virtual ICollection<Policy> Policies { get; set; }
        
        [InverseProperty("QuestionnaireFile")]
        public virtual ICollection<RiskAssessment> RiskAssessments { get; set; }
    }
}

class FileConfig : IEntityTypeConfiguration<Ongoing.Entities.File>
{
    public void Configure(EntityTypeBuilder<Ongoing.Entities.File> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
    }
}
