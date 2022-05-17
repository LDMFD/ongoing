using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("policies")]
    [Index("ExternalId", Name = "policies_external_id_key", IsUnique = true)]
    [Index("Uid", Name = "policies_uid_key", IsUnique = true)]
    public class Policy
    {
        public Policy()
        {
            PolicyFunds = new HashSet<PolicyFund>();
            Portfolios = new HashSet<Portfolio>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; }
        
        [Column("external_id")]
        public string ExternalId { get; set; }
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("policy_type_id")]
        public int PolicyTypeId { get; set; }
        
        [Column("policy_provider_id")]
        public int PolicyProviderId { get; set; }
        
        [Column("monthly_contributions")]
        public int? MonthlyContributions { get; set; }
        
        [Column("start_value")]
        public int? StartValue { get; set; }
        
        [Column("end_value")]
        public int? EndValue { get; set; }
        
        [Column("start_date", TypeName = "timestamp without time zone")]
        public DateTime? StartDate { get; set; }
        
        [Column("end_date", TypeName = "timestamp without time zone")]
        public DateTime? EndDate { get; set; }
        
        [Column("notes")]
        public string Notes { get; set; }
        
        [Column("file_id")]
        public int? FileId { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("Policies")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FileId")]
        [InverseProperty("Policies")]
        public virtual File? File { get; set; }
        
        [ForeignKey("PolicyProviderId")]
        [InverseProperty("Policies")]
        public virtual PolicyProvider PolicyProvider { get; set; } = null!;
        
        [ForeignKey("PolicyTypeId")]
        [InverseProperty("Policies")]
        public virtual PolicyType PolicyType { get; set; } = null!;
        
        [InverseProperty("Policy")]
        public virtual ICollection<PolicyFund> PolicyFunds { get; set; }
        
        [InverseProperty("Policy")]
        public virtual ICollection<Portfolio> Portfolios { get; set; }
    }
}
