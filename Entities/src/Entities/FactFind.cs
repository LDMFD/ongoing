using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("fact_finds")]
    [Index("Uid", Name = "fact_finds_uid_key", IsUnique = true)]
    public class FactFind
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; }
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("file_id")]
        public int FileId { get; set; }

        [Column("submitted", TypeName = "timestamp without time zone")]
        public DateTime? Submitted { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("ClientId")]
        [InverseProperty("FactFinds")]
        public virtual Client Client { get; set; } = null!;
        
        [ForeignKey("FileId")]
        [InverseProperty("FactFinds")]
        public virtual File File { get; set; } = null!;
    }
}
