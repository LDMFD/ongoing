resource "digitalocean_project" "ongoing" {
  name        = var.project
  environment = terraform.workspace
}

resource "digitalocean_project_resources" "project_resources" {
  depends_on = [digitalocean_project.ongoing]

  project = digitalocean_project.ongoing.id

  resources = [
    module.database.database_cluster_urn,
    module.kubernetes.kubernetes_cluster_urn,
  ]
}

module "database" {
  source = "./modules/database"
  region = var.region
}

module "kubernetes" {
  source          = "./modules/kubernetes"
  region          = var.region
  gcp_region      = var.gcp_region
  do_pat          = var.do_pat
  kubeconfig_path = local.kubeconfig_path
  db_id           = module.database.database_id

  depends_on = [module.database]
}

module "secrets" {
  # depends_on         = [module.kubernetes]
  source             = "./modules/secrets"
  do_pat             = var.do_pat
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster

  depends_on = [module.kubernetes]
}

module "cert-manager" {
  source             = "./modules/cert-manager"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster

  depends_on = [module.kubernetes]
}

module "ingress" {
  source             = "./modules/ingress"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster

  depends_on = [module.cert-manager]
}

module "dns" {
  source = "./modules/dns"

  depends_on = [module.ingress] // for load balancer ip
}

module "api" {
  source             = "./modules/api"
  kubeconfig_path    = local.kubeconfig_path
  kubernetes_cluster = module.kubernetes.kubernetes_cluster

  depends_on = [module.ingress, module.secrets, module.database]
}
