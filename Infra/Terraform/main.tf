resource "digitalocean_project" "ongoing" {
  name        = var.project
  environment = var.environment
}

resource "digitalocean_project_resources" "project_resources" {
  depends_on = [digitalocean_project.ongoing]

  project = digitalocean_project.ongoing.id

  resources = [
    module.database.database_cluster_urn,
    module.kubernetes.kubernetes_cluster_urn,
  ]
}

module "kubernetes" {
  source          = "./modules/kubernetes"
  region          = var.region
  gcp_region      = var.gcp_region
  do_pat          = var.do_pat
  kubeconfig_path = local.kubeconfig_path
}

module "database" {
  source             = "./modules/database"
  region             = var.region
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "secrets" {
  # depends_on         = [module.kubernetes]
  source             = "./modules/secrets"
  do_pat             = var.do_pat
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "dns" {
  source = "./modules/dns"
}

module "cert-manager" {
  source             = "./modules/cert-manager"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "ingress" {
  source             = "./modules/ingress"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "api" {
  source             = "./modules/api"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}
