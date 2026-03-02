variable "gcp_project_id" {
  description = "GCP Project ID where the bucket will be created"
  type        = string
}

variable "project_name" {
  description = "Project name for bucket naming"
  type        = string
  default     = "barsayans"
}

variable "environment" {
  description = "Environment name (qa, prod, etc.)"
  type        = string
}

variable "region" {
  description = "GCP Region for the bucket"
  type        = string
}

variable "suffix" {
  description = "Suffix for bucket name uniqueness"
  type        = string
  default     = "final"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS configuration. Critical for Admin Panel and signed URLs."
  type        = list(string)
}
