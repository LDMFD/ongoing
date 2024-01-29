variable "gcp_project" {
  description = "Google Cloud project ID"
  type        = string
  default     = "ongoing-staging"
}

variable "gcp_region" {
  description = "Google Cloud region"
  type        = string
  default     = "europe-west2"
}

variable "do_pat" {
  type = string
}

variable "kubernetes_cluster" {
  description = "The Kubernetes cluster resource"
  type        = any
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
}
