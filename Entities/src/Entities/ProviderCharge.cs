using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("provider_charges")]
    [Index("Uid", Name = "provider_charges_uid_key", IsUnique = true)]
    public class ProviderCharge
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("policy_provider_id")]
        public int PolicyProviderId { get; set; }
        
        [Column("boundary")]
        public decimal Boundary { get; set; }
        
        [Column("charge")]
        public decimal Charge { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("PolicyProviderId")]
        [InverseProperty("ProviderCharges")]
        public virtual PolicyProvider PolicyProvider { get; set; } = null!;
    }
}

class ProviderChargeConfig : IEntityTypeConfiguration<ProviderCharge>
{
    public void Configure(EntityTypeBuilder<ProviderCharge> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.PolicyProvider)
            .WithMany(p => p.ProviderCharges)
            .HasForeignKey(d => d.PolicyProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_provider");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => new { e.PolicyProviderId, e.Boundary, e.Charge });
    }
}
