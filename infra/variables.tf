variable "repository_url" {
    description = "GitHub repository URL para SWA (vazio em PR)"
    type        = string
    default     = ""
}

variable "repository_branch" {
    description = "Branch do repositório para SWA (vazio em PR)"
    type        = string
    default     = ""
}

variable "repository_token" {
    description = "GitHub PAT para linkage CI (omitido em PR)"
    type        = string
    sensitive   = true
    default     = ""
}