using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("riskassessment_templates")]
    public class RiskAssessmentTemplate
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("label")]
        public string Label { get; set; } = null!;
        
        [Column("text")]
        public string Text { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }
    }
}
