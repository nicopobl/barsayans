# Google Cloud Storage Module
# Creates a GCS bucket for storing Barsayans Academy videos with CORS configuration

resource "google_storage_bucket" "videos" {
  name          = "${var.project_name}-videos-${var.suffix}"
  location      = var.region
  force_destroy = var.environment == "qa" ? true : false # Allow force destroy in QA for testing

  # Uniform bucket-level access
  uniform_bucket_level_access = true

  # Versioning (optional, can be enabled if needed)
  versioning {
    enabled = false
  }

  # Labels for organization
  labels = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
    purpose     = "video-storage"
  }

  # CORS configuration - Critical for Admin Panel and signed URLs
  # Allows GET, POST, PUT, DELETE from allowed origins
  cors {
    origin          = var.allowed_origins
    method          = ["GET", "POST", "PUT", "DELETE", "HEAD"]
    response_header = ["Content-Type", "Authorization", "Content-Length", "ETag", "x-goog-resumable"]
    max_age_seconds = 3600
  }

  # Lifecycle rules (optional - can be configured if needed)
  lifecycle_rule {
    condition {
      age = 365 # Delete objects older than 1 year (adjust as needed)
    }
    action {
      type = "Delete"
    }
  }
}
