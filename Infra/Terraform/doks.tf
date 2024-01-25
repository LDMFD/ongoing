// Digital Ocean k8s (doks)

resource "digitalocean_kubernetes_cluster" "cluster" {
  region = var.region
  name   = "ongoing-cluster"

  // Get the latest with `doctl kubernetes options versions` when you get
  // `Error creating Kubernetes cluster: [...] ]validation error: invalid version slug`
  version = "1.28.5-do.0"

  node_pool {
    name       = "default"
    size       = "s-2vcpu-2gb"
    node_count = 1
  }
}

// Dynamically create env-specific kubeconfig in ~/.ongoing
locals {
  kubeconfig_path = pathexpand("~/.ongoing/envs/${var.environment}/secrets/digital-ocean/kubeconfig.yaml")
}
resource "local_file" "kubeconfig" {
  content  = digitalocean_kubernetes_cluster.cluster.kube_config[0].raw_config
  filename = local.kubeconfig_path
}
output "kubeconfig_path" {
  value = local.kubeconfig_path
}

// Doks can pull images from GCP Artifact Registry
locals {
  artifacts_key_path = pathexpand("~/.ongoing/envs/${var.environment}/secrets/image-registry/artifacts-key.json")
}

// Container registry
resource "kubernetes_secret" "artifacts_secret" {
  depends_on = [digitalocean_kubernetes_cluster.cluster]

  metadata {
    name = "artifacts-secret"
  }

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "${var.gcp_region}-docker.pkg.dev" = {
          username = "_json_key"
          password = file(local.artifacts_key_path)
          email    = "null@example.com"
        }
      }
    })
  }

  type = "kubernetes.io/dockerconfigjson"
}
