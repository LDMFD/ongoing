using Microsoft.EntityFrameworkCore;
using Npgsql;
using Ongoing.Entities;
using File = System.IO.File;

namespace Ongoing
{
    public partial class EfContext : DbContext
    {
        static EfContext()
        {
            // Enums - keep in sync with list in OnModelCreating
            NpgsqlConnection.GlobalTypeMapper.MapEnum<ModuleType>();
            NpgsqlConnection.GlobalTypeMapper.MapEnum<OperatorType>();
            NpgsqlConnection.GlobalTypeMapper.MapEnum<ReviewState>();
            NpgsqlConnection.GlobalTypeMapper.MapEnum<UserType>();
        }

        public EfContext()
        {
        }

        public EfContext(DbContextOptions<EfContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Advisor> Advisors { get; set; } = null!;
        public virtual DbSet<Client> Clients { get; set; } = null!;
        public virtual DbSet<FactFind> FactFinds { get; set; } = null!;
        public virtual DbSet<FeesReport> FeesReports { get; set; } = null!;
        public virtual DbSet<Forecast> Forecasts { get; set; } = null!;
        public virtual DbSet<Entities.File> Files { get; set; } = null!;
        public virtual DbSet<Fund> Funds { get; set; } = null!;
        public virtual DbSet<Model> Models { get; set; } = null!;
        public virtual DbSet<Module> Modules { get; set; } = null!;
        public virtual DbSet<ModulePreset> ModulePresets { get; set; } = null!;
        public virtual DbSet<Operator> Operators { get; set; } = null!;
        public virtual DbSet<Organisation> Organisation { get; set; } = null!;
        public virtual DbSet<Job> Job { get; set; } = null!;
        public virtual DbSet<Policy> Policies { get; set; } = null!;
        public virtual DbSet<PolicyFund> PolicyFunds { get; set; } = null!;
        public virtual DbSet<PolicyProvider> PolicyProviders { get; set; } = null!;
        public virtual DbSet<PolicyType> PolicyTypes { get; set; } = null!;
        public virtual DbSet<Portfolio> Portfolios { get; set; } = null!;
        public virtual DbSet<ProviderCharge> ProviderCharges { get; set; } = null!;
        public virtual DbSet<ProviderDiscount> ProviderDiscounts { get; set; } = null!;
        public virtual DbSet<Review> Reviews { get; set; } = null!;
        public virtual DbSet<RiskAssessment> RiskAssessments { get; set; } = null!;
        public virtual DbSet<RiskLevel> RiskLevels { get; set; } = null!;
        public virtual DbSet<RiskProvider> RiskProviders { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Not working:
                // string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
                // string connection = File.ReadAllText($"{home}/.homedog/secrets/cloud-sql/db-connection-dotnet");
                // optionsBuilder.UseNpgsql(connection);
            }
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=ongoing-local;Username=postgres;Password=p;Include Error Detail=True");
            //optionsBuilder.UseNpgsql("Host=db-do-user-15300922-0.c.db.ondigitalocean.com;Port=25060;Database=ongoing-staging;Username=doadmin;Password=;Include Error Detail=True");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasPostgresEnum<ModuleType>();
            builder.HasPostgresEnum<OperatorType>();
            builder.HasPostgresEnum<ReviewState>();
            builder.HasPostgresEnum<UserType>();

            builder.ApplyConfiguration(new AdvisorConfig());
            builder.ApplyConfiguration(new ClientConfig());
            builder.ApplyConfiguration(new ClientOptionsConfig());
            builder.ApplyConfiguration(new FactFindConfig());
            builder.ApplyConfiguration(new FeesReportConfig());
            builder.ApplyConfiguration(new FileConfig());
            builder.ApplyConfiguration(new FilePtrConfig());
            builder.ApplyConfiguration(new ForecastConfig());
            builder.ApplyConfiguration(new FundConfig());
            builder.ApplyConfiguration(new ModelConfig());
            builder.ApplyConfiguration(new ModuleConfig());
            builder.ApplyConfiguration(new ModulePresetConfig());
            builder.ApplyConfiguration(new OperatorConfig());
            builder.ApplyConfiguration(new OrganisationConfig());
            builder.ApplyConfiguration(new JobConfig());
            builder.ApplyConfiguration(new OAuthSessionConfig());
            builder.ApplyConfiguration(new PolicyConfig());
            builder.ApplyConfiguration(new PolicyFundConfig());
            builder.ApplyConfiguration(new PolicyProviderConfig());
            builder.ApplyConfiguration(new PolicyTypeConfig());
            builder.ApplyConfiguration(new PortfolioConfig());
            builder.ApplyConfiguration(new PortfolioConfig());
            builder.ApplyConfiguration(new ProviderChargeConfig());
            builder.ApplyConfiguration(new ProviderDiscountConfig());
            builder.ApplyConfiguration(new ReviewConfig());
            builder.ApplyConfiguration(new RiskAssessmentConfig());
            builder.ApplyConfiguration(new RiskLevelConfig());
            builder.ApplyConfiguration(new RiskProviderConfig());
            builder.ApplyConfiguration(new UserConfig());
        }
    }
}
