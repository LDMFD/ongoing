resource "helm_release" "ongoing_api" {
  depends_on = [var.kubernetes_cluster]

  name      = "ongoing-api"
  chart     = "../Helm/ongoing-api"
  namespace = "default"

  set {
    name  = "image"
    value = "${var.container_registry}/ongoing-api"
  }

  set {
    name  = "tag"
    value = "6e7dc13606fb4ebbbcee90717e95ae86"
  }

  // Non-secret env-specific env vars (secret ones and non-env specific ones are found in Deployment.yaml):
  set {
    name  = "env.ONGOING_API_HOST"
    value = var.ongoing_api_host[terraform.workspace]
  }

  set {
    name  = "env.ONGOING_ENV"
    value = terraform.workspace
  }

  set {
    name  = "env.ONGOING_SPICEDB_DB"
    value = "spicedb-${terraform.workspace}"
  }

  set {
    name  = "env.ONGOING_STORAGE_BUCKET"
    value = "ongoing-${terraform.workspace}-docs"
  }

  set {
    name  = "env.ONGOING_STORAGE_SA"
    value = "storage@ongoing-${terraform.workspace}.iam.gserviceaccount.com"
  }

  set {
    name  = "env.POSTGRES_DB"
    value = "ongoing-${terraform.workspace}"
  }
}

variable "ongoing_api_host" {
  type = map(string)
  default = {
    "prod"    = "do-api4.amplifa.co.uk"
    "staging" = "do-api4.amplifa.co.uk"
  }
}
