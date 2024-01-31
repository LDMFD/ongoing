variable "container_registry" {
  description = "URL of container registry"
  default     = "europe-west2-docker.pkg.dev/ongoing-staging/ongoing"
}

variable "kubernetes_cluster" {
  description = "The Kubernetes cluster resource"
  type        = any
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
}
