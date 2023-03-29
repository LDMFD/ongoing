using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("jobs")]
    [Index("Uid", Name = "job_uid_key", IsUnique = true)]
    public class Job
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;

        [Column("jobspec", TypeName = "json")]
        public string? Jobspec { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
    }
}

class JobConfig : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasAlternateKey(p => p.Uid);
    }
}
