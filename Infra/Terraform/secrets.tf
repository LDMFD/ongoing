# This file could be refactored

data "google_secret_manager_secret_version" "gcp_firebase_secret" {
  project = var.gcp_project
  secret  = "firebase-sa-key"
  version = "latest"
}
resource "kubernetes_secret" "gcp_firebase_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "firebase-sa-key"
    namespace = "default"
  }
  data = {
    "config.json" = data.google_secret_manager_secret_version.gcp_firebase_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_storage_secret" {
  project = var.gcp_project
  secret  = "storage-credential"
  version = "latest"
}
resource "kubernetes_secret" "k8s_storage_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "storage-credential"
    namespace = "default"
  }
  data = {
    "Storage.pem" = data.google_secret_manager_secret_version.gcp_storage_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_api_secret" {
  project = var.gcp_project
  secret  = "ongoing-api-key"
  version = "latest"
}
resource "kubernetes_secret" "k8s_api_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "ongoing-api-key"
    namespace = "default"
  }
  data = {
    "ONGOING_API_KEY" = data.google_secret_manager_secret_version.gcp_api_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_sentry_secret" {
  project = var.gcp_project
  secret  = "sentry-dsn"
  version = "latest"
}
resource "kubernetes_secret" "k8s_sentry_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "sentry-dsn"
    namespace = "default"
  }
  data = {
    "ONGOING_SENTRY_DSN" = data.google_secret_manager_secret_version.gcp_sentry_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_spicedb_secret" {
  project = var.gcp_project
  secret  = "spicedb-key"
  version = "latest"
}
resource "kubernetes_secret" "k8s_spicedb_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "spicedb-key"
    namespace = "default"
  }
  data = {
    "ONGOING_SPICEDB_PSK" = data.google_secret_manager_secret_version.gcp_spicedb_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_superusers_secret" {
  project = var.gcp_project
  secret  = "superusers"
  version = "latest"
}
resource "kubernetes_secret" "k8s_superusers_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "superusers"
    namespace = "default"
  }
  data = {
    "ONGOING_SUPERUSERS" = data.google_secret_manager_secret_version.gcp_superusers_secret.secret_data
  }
}

data "google_secret_manager_secret_version" "gcp_database_secret" {
  project = var.gcp_project
  secret  = "database-connection"
  version = "latest"
}
resource "kubernetes_secret" "k8s_database_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]
  metadata {
    name      = "database-connection"
    namespace = "default"
  }
  data = {
    "POSTGRES_DSN" = data.google_secret_manager_secret_version.gcp_database_secret.secret_data
  }
}
