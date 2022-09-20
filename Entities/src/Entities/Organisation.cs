using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("organisations")]
    [Index("Uid", Name = "organisations_uid_key", IsUnique = true)]
    [Index("Name", Name = "organisations_name_key", IsUnique = true)]
    public class Organisation
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;

        [Column("name")]
        public string Name { get; set; } = null!;
        
        [Column("owner_id")]
        public int OwnerId { get; set; }

        [Column("creator_id")]
        public int CreatorId { get; set; }

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
        

        [ForeignKey("OwnerId")]
        public virtual User Owner { get; set; } = null!;
        
        [ForeignKey("CreatorId")]
        public virtual User Creator { get; set; } = null!;
    }
}

class OrganisationConfig : IEntityTypeConfiguration<Organisation>
{
    public void Configure(EntityTypeBuilder<Organisation> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Uniqueness constraints
        builder.HasAlternateKey(p => p.Uid);
        builder.HasAlternateKey(p => p.Name);
    }
}
