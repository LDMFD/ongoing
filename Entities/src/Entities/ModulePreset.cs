using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Entities.Entities
{
    [Table("module_presets")]
    public class ModulePreset
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("text")]
        public string? Text { get; set; }
        
        [Column("module_type")]
        public ModuleType ModuleType { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
    }
}
