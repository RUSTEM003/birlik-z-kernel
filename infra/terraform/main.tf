/**
 * Birlik Z-Kernel Infrastructure
 * 
 * Main Terraform configuration for deploying the Birlik Platform
 * to Google Cloud Platform in the us-central1 region.
 */

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
  
  backend "gcs" {
    bucket = "birlik-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

module "gke_cluster" {
  source     = "./modules/gke"
  project_id = var.project_id
  region     = var.region
  zone       = var.zone
  
  cluster_name        = var.cluster_name
  node_count          = var.node_count
  machine_type        = var.machine_type
  min_node_count      = var.min_node_count
  max_node_count      = var.max_node_count
  network             = var.network
  subnetwork          = var.subnetwork
  enable_autopilot    = var.enable_autopilot
}

module "cloud_sql" {
  source     = "./modules/cloud_sql"
  project_id = var.project_id
  region     = var.region
  
  db_name           = var.db_name
  db_version        = var.db_version
  db_tier           = var.db_tier
  db_user           = var.db_user
  db_password       = var.db_password
  db_availability_type = var.db_availability_type
  db_backup_enabled = var.db_backup_enabled
}

module "cloud_storage" {
  source     = "./modules/cloud_storage"
  project_id = var.project_id
  region     = var.region
  
  storage_class      = var.storage_class
  bucket_names       = var.bucket_names
  versioning_enabled = var.versioning_enabled
}

module "redis" {
  source     = "./modules/redis"
  project_id = var.project_id
  region     = var.region
  
  redis_name         = var.redis_name
  redis_tier         = var.redis_tier
  redis_memory_size  = var.redis_memory_size
  redis_version      = var.redis_version
}

module "vpc" {
  source     = "./modules/vpc"
  project_id = var.project_id
  region     = var.region
  
  network_name       = var.network
  subnetwork_name    = var.subnetwork
  ip_cidr_range      = var.ip_cidr_range
  secondary_ip_range = var.secondary_ip_range
}

module "cloud_armor" {
  source     = "./modules/cloud_armor"
  project_id = var.project_id
  
  policy_name        = var.security_policy_name
  rules              = var.security_rules
}

module "cdn" {
  source     = "./modules/cdn"
  project_id = var.project_id
  
  cdn_name           = var.cdn_name
  backend_bucket     = var.cdn_backend_bucket
  enable_cdn         = var.enable_cdn
}

module "monitoring" {
  source     = "./modules/monitoring"
  project_id = var.project_id
  
  dashboard_name     = var.dashboard_name
  alert_policies     = var.alert_policies
  notification_channels = var.notification_channels
}
