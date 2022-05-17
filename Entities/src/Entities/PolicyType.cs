using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
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
        
        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime? Timestamp { get; set; }

        
        [InverseProperty("PolicyType")]
        public virtual ICollection<Policy> Policies { get; set; }
    }
}
