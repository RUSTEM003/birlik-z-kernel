/**
 * Birlik Z-Kernel Infrastructure
 * 
 * Variables for Terraform configuration
 */

variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "birlik-platform"
}

variable "region" {
  description = "The GCP region to deploy resources"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone to deploy resources"
  type        = string
  default     = "us-central1-a"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "birlik-cluster"
}

variable "node_count" {
  description = "The number of nodes in the GKE cluster"
  type        = number
  default     = 3
}

variable "machine_type" {
  description = "The machine type for GKE nodes"
  type        = string
  default     = "e2-standard-4"
}

variable "min_node_count" {
  description = "Minimum number of nodes in the GKE cluster"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes in the GKE cluster"
  type        = number
  default     = 5
}

variable "enable_autopilot" {
  description = "Whether to enable GKE Autopilot"
  type        = bool
  default     = true
}

variable "network" {
  description = "The VPC network name"
  type        = string
  default     = "birlik-network"
}

variable "subnetwork" {
  description = "The VPC subnetwork name"
  type        = string
  default     = "birlik-subnetwork"
}

variable "ip_cidr_range" {
  description = "The IP CIDR range for the subnetwork"
  type        = string
  default     = "10.0.0.0/16"
}

variable "secondary_ip_range" {
  description = "The secondary IP ranges for the subnetwork"
  type        = map(string)
  default     = {
    "pods"     = "10.1.0.0/16"
    "services" = "10.2.0.0/16"
  }
}

variable "db_name" {
  description = "The name of the Cloud SQL database"
  type        = string
  default     = "birlik-db"
}

variable "db_version" {
  description = "The version of the Cloud SQL database"
  type        = string
  default     = "POSTGRES_14"
}

variable "db_tier" {
  description = "The tier of the Cloud SQL database"
  type        = string
  default     = "db-custom-4-16384"
}

variable "db_user" {
  description = "The username for the Cloud SQL database"
  type        = string
  default     = "birlik_admin"
}

variable "db_password" {
  description = "The password for the Cloud SQL database"
  type        = string
  default     = "changeme"
  sensitive   = true
}

variable "db_availability_type" {
  description = "The availability type for the Cloud SQL database"
  type        = string
  default     = "REGIONAL"
}

variable "db_backup_enabled" {
  description = "Whether to enable backups for the Cloud SQL database"
  type        = bool
  default     = true
}

variable "storage_class" {
  description = "The storage class for Cloud Storage buckets"
  type        = string
  default     = "STANDARD"
}

variable "bucket_names" {
  description = "The names of the Cloud Storage buckets"
  type        = list(string)
  default     = ["birlik-assets", "birlik-uploads", "birlik-backups"]
}

variable "versioning_enabled" {
  description = "Whether to enable versioning for Cloud Storage buckets"
  type        = bool
  default     = true
}

variable "redis_name" {
  description = "The name of the Redis instance"
  type        = string
  default     = "birlik-redis"
}

variable "redis_tier" {
  description = "The tier of the Redis instance"
  type        = string
  default     = "STANDARD_HA"
}

variable "redis_memory_size" {
  description = "The memory size of the Redis instance in GB"
  type        = number
  default     = 4
}

variable "redis_version" {
  description = "The version of the Redis instance"
  type        = string
  default     = "REDIS_6_X"
}

variable "security_policy_name" {
  description = "The name of the Cloud Armor security policy"
  type        = string
  default     = "birlik-security-policy"
}

variable "security_rules" {
  description = "The rules for the Cloud Armor security policy"
  type        = list(map(string))
  default     = [
    {
      action      = "allow"
      priority    = "1000"
      description = "Allow all traffic"
      match       = "evaluatePreconfiguredExpr('xss-stable')"
    }
  ]
}

variable "cdn_name" {
  description = "The name of the Cloud CDN"
  type        = string
  default     = "birlik-cdn"
}

variable "cdn_backend_bucket" {
  description = "The backend bucket for Cloud CDN"
  type        = string
  default     = "birlik-assets"
}

variable "enable_cdn" {
  description = "Whether to enable Cloud CDN"
  type        = bool
  default     = true
}

variable "dashboard_name" {
  description = "The name of the monitoring dashboard"
  type        = string
  default     = "birlik-dashboard"
}

variable "alert_policies" {
  description = "The alert policies for monitoring"
  type        = list(map(string))
  default     = [
    {
      name        = "high-cpu-usage"
      description = "Alert when CPU usage is high"
      filter      = "metric.type=\"compute.googleapis.com/instance/cpu/utilization\" AND resource.type=\"gce_instance\""
      threshold   = "0.8"
      duration    = "60s"
    }
  ]
}

variable "notification_channels" {
  description = "The notification channels for monitoring alerts"
  type        = list(string)
  default     = []
}
