using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("fact_finds")]
    [Index("Uid", Name = "fact_finds_uid_key", IsUnique = true)]
    public class FactFind
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("file_id")]
        public int FileId { get; set; }

        [Column("submitted", TypeName = "timestamp without time zone")]
        public DateTime? Submitted { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("FactFinds")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FileId")]
        [InverseProperty("FactFinds")]
        public virtual File File { get; set; } = null!;
    }
}

class FactFindConfig : IEntityTypeConfiguration<FactFind>
{
    public void Configure(EntityTypeBuilder<FactFind> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.FactFinds)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.File)
            .WithMany(p => p.FactFinds)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("fk_fact_find");

        builder.HasAlternateKey(p => p.Uid);
    }
}
