output "kubernetes_cluster_urn" {
  value = digitalocean_kubernetes_cluster.cluster.urn
}

output "kubernetes_cluster" {
  value = digitalocean_kubernetes_cluster.cluster
}
