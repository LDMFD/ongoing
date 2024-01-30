locals {
  gcp_to_env_var_map = {
    "firebase-sa-key"    = "config.json"
    "storage-credential" = "Storage.pem"
    "api-key"            = "ONGOING_API_KEY"
    "sentry-dsn"         = "ONGOING_SENTRY_DSN"
    "spicedb-key"        = "ONGOING_SPICEDB_PSK"
    "superusers"         = "ONGOING_SUPERUSERS"
    "do-db-connection"   = "POSTGRES_DSN"
  }

  secret_names = keys(local.gcp_to_env_var_map)
}

data "google_secret_manager_secret_version" "gcp_secret" {
  for_each = toset(local.secret_names)
  secret   = each.key

  project = var.gcp_project
  version = "latest"
}

resource "kubernetes_secret" "k8s_secret" {
  depends_on = [var.kubernetes_cluster]

  for_each = toset(local.secret_names)
  metadata {
    name      = "ongoing-${each.key}"
    namespace = "default"
  }

  data = {
    (local.gcp_to_env_var_map[each.key]) = data.google_secret_manager_secret_version.gcp_secret[each.key].secret_data
  }
}
