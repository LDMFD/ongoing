using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("risk_assessments")]
    [Index("Uid", Name = "risk_assessments_uid_key", IsUnique = true)]
    public class RiskAssessment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("risk_level_id")]
        public int RiskLevelId { get; set; }
        
        [Column("questionnaire_file_id")]
        public int? QuestionnaireFileId { get; set; }
        
        [Column("completed", TypeName = "timestamp without time zone")]
        public DateTime? Completed { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("RiskAssessments")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("QuestionnaireFileId")]
        [InverseProperty("RiskAssessments")]
        public virtual File? QuestionnaireFile { get; set; } = null!;
        
        [ForeignKey("RiskLevelId")]
        [InverseProperty("RiskAssessments")]
        public virtual RiskLevel RiskLevel { get; set; } = null!;
    }
}
