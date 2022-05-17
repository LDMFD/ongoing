using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

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