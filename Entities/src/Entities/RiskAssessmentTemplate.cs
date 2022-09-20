using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("riskassessment_templates")]
    public class RiskAssessmentTemplate
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("org_id")]
        public int OrgId { get; set; }

        [Column("label")]
        public string Label { get; set; } = null!;
        
        [Column("text")]
        public string Text { get; set; } = null!;
        
        
        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }
    }
}

class RiskAssessmentTemplateConfig : IEntityTypeConfiguration<RiskAssessment>
{
    public void Configure(EntityTypeBuilder<RiskAssessment> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
