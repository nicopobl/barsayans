# Firestore Database Module
# Creates a Firestore database in NATIVE mode for the Barsayans Academy project

resource "google_firestore_database" "main" {
  project     = var.gcp_project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  
  # Note: google_firestore_database resource doesn't support labels
  # Labels can be managed at the project level if needed
}
