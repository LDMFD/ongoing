using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using File = Entities.Entities.File;

namespace Entities.Configuration;

class FileConfig : IEntityTypeConfiguration<File>
{
    public void Configure(EntityTypeBuilder<File> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
    }
}