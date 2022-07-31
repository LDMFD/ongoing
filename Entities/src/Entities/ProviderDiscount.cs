using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Amplifa.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Amplifa.Entities
{
    [Table("provider_discounts")]
    [Index("ClientId", "PolicyProviderId", Name = "provider_discounts_client_id_policy_provider_id_key", IsUnique = true)]
    [Index("Uid", Name = "provider_discounts_uid_key", IsUnique = true)]
    public class ProviderDiscount
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("policy_provider_id")]
        public int PolicyProviderId { get; set; }
        
        [Column("discount")]
        public decimal? Discount { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("ProviderDiscounts")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("PolicyProviderId")]
        [InverseProperty("ProviderDiscounts")]
        public virtual PolicyProvider PolicyProvider { get; set; } = null!;
    }
}

class ProviderDiscountConfig : IEntityTypeConfiguration<ProviderDiscount>
{
    public void Configure(EntityTypeBuilder<ProviderDiscount> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithMany(p => p.ProviderDiscounts)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");

        builder.HasOne(d => d.PolicyProvider)
            .WithMany(p => p.ProviderDiscounts)
            .HasForeignKey(d => d.PolicyProviderId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_policy_provider");
        
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => new { p.ClientId, p.PolicyProviderId });
    }
}
