terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 3.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

# provider "google" {
#   credentials = file(var.gcp_credentials_file)
#   project     = var.gcp_project
#   region      = var.gcp_region
# }

provider "digitalocean" {
  token = var.do_pat
}

provider "kubernetes" {
  config_path = local.kubeconfig_path
  host        = digitalocean_kubernetes_cluster.cluster.endpoint
  token       = digitalocean_kubernetes_cluster.cluster.kube_config[0].token
}

provider "helm" {
  kubernetes {
    config_path = local.kubeconfig_path
  }
}
