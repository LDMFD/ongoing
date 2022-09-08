using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("funds")]
    [Index("Name", Name = "funds_name_key", IsUnique = true)]
    [Index("Uid", Name = "funds_uid_key", IsUnique = true)]
    public class Fund
    {
        public Fund()
        {
            PolicyFunds = new HashSet<PolicyFund>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("ocf_fee")]
        public decimal OcfFee { get; set; }
        
        [Column("ex_ante_fee")]
        public decimal ExAnteFee { get; set; }
        
        [Column("sedol_code")]
        public string? SedolCode { get; set; }
        
        [Column("isin_number")]
        public string? IsinNumber { get; set; }
        
        [Column("citicode")]
        public string? Citicode { get; set; }
        
        [Column("file_id")]
        public int? FileId { get; set; }
        
        [Column("modified", TypeName = "timestamp without time zone")]
        public DateTime? Modified { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        [ForeignKey("FileId")]
        [InverseProperty("Funds")]
        public virtual File? File { get; set; }
        
        [InverseProperty("Fund")]
        public virtual ICollection<PolicyFund> PolicyFunds { get; set; }
    }
}

class FundConfig : IEntityTypeConfiguration<Fund>
{
    public void Configure(EntityTypeBuilder<Fund> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.File)
            .WithMany(p => p.Funds)
            .HasForeignKey(d => d.FileId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_file");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
