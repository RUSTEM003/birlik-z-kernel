/**
 * GKE Cluster Module Variables
 */

variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region to deploy resources"
  type        = string
}

variable "zone" {
  description = "The GCP zone to deploy resources"
  type        = string
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
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
  default     = false
}

variable "enable_regional" {
  description = "Whether to create a regional cluster"
  type        = bool
  default     = false
}

variable "network" {
  description = "The VPC network name"
  type        = string
}

variable "subnetwork" {
  description = "The VPC subnetwork name"
  type        = string
}

variable "enable_private_nodes" {
  description = "Whether to enable private nodes"
  type        = bool
  default     = true
}

variable "enable_private_endpoint" {
  description = "Whether to enable private endpoint"
  type        = bool
  default     = false
}

variable "master_ipv4_cidr_block" {
  description = "The IP CIDR block for the master network"
  type        = string
  default     = "172.16.0.0/28"
}

variable "release_channel" {
  description = "The release channel for the GKE cluster"
  type        = string
  default     = "REGULAR"
}

variable "master_authorized_networks" {
  description = "The list of CIDR blocks that are allowed to access the master"
  type        = list(object({
    cidr_block   = string
    display_name = string
  }))
  default     = [
    {
      cidr_block   = "0.0.0.0/0"
      display_name = "All"
    }
  ]
}

variable "preemptible" {
  description = "Whether to use preemptible nodes"
  type        = bool
  default     = false
}

variable "disk_size_gb" {
  description = "The disk size for GKE nodes"
  type        = number
  default     = 100
}

variable "disk_type" {
  description = "The disk type for GKE nodes"
  type        = string
  default     = "pd-standard"
}

variable "service_account" {
  description = "The service account to use for GKE nodes"
  type        = string
  default     = null
}

variable "node_labels" {
  description = "The labels to apply to GKE nodes"
  type        = map(string)
  default     = {}
}

variable "node_taints" {
  description = "The taints to apply to GKE nodes"
  type        = list(object({
    key    = string
    value  = string
    effect = string
  }))
  default     = []
}
