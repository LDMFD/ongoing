variable "project" {
  type        = string
  default     = "staging"
  description = "Digital Ocean project"
}

variable "region" {
  type    = string
  default = "lon1"
}

variable "do_pat" {
  type = string
}

variable "gcp_region" {
  type    = string
  default = "europe-west2"
}

variable "gcp_project" {
  description = "Google Cloud project ID"
  type        = string
  default     = "ongoing-staging"
}
