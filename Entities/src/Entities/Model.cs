using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("models")]
    [Index("Name", Name = "models_name_key", IsUnique = true)]
    [Index("Uid", Name = "models_uid_key", IsUnique = true)]
    public class Model
    {
        public Model()
        {
            Portfolios = new HashSet<Portfolio>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("uid")]
        public string Uid { get; set; }
        
        [Column("name")]
        public string Name { get; set; }
        
        [Column("operator_id")]
        public int OperatorId { get; set; }
        
        [Column("weighted_ocf_fee")]
        public decimal WeightedOcfFee { get; set; }
        
        [Column("weighted_ex_ante_fee")]
        public decimal WeightedExAnteFee { get; set; }
        
        [Column("file_id")]
        public int? FileId { get; set; }
        
        [Column("modified", TypeName = "timestamp without time zone")]
        public DateTime? Modified { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        [ForeignKey("FileId")]
        [InverseProperty("Models")]
        public virtual File? File { get; set; }
        
        [ForeignKey("OperatorId")]
        [InverseProperty("Models")]
        public virtual Operator Operator { get; set; }
        
        [InverseProperty("Model")]
        public virtual ICollection<Portfolio> Portfolios { get; set; }
    }
}
