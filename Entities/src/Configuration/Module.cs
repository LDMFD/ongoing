using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ModuleConfig : IEntityTypeConfiguration<Module>
{
    public void Configure(EntityTypeBuilder<Module> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Modules)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");
        
        builder.HasAlternateKey(p => new { p.ClientId, p.Type });
        
        builder.HasAlternateKey(p => new { p.ClientId, p.Type });
    }
}