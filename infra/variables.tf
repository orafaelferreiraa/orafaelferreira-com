variable "repository_url" {
    description = "GitHub repository URL to link SWA (optional for PRs; provided on push)"
    type        = string
}

variable "repository_branch" {
    description = "GitHub repository branch to link SWA (optional for PRs; provided on push)"
    type        = string
}

variable "repository_token" {
    description = "GitHub PAT used by Azure to configure CI linkage (provided on push)"
    type        = string
    sensitive   = true
}