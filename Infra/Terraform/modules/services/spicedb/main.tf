// SpiceDB PSK

data "google_secret_manager_secret_version" "gcp_psk" {
  project = var.gcp_project
  secret  = "spicedb-key"
  version = "latest"
}

resource "kubernetes_secret" "k8s_psk" {
  metadata {
    name      = "spicedb-key"
    namespace = "default"
  }
  data = {
    "SPICEDB_GRPC_PRESHARED_KEY" = data.google_secret_manager_secret_version.gcp_psk.secret_data
  }
}

// Postgres DSN

data "google_secret_manager_secret_version" "gcp_dsn" {
  project = var.gcp_project
  secret  = "do-db-dsn-spicedb"
  version = "latest"
}

resource "kubernetes_secret" "k8s_dsn" {
  metadata {
    name      = "spicedb-dsn"
    namespace = "default"
  }
  data = {
    "SPICEDB_DATASTORE_CONN_URI" = data.google_secret_manager_secret_version.gcp_dsn.secret_data
  }
}

// Helm release

resource "helm_release" "spicedb" {
  depends_on = [
    var.kubernetes_cluster,
    kubernetes_secret.k8s_psk,
    kubernetes_secret.k8s_dsn,
  ]

  name      = "spicedb"
  chart     = "../Helm/spicedb"
  namespace = "default"

  set {
    name  = "image"
    value = "${var.container_registry}/spicedb"
  }

  set {
    name  = "tag"
    value = "v1.12.0"
  }
}
