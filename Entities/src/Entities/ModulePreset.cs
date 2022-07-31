using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Amplifa.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Amplifa.Entities
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

class ModulePresetConfig : IEntityTypeConfiguration<ModulePreset>
{
    public void Configure(EntityTypeBuilder<ModulePreset> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(p => p.ModuleType);
    }
}
