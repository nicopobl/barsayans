variable "gcp_project_id" {
  description = "GCP Project ID (must match GCP_PROJECT_ID in ENV_SETUP.md)"
  type        = string
}

variable "region" {
  description = "GCP Region for resources. For Firestore, use regions like us-central, us-east1, europe-west1. For GCS, use multi-region or specific regions."
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "qa"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "barsayans"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS. Critical for Admin Panel and signed URLs. Wildcard for QA to support dynamic origins (ngrok, tunnels, etc.)."
  type        = list(string)
  default     = ["*"]
}

variable "suffix" {
  description = "Suffix for bucket name uniqueness"
  type        = string
  default     = "qa"
}
