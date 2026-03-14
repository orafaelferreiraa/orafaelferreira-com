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

