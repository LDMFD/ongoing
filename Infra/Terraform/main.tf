// Digital Ocean project

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

// Modules

module "database" {
  environment = var.environment
  source      = "./modules/database"
  region      = var.region
}

module "kubernetes" {
  db_id           = module.database.database_id
  do_pat          = var.do_pat
  environment     = var.environment
  gcp_region      = var.gcp_region
  kubeconfig_path = local.kubeconfig_path
  region          = var.region
  source          = "./modules/kubernetes"
}

module "secrets" {
  depends_on = [
    module.kubernetes,
  ]
  source             = "./modules/secrets"
  do_pat             = var.do_pat
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
  gcp_project        = var.gcp_project
}

module "cert-manager" {
  depends_on = [
    module.kubernetes,
  ]
  source             = "./modules/cert-manager"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "ingress" {
  depends_on = [
    module.cert-manager
  ]
  source             = "./modules/ingress"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "dns" {
  depends_on = [
    module.ingress // for load balancer ip
  ]
  source = "./modules/dns"
}

module "spicedb" {
  depends_on = [
    module.database,
    module.secrets,
  ]
  source             = "./modules/services/spicedb"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}

module "api" {
  depends_on = [
    module.database,
    module.dns,
    module.ingress,
    module.secrets,
    module.spicedb,
  ]
  environment        = var.environment
  source             = "./modules/services/api"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster
}
