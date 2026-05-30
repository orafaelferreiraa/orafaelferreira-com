variable "repository_url" {
  description = "GitHub repository URL para linkage opcional do SWA"
  type        = string
  default     = ""
}

variable "repository_branch" {
  description = "Branch do repositório para linkage opcional do SWA"
  type        = string
  default     = ""
}

variable "repository_token" {
  description = "GitHub PAT para linkage opcional do SWA"
  type        = string
  sensitive   = true
  default     = ""
}

variable "site_subscription_id" {
  description = "Subscription ID onde estao rg-site e a Static Web App"
  type        = string
  default     = ""
}

variable "dns_subscription_id" {
  description = "Subscription ID onde esta a zona DNS orafaelferreira.com"
  type        = string
  default     = ""
}

