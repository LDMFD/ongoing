resource "digitalocean_database_cluster" "db" {
  region     = var.region
  name       = "db"
  engine     = "pg"
  version    = "14"
  size       = "db-s-1vcpu-1gb"
  node_count = 1

  #lifecycle {
  #  prevent_destroy = true
  #}
}

resource "digitalocean_database_db" "ongoing-staging-db" {
  cluster_id = digitalocean_database_cluster.db.id
  name       = "ongoing-staging"
}

resource "google_secret_manager_secret" "db_dsn_go" {
  secret_id = "do-db-dsn-go"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "db_dsn_spicedb" {
  secret_id = "do-db-dsn-spicedb"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "db_dsn_ef" {
  secret_id = "do-db-dsn-ef"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_dsn_go_version" {
  secret          = google_secret_manager_secret.db_dsn_go.id
  secret_data     = "postgres://${digitalocean_database_cluster.db.user}:${digitalocean_database_cluster.db.password}@${digitalocean_database_cluster.db.host}:${digitalocean_database_cluster.db.port}/ongoing-${terraform.workspace}"
  deletion_policy = "ABANDON"
}

resource "google_secret_manager_secret_version" "db_dsn_spicedb_version" {
  secret          = google_secret_manager_secret.db_dsn_spicedb.id
  secret_data     = "postgres://?user=${digitalocean_database_cluster.db.user}&password=${digitalocean_database_cluster.db.password}&host=${digitalocean_database_cluster.db.host}:${digitalocean_database_cluster.db.port}&sslmode=disable&database=spicedb-${terraform.workspace}"
  deletion_policy = "ABANDON"
}

resource "google_secret_manager_secret_version" "db_dsn_ef_version" {
  secret          = google_secret_manager_secret.db_dsn_ef.id
  secret_data     = "Host=${digitalocean_database_cluster.db.host};Port=${digitalocean_database_cluster.db.port};Database=ongoing-${terraform.workspace};Username=${digitalocean_database_cluster.db.user};Password=${digitalocean_database_cluster.db.password};Include Error Detail=True"
  deletion_policy = "ABANDON"
}
