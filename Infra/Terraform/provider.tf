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
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "ongoing-${var.environment}"
  region  = var.gcp_region
}

provider "digitalocean" {
  token = var.do_pat
}

// Dynamically create env-specific kubeconfig in ~/.ongoing
locals {
  kubeconfig_path = "${path.module}/.kube/config"
}

provider "kubernetes" {
  config_path = local.kubeconfig_path
  host        = module.kubernetes.kubernetes_cluster_endpoint
  token       = module.kubernetes.kubernetes_cluster_token
}

provider "helm" {
  kubernetes {
    config_path = local.kubeconfig_path
  }
}
