resource "helm_release" "ongoing_api" {
  depends_on = [var.kubernetes_cluster]

  name      = "ongoing-api"
  chart     = "../Helm/api"
  namespace = "default"

  set {
    name  = "image"
    value = "${var.container_registry}/ongoing-api"
  }

  set {
    name  = "tag"
    value = "6e7dc13606fb4ebbbcee90717e95ae86"
  }

  // Non-secret env-specific env vars (secret ones and non-env specific ones are found in Deployment.yaml)
  // These could be replaced by a single variable `env` passed to Helm

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
    "prod"    = "do-api5.amplifa.co.uk"
    "staging" = "do-api5.amplifa.co.uk"
  }
}
