using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("risk_providers")]
    [Index("Name", Name = "risk_providers_name_key", IsUnique = true)]
    [Index("Uid", Name = "risk_providers_uid_key", IsUnique = true)]
    public class RiskProvider
    {
        public RiskProvider()
        {
            RiskLevels = new HashSet<RiskLevel>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [InverseProperty("RiskProvider")]
        public virtual ICollection<RiskLevel> RiskLevels { get; set; }
    }
}
