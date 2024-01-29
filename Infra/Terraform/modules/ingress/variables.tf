variable "kubernetes_cluster" {
  description = "The Kubernetes cluster resource"
  type        = any
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
}
