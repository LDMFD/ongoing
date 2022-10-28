using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("module_presets")]
    [Index("Uid", Name = "module_presets_uid_key", IsUnique = true)]
    public class ModulePreset
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;

        [Column("org_id")]
        public int OrgId { get; set; }

        [Column("text")]
        public string? Text { get; set; }
        
        [Column("module_type")]
        public ModuleType ModuleType { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
        

        [ForeignKey("OrgId")]
        [InverseProperty("ModulePresets")]
        public virtual Organisation Org { get; set; } = null!;
    }
}

class ModulePresetConfig : IEntityTypeConfiguration<ModulePreset>
{
    public void Configure(EntityTypeBuilder<ModulePreset> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasOne(d => d.Org)
            .WithMany(p => p.ModulePresets)
            .HasForeignKey(d => d.OrgId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_modulepreset_org");

        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(p => p.ModuleType);
    }
}
