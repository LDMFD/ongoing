resource "helm_release" "ongoing_api" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]

  name      = "ongoing-api"
  chart     = "../Helm/ongoing-api"
  namespace = "default"

  set {
    name  = "image.repository"
    value = "${var.container_registry}/ongoing-api"
  }

  // Non-secret env-specific env vars (secret ones and non-env specific ones are found in Deployment.yaml):
  set {
    name  = "env.ONGOING_API_HOST"
    value = var.ongoing_api_host[var.environment]
  }

  set {
    name  = "env.ONGOING_ENV"
    value = var.environment
  }

  set {
    name  = "env.ONGOING_SPICEDB_DB"
    value = "spicedb-${var.environment}"
  }

  set {
    name  = "env.ONGOING_STORAGE_BUCKET"
    value = "ongoing-${var.environment}-docs"
  }

  set {
    name  = "env.ONGOING_STORAGE_SA"
    value = "storage@ongoing-${var.environment}.iam.gserviceaccount.com"
  }

  set {
    name  = "env.POSTGRES_DB"
    value = "ongoing-${var.environment}"
  }
}

variable "ongoing_api_host" {
  type = map(string)
  default = {
    "prod"    = "api.amplifa.co.uk"
    "staging" = "staging.amplifa.co.uk"
  }
}
