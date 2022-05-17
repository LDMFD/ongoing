using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ClientConfig : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Fee).HasDefaultValueSql("0.75");

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.User)
            .WithOne(p => p.Client)
            .HasForeignKey<Client>(d => d.UserId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_user");
        
        // Uniqueness constraint
        builder.HasAlternateKey(p => p.UserId);
    }
}
