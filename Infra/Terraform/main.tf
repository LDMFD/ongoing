resource "digitalocean_project" "ongoing" {
  name        = var.project
  environment = var.environment
}

resource "digitalocean_project_resources" "project_resources" {
  depends_on = [digitalocean_project.ongoing]

  project = digitalocean_project.ongoing.id

  resources = [
    digitalocean_kubernetes_cluster.cluster.urn,
    digitalocean_database_cluster.db.urn
  ]
}
