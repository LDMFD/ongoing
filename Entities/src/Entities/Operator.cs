using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    public enum OperatorType
    {
        Dim,
        Firm,
        Individual,
        None,
    }
    
    [Table("operators")]
    [Index("Name", Name = "operators_name_key", IsUnique = true)]
    [Index("Uid", Name = "operators_uid_key", IsUnique = true)]
    public class Operator
    {
        public Operator()
        {
            Models = new HashSet<Model>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("uid")]
        public string Uid { get; set; }
        
        [Column("name")]
        public string Name { get; set; }
        
        [Column("fee")]
        public decimal Fee { get; set; }
        
        [Column("type")]
        public OperatorType Type { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        [InverseProperty("Operator")]
        public virtual ICollection<Model> Models { get; set; }
    }
}
