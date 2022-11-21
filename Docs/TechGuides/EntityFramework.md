## A guide to Entity Framework

To make a foreign key nullable, add a ? after the type:

    [Column("file_ptr_id")]
    public int? FilePtrId { get; set; }

    public virtual FilePtr? FilePtr { get; set; }

## Uniqueness constraints

Single:

    builder.HasAlternateKey(p => p.Uid);

Composite:

    builder.HasAlternateKey(p => new { p.Field1, p.Field2 });

## Initial scaffold

dotnet ef dbcontext scaffold \
    --data-annotations \
    --output-dir src/Entities \
    --context-dir src \
    --context EfContext \
    "Host=ongoing-db;Database=postgres;Username=postgres;Password=p" \
    Npgsql.EntityFrameworkCore.PostgreSQL
