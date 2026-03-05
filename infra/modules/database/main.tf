# Firestore Database Module
# Creates a Firestore database in NATIVE mode for the Barsayans Academy project

resource "google_firestore_database" "main" {
  project     = var.gcp_project_id
  name        = "barsayans-database-${var.suffix}"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  # Note: google_firestore_database resource doesn't support labels
  # Labels can be managed at the project level if needed
}

# ── Collections ─────────────────────────────────────────────────────────────
# Firestore only creates a collection when the first document is written.
# These seed documents initialize each required collection so the app never
# encounters a NOT_FOUND (gRPC code 5) error on first access.
# Note: Firestore reserves IDs with double underscores (__). Use single underscore prefix.

resource "google_firestore_document" "subscriptions_seed" {
  project     = var.gcp_project_id
  database    = google_firestore_database.main.name
  collection  = "subscriptions"
  document_id = "_terraform-seed"

  fields = jsonencode({
    _managed_by = { stringValue = "terraform" }
    _type       = { stringValue = "collection_seed" }
    _collection = { stringValue = "subscriptions" }
  })

  depends_on = [google_firestore_database.main]
}

resource "google_firestore_document" "courses_seed" {
  project     = var.gcp_project_id
  database    = google_firestore_database.main.name
  collection  = "courses"
  document_id = "_terraform-seed"

  fields = jsonencode({
    _managed_by = { stringValue = "terraform" }
    _type       = { stringValue = "collection_seed" }
    _collection = { stringValue = "courses" }
  })

  depends_on = [google_firestore_database.main]
}
