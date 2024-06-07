using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("oauth_sessions")]
    [Index("OrgId", Name = "models_org_key", IsUnique = true)]
    [Index("State", Name = "state", IsUnique = true)]
    public class OAuthSession
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("org_id")]
        public int OrgId { get; set; }

        [Column("creator_user_id")]
        public int CreatorUserId { get; set; }

        [Column("state")]
        public string State { get; set; } = null!;
        
        [Column("access_token")]
        public string AccessToken { get; set; } = null!;
        
        [Column("refresh_token")]
        public string RefreshToken { get; set; } = null!;
        
        [Column("expiry", TypeName = "timestamp without time zone")]
        public DateTime Expiry { get; set; }
        
        // For Plannr, it's the account UUID
        [Column("context")]
        public string Context { get; set; } = null!;
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("OrgId")]
        [InverseProperty("OAuthSessions")]
        public virtual Organisation Org { get; set; } = null!;

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; } = null!;
        // [InverseProperty("Client")]
    }
}

class OAuthSessionConfig : IEntityTypeConfiguration<OAuthSession>
{
    public void Configure(EntityTypeBuilder<OAuthSession> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasOne(d => d.Org)
            .WithMany(p => p.OAuthSessions)
            .HasForeignKey(d => d.OrgId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_operator_org");
        
        builder.HasAlternateKey(e => e.OrgId);
        builder.HasAlternateKey(e => e.State);
    }
}
