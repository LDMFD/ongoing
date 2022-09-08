using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("policy_providers")]
    [Index("Name", Name = "policy_providers_name_key", IsUnique = true)]
    [Index("Uid", Name = "policy_providers_uid_key", IsUnique = true)]
    public class PolicyProvider
    {
        public PolicyProvider()
        {
            Policies = new HashSet<Policy>();
            ProviderCharges = new HashSet<ProviderCharge>();
            ProviderDiscounts = new HashSet<ProviderDiscount>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("pricing")]
        public string Pricing { get; set; } = null!;
        
        [Column("custom_pricing")]
        public string CustomPricing { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [InverseProperty("PolicyProvider")]
        public virtual ICollection<Policy> Policies { get; set; }
        
        [InverseProperty("PolicyProvider")]
        public virtual ICollection<ProviderCharge> ProviderCharges { get; set; }
        
        [InverseProperty("PolicyProvider")]
        public virtual ICollection<ProviderDiscount> ProviderDiscounts { get; set; }
    }
}

class PolicyProviderConfig : IEntityTypeConfiguration<PolicyProvider>
{
    public void Configure(EntityTypeBuilder<PolicyProvider> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}
