using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ModulePresetConfig : IEntityTypeConfiguration<ModulePreset>
{
    public void Configure(EntityTypeBuilder<ModulePreset> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(p => p.ModuleType);
    }
}