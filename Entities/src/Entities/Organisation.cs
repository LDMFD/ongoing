using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("organisations")]
    [Index("Uid", Name = "organisations_uid_key", IsUnique = true)]
    [Index("Name", Name = "organisations_name_key", IsUnique = true)]
    public class Organisation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;

        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("owner_id")]
        public int? OwnerId { get; set; }

        [Column("creator_id")]
        public int? CreatorId { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
        

        [ForeignKey("OwnerId")]
        [InverseProperty("OwnedOrgs")]
        public virtual User? Owner { get; set; } = null!;
        
        [ForeignKey("CreatorId")]
        [InverseProperty("CreatedOrgs")]
        public virtual User? Creator { get; set; } = null!;
        
        
        [InverseProperty("Org")]
        public virtual ICollection<Client> Clients { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<Advisor> Advisors { get; set; } = null!;
        
        [InverseProperty("Org")]
        public virtual ICollection<Fund> Funds { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<Model> Models { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<ModulePreset> ModulePresets { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<Operator> Operators { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<RiskProvider> RiskProviders { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<PolicyType> PolicyTypes { get; set; } = null!;

        [InverseProperty("Org")]
        public virtual ICollection<PolicyProvider> PolicyProviders { get; set; } = null!;
    }
}

class OrganisationConfig : IEntityTypeConfiguration<Organisation>
{
    public void Configure(EntityTypeBuilder<Organisation> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Creator).WithMany(p => p.CreatedOrgs).OnDelete(DeleteBehavior.SetNull).HasConstraintName("fk_org_creator");
        builder.HasOne(d => d.Owner).WithMany(p => p.OwnedOrgs).OnDelete(DeleteBehavior.SetNull).HasConstraintName("fk_org_owner");

        builder.HasMany(b => b.Advisors).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.Clients).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.Funds).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.Models).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.ModulePresets).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.Operators).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.RiskProviders).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.PolicyTypes).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(b => b.PolicyProviders).WithOne(p => p.Org).HasForeignKey(p => p.OrgId).OnDelete(DeleteBehavior.Restrict);
        
        // Uniqueness constraints
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => p.Name);
    }
}
