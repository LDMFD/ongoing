using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
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
        
        [Column("desc")]
        public string Desc { get; set; } = null!;
        
        [Column("charge")]
        public decimal Charge { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("PolicyProviderId")]
        [InverseProperty("ProviderCharges")]
        public virtual PolicyProvider PolicyProvider { get; set; } = null!;
    }
}
