resource "digitalocean_database_cluster" "db" {
  region     = var.region
  name       = "db"
  engine     = "pg"
  version    = "14"
  size       = "db-s-1vcpu-1gb"
  node_count = 1
}

resource "digitalocean_database_db" "ongoing-staging-db" {
  cluster_id = digitalocean_database_cluster.db.id
  name       = "ongoing-staging"
}
