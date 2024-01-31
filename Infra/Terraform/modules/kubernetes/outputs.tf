output "kubernetes_cluster_urn" {
  value = digitalocean_kubernetes_cluster.cluster.urn
}

output "kubernetes_cluster" {
  value = digitalocean_kubernetes_cluster.cluster
}

output "kubernetes_cluster_endpoint" {
  value = digitalocean_kubernetes_cluster.cluster.endpoint
}

output "kubernetes_cluster_token" {
  value = digitalocean_kubernetes_cluster.cluster.kube_config[0].token
}
