output "firestore_database_name" {
  description = "Name of the Firestore database"
  value       = google_firestore_database.main.name
}

output "firestore_database_id" {
  description = "Firestore database ID — use as FIRESTORE_DATABASE_ID in .env.local"
  value       = google_firestore_database.main.name
}

output "firestore_database_location" {
  description = "Location of the Firestore database"
  value       = google_firestore_database.main.location_id
}
