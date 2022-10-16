using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    public enum ReviewState
    {
        draft,
        final,
    }

    [Table("reviews")]
    [Index("Uid", Name = "reviews_uid_key", IsUnique = true)]
    public class Review
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("report", TypeName = "json")]
        public string? Report { get; set; }
        
        [Column("start_date", TypeName = "timestamp without time zone")]
        public DateTime? StartDate { get; set; }
        
        [Column("end_date", TypeName = "timestamp without time zone")]
        public DateTime? EndDate { get; set; }
        
        [Column("finalized_date", TypeName = "timestamp without time zone")]
        public DateTime? FinalizedDate { get; set; }

        [Column("state")]
        public ReviewState State { get; set; }

        [ForeignKey("ClientId")]
        [InverseProperty("Reviews")]
        public virtual Client Client { get; set; } = null!;
    }
}

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
