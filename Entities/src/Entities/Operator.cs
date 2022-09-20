using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    public enum OperatorType
    {
        Dim,
        Firm,
        Individual,
        None,
    }
    
    [Table("operators")]
    [Index("Name", Name = "operators_name_key", IsUnique = true)]
    [Index("Uid", Name = "operators_uid_key", IsUnique = true)]
    public class Operator
    {
        public Operator()
        {
            Models = new HashSet<Model>();
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
        
        [Column("fee")]
        public decimal Fee { get; set; }
        
        [Column("type")]
        public OperatorType Type { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;

        [InverseProperty("Operator")]
        public virtual ICollection<Model> Models { get; set; }
    }
}

class OperatorConfig : IEntityTypeConfiguration<Operator>
{
    public void Configure(EntityTypeBuilder<Operator> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
