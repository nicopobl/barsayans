module "database" {
  source       = "../../modules/database"
  environment  = "prod"
  project_name = "barsayans"
}

module "storage" {
  source          = "../../modules/storage"
  environment     = "prod"
  project_name    = "barsayans"
  suffix          = "final"
  allowed_origins = ["https://barsayans.academy"] # Solo producción
}

module "auth" {
  source      = "../../modules/auth"
  environment = "prod"
}