using Entities.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration;

class ReviewConfig : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.HasOne(d => d.Client)
            .WithMany(p => p.Reviews)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");
        
        builder.HasAlternateKey(p => p.Uid);
    }
}