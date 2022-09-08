using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    public enum UserType
    {
        admin,
        advisor,
        client,
    }

    [Table("users")]
    [Index("Email", Name = "users_email_key", IsUnique = true)]
    [Index("Uid", Name = "users_uid_key", IsUnique = true)]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("email")]
        public string Email { get; set; } = null!;
        
        [Column("verified")]
        public bool Verified { get; set; }
        
        [Column("type")]
        public UserType Type { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
        
        [InverseProperty("User")]
        public virtual Client Client { get; set; } = null!;
    }
}

class UserConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Verified).HasDefaultValue(false);
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);
        builder.HasAlternateKey(e => e.Email);
    }
}
