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

resource "google_secret_manager_secret" "db_connection_string" {
  secret_id = "do-db-connection"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "version" {
  secret          = google_secret_manager_secret.db_connection_string.id
  secret_data     = "postgres://${digitalocean_database_cluster.db.user}:${digitalocean_database_cluster.db.password}@${digitalocean_database_cluster.db.host}:${digitalocean_database_cluster.db.port}/ongoing-${terraform.workspace}"
  deletion_policy = "ABANDON"
}
