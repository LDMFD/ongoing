using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
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
