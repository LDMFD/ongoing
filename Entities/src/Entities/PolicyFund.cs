using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("policy_funds")]
    [Index("ClientId", "PolicyId", "FundId", Name = "policy_funds_client_id_policy_id_fund_id_key", IsUnique = true)]
    [Index("Uid", Name = "policy_funds_uid_key", IsUnique = true)]
    public class PolicyFund
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; }
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("policy_id")]
        public int PolicyId { get; set; }
        
        [Column("fund_id")]
        public int FundId { get; set; }
        
        [Column("proportion")]
        public decimal Proportion { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("PolicyFunds")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FundId")]
        [InverseProperty("PolicyFunds")]
        public virtual Fund Fund { get; set; } = null!;
        
        [ForeignKey("PolicyId")]
        [InverseProperty("PolicyFunds")]
        public virtual Policy Policy { get; set; } = null!;
    }
}
