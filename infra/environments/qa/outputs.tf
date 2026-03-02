# Outputs for QA Environment
# These values should be used to configure .env.local

output "gcs_bucket_name" {
  description = "GCS Bucket Name - Use this value for GCS_BUCKET_NAME in .env.local"
  value       = module.storage.bucket_name
}

output "gcp_project_id" {
  description = "GCP Project ID - Use this value for GCP_PROJECT_ID in .env.local"
  value       = var.gcp_project_id
}

output "firestore_database_location" {
  description = "Firestore Database Location"
  value       = module.database.firestore_database_location
}

output "firestore_collection_name" {
  description = "Firestore Collection Name for subscriptions - Use this value for FIRESTORE_SUBSCRIPTIONS_COLLECTION in .env.local (default: 'subscriptions')"
  value       = "subscriptions"
}
