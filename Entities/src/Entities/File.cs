using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ongoing.Entities
{
    [Table("files")]
    [Index("Uid", Name = "files_uid_key", IsUnique = true)]
    public class File
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("uid")]
        public string Uid { get; set; } = null!;
        
        [Column("filename")]
        public string Filename { get; set; } = null!;
        
        [Column("size")]
        public int Size { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [InverseProperty("File")]
        public virtual ICollection<FilePtr> FilePtrs { get; set; } = null!;
    }
}

class FileConfig : IEntityTypeConfiguration<Ongoing.Entities.File>
{
    public void Configure(EntityTypeBuilder<Ongoing.Entities.File> builder)
    {
        builder.Property(e => e.Id).UseIdentityAlwaysColumn();
        
        builder.Property(e => e.Timestamp).HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasAlternateKey(e => e.Uid);

        builder.HasMany(b => b.FilePtrs).WithOne(p => p.File).HasForeignKey(p => p.FileId).OnDelete(DeleteBehavior.Cascade);
    }
}
