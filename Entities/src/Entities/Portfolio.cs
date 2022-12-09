using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("portfolios")]
    [Index("ClientId", "PolicyId", "ModelId", Name = "portfolios_client_id_policy_id_model_id_key", IsUnique = true)]
    [Index("Uid", Name = "portfolios_uid_key", IsUnique = true)]
    public class Portfolio
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("policy_id")]
        public int PolicyId { get; set; }
        
        [Column("model_id")]
        public int ModelId { get; set; }
        
        [Column("proportion")]
        public decimal Proportion { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("Portfolios")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("ModelId")]
        [InverseProperty("Portfolios")]
        public virtual Model Model { get; set; } = null!;
        
        [ForeignKey("PolicyId")]
        [InverseProperty("Portfolios")]
        public virtual Policy Policy { get; set; } = null!;
    }
}

class PortfolioConfig : IEntityTypeConfiguration<Portfolio>
{
    public void Configure(EntityTypeBuilder<Portfolio> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.Model)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.ModelId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_model");

        builder.HasOne(d => d.Policy)
            .WithMany(p => p.Portfolios)
            .HasForeignKey(d => d.PolicyId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => new { p.ClientId, p.PolicyId, p.ModelId });
    }
}
