using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("policy_types")]
    [Index("Name", Name = "policy_types_name_key", IsUnique = true)]
    [Index("Uid", Name = "policy_types_uid_key", IsUnique = true)]
    public class PolicyType
    {
        public PolicyType()
        {
            Policies = new HashSet<Policy>();
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
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }


        [ForeignKey("OrgId")]
        public virtual Organisation Org { get; set; } = null!;

        [InverseProperty("PolicyType")]
        public virtual ICollection<Policy> Policies { get; set; }
    }
}

class PolicyTypeConfig : IEntityTypeConfiguration<PolicyType>
{
    public void Configure(EntityTypeBuilder<PolicyType> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
