using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
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
        public string Uid { get; set; }
        
        [Column("filename")]
        public string Filename { get; set; }
        
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
