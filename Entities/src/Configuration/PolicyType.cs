using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class PolicyTypeConfig : IEntityTypeConfiguration<PolicyType>
{
    public void Configure(EntityTypeBuilder<PolicyType> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Name);
    }
}