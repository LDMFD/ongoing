variable "environment" {
  description = "Environment for the Ongoing application (e.g., prod, staging)"
  type        = string
}

variable "project" {
  type    = string
  default = "staging"
}

variable "region" {
  type    = string
  default = "lon1"
}

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

variable "container_registry" {
  description = "URL of container registry"
  default     = "europe-west2-docker.pkg.dev/ongoing-staging/ongoing"
}

variable "do_pat" {
  type = string
}
