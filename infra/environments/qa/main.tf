# QA Environment Infrastructure
# Orchestrates database and storage modules for Barsayans Academy

module "database" {
  source = "../../modules/database"

  gcp_project_id = var.gcp_project_id
  region         = var.region
  environment    = var.environment
  project_name   = var.project_name
  suffix         = var.suffix
}

module "storage" {
  source = "../../modules/storage"

  gcp_project_id  = var.gcp_project_id
  project_name    = var.project_name
  environment     = var.environment
  region          = var.region
  suffix          = var.suffix
  allowed_origins = var.allowed_origins
}
