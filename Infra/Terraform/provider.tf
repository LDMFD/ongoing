terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 3.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_pat
}

// Dynamically create env-specific kubeconfig in ~/.ongoing
locals {
  kubeconfig_path = pathexpand("~/.ongoing/envs/${var.environment}/secrets/digital-ocean/kubeconfig.yaml")
}

provider "helm" {
  kubernetes {
    config_path = local.kubeconfig_path
  }
}

# provider "google" {
#   credentials = file(var.gcp_credentials_file)
#   project     = var.gcp_project
#   region      = var.gcp_region
# }
