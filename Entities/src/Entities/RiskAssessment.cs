using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
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

class RiskAssessmentConfig : IEntityTypeConfiguration<RiskAssessment>
{
    public void Configure(EntityTypeBuilder<RiskAssessment> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.RiskAssessments)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.QuestionnaireFile)
            .WithMany(p => p.RiskAssessments)
            .HasForeignKey(d => d.QuestionnaireFileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_questionnaire");

        builder.HasOne(d => d.RiskLevel)
            .WithMany(p => p.RiskAssessments)
            .HasForeignKey(d => d.RiskLevelId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_risk_level");
        
        // Uniqueness constraint
        builder.HasAlternateKey(p => p.Uid);
    }
}
