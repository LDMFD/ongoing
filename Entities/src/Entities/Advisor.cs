using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("advisors")]
    [Index("UserId", Name = "advisors_user_id_key", IsUnique = true)]
    public class Advisor
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;

        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("org_id")]
        public int OrgId { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("UserId")]
        [InverseProperty("Advisor")]
        public virtual User User { get; set; } = null!;
        
        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;
    }
}

class AdvisorConfig : IEntityTypeConfiguration<Advisor>
{
    public void Configure(EntityTypeBuilder<Advisor> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.User)
            .WithOne(p => p.Advisor)
            .HasForeignKey<Advisor>(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_advisor_user");
        
        // Uniqueness constraint
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(p => p.UserId);
    }
}
