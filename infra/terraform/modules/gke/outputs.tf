/**
 * GKE Cluster Module Outputs
 */

output "cluster_name" {
  description = "The name of the GKE cluster"
  value       = google_container_cluster.primary.name
}

output "endpoint" {
  description = "The endpoint for the GKE cluster"
  value       = google_container_cluster.primary.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "The CA certificate for the GKE cluster"
  value       = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
  sensitive   = true
}

output "client_certificate" {
  description = "The client certificate for the GKE cluster"
  value       = google_container_cluster.primary.master_auth[0].client_certificate
  sensitive   = true
}

output "client_key" {
  description = "The client key for the GKE cluster"
  value       = google_container_cluster.primary.master_auth[0].client_key
  sensitive   = true
}

output "master_version" {
  description = "The Kubernetes master version"
  value       = google_container_cluster.primary.master_version
}

output "location" {
  description = "The location of the GKE cluster"
  value       = google_container_cluster.primary.location
}
