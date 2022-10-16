using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("models")]
    [Index("Name", Name = "models_name_key", IsUnique = true)]
    [Index("Uid", Name = "models_uid_key", IsUnique = true)]
    public class Model
    {
        public Model()
        {
            Portfolios = new HashSet<Portfolio>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("org_id")]
        public int OrgId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("operator_id")]
        public int OperatorId { get; set; }
        
        [Column("weighted_ocf_fee")]
        public decimal WeightedOcfFee { get; set; }
        
        [Column("weighted_ex_ante_fee")]
        public decimal WeightedExAnteFee { get; set; }
        
        [Column("file_id")]
        public int? FileId { get; set; }
        
        [Column("modified", TypeName = "timestamp without time zone")]
        public DateTime? Modified { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }


        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;
        
        [ForeignKey("FileId")]
        [InverseProperty("Models")]
        public virtual File? File { get; set; }
        
        [ForeignKey("OperatorId")]
        [InverseProperty("Models")]
        public virtual Operator Operator { get; set; } = null!;
        
        [InverseProperty("Model")]
        public virtual ICollection<Portfolio> Portfolios { get; set; }
    }
}

class ModelConfig : IEntityTypeConfiguration<Model>
{
    public void Configure(EntityTypeBuilder<Model> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.File)
            .WithMany(p => p.Models)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_model_file");

        builder.HasOne(d => d.Operator)
            .WithMany(p => p.Models)
            .HasForeignKey(d => d.OperatorId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_operator");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
