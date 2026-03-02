variable "gcp_project_id" {
  description = "GCP Project ID where Firestore will be created"
  type        = string
}

variable "region" {
  description = "GCP Region for Firestore database. Must be a valid Firestore region (e.g., us-central, us-east1, europe-west1, asia-northeast1)"
  type        = string
}

variable "environment" {
  description = "Environment name (qa, prod, etc.)"
  type        = string
}

variable "project_name" {
  description = "Project name for labeling"
  type        = string
  default     = "barsayans"
}
