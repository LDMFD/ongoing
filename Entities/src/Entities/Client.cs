using Ongoing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ongoing.Entities
{
    [Table("clients")]
    [Index("UserId", Name = "clients_user_id_key", IsUnique = true)]
    public class Client
    {
        public Client()
        {
            FactFinds = new HashSet<FactFind>();
            FeesReports = new HashSet<FeesReport>();
            Forecasts = new HashSet<Forecast>();
            Modules = new HashSet<Module>();
            Policies = new HashSet<Policy>();
            PolicyFunds = new HashSet<PolicyFund>();
            Portfolios = new HashSet<Portfolio>();
            ProviderDiscounts = new HashSet<ProviderDiscount>();
            Reviews = new HashSet<Review>();
            RiskAssessments = new HashSet<RiskAssessment>();
        }

        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("forenames")]
        public string Forenames { get; set; } = null!;
        
        [Column("surname")]
        public string Surname { get; set; } = null!;
        
        [Column("fee")]
        public decimal Fee { get; set; }
        
        [Column("timestamp", TypeName = "timestamp without time zone")]
        public DateTime Timestamp { get; set; }

        
        [ForeignKey("UserId")]
        [InverseProperty("Client")]
        public virtual User User { get; set; } = null!;
        
        [InverseProperty("Client")]
        public virtual ICollection<FactFind> FactFinds { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<FeesReport> FeesReports { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<Forecast> Forecasts { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<Module> Modules { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<Policy> Policies { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<PolicyFund> PolicyFunds { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<Portfolio> Portfolios { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<ProviderDiscount> ProviderDiscounts { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<Review> Reviews { get; set; }
        
        [InverseProperty("Client")]
        public virtual ICollection<RiskAssessment> RiskAssessments { get; set; }
    }
}

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
