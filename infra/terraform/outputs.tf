/**
 * Birlik Z-Kernel Infrastructure
 * 
 * Outputs for Terraform configuration
 */

output "kubernetes_cluster_name" {
  description = "The name of the GKE cluster"
  value       = module.gke_cluster.cluster_name
}

output "kubernetes_cluster_endpoint" {
  description = "The endpoint for the GKE cluster"
  value       = module.gke_cluster.endpoint
  sensitive   = true
}

output "kubernetes_cluster_ca_certificate" {
  description = "The CA certificate for the GKE cluster"
  value       = module.gke_cluster.cluster_ca_certificate
  sensitive   = true
}

output "database_connection_name" {
  description = "The connection name for the Cloud SQL database"
  value       = module.cloud_sql.connection_name
}

output "database_public_ip" {
  description = "The public IP address for the Cloud SQL database"
  value       = module.cloud_sql.public_ip
}

output "storage_bucket_urls" {
  description = "The URLs for the Cloud Storage buckets"
  value       = module.cloud_storage.bucket_urls
}

output "redis_host" {
  description = "The host for the Redis instance"
  value       = module.redis.host
}

output "redis_port" {
  description = "The port for the Redis instance"
  value       = module.redis.port
}

output "vpc_network_name" {
  description = "The name of the VPC network"
  value       = module.vpc.network_name
}

output "vpc_subnetwork_name" {
  description = "The name of the VPC subnetwork"
  value       = module.vpc.subnetwork_name
}

output "cdn_url" {
  description = "The URL for the Cloud CDN"
  value       = module.cdn.cdn_url
}

output "monitoring_dashboard_url" {
  description = "The URL for the monitoring dashboard"
  value       = module.monitoring.dashboard_url
}
