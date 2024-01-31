variable "region" {
  type    = string
  default = "lon1"
}

variable "do_pat" {
  type = string
}

variable "gcp_region" {
  description = "Google Cloud region"
  type        = string
  default     = "europe-west2"
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
}

variable "db_id" {
  description = "Database cluster ID"
  type        = string
}
