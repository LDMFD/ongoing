using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using Ongoing;

var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

var configuration = builder.Build();

var connectionString = configuration.GetConnectionString("Default");

Debug.WriteLine(connectionString);

var db = new EfContext(connectionString);
