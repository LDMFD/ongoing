using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities;

[Table("policy_groups")]
[Index("Uid", Name = "policy_groups_uid_key", IsUnique = true)]
public class PolicyGroup
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("uid")]
    public string Uid { get; set; } = null!;

    [Column("org_id")]
    public int OrgId { get; set; }

    [Column("name")]
    public string Name { get; set; } = null!;
    
    [Column("timestamp", TypeName = "timestamp without time zone")]
    public DateTime Timestamp { get; set; }

    [ForeignKey("OrgId")]
    [InverseProperty("PolicyGroups")]
    public virtual Organisation Org { get; set; } = null!;
    
    [InverseProperty("PolicyGroup")]
    public virtual ICollection<PolicyType> PolicyTypes { get; set; }
}

class PolicyGroupConfig : IEntityTypeConfiguration<PolicyGroup>
{
    public void Configure(EntityTypeBuilder<PolicyGroup> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasOne(d => d.Org)
            .WithMany(p => p.PolicyGroups)
            .HasForeignKey(d => d.OrgId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policygroup_org");

        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
