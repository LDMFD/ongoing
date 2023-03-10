using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Ongoing.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("client_options")]
    public class ClientOptions
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("client_id")]
        public int ClientId { get; set; }
        
        [Column("options", TypeName = "json")]
        public string Options { get; set; } = null!;

        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }
        
        [ForeignKey("ClientId")]
        [InverseProperty("Options")]
        public virtual Client Client { get; set; } = null!;
    }
}

class ClientOptionsConfig : IEntityTypeConfiguration<Ongoing.Entities.ClientOptions>
{
    public void Configure(EntityTypeBuilder<Ongoing.Entities.ClientOptions> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();

        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(d => d.Client)
            .WithOne(p => p.Options)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("fk_client");
    }
}