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
  project = "ongoing-${terraform.workspace}"
  region  = var.gcp_region
}

provider "digitalocean" {
  token = var.do_pat
}

// Dynamically create env-specific kubeconfig in ~/.ongoing
locals {
  kubeconfig_path = pathexpand("~/.ongoing/envs/${terraform.workspace}/secrets/digital-ocean/kubeconfig.yaml")
}

provider "kubernetes" {
  config_path = local.kubeconfig_path
}

provider "helm" {
  kubernetes {
    config_path = local.kubeconfig_path
  }
}
