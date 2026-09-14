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

variable "apex_base_txt_records" {
  description = "Lista base de TXT no apex que devem ser preservados (ex.: SPF)."
  type        = list(string)
  default     = ["v=spf1 include:spf.protection.outlook.com -all"]
}

variable "dns_resource_group_name" {
  description = "Resource group que hospeda a zona DNS do site"
  type        = string
  default     = "rg-orafaelferreira.com"
}

variable "dns_zone_name" {
  description = "Nome da zona DNS publica do site"
  type        = string
  default     = "orafaelferreira.com"
}

variable "apex_validation_token" {
  description = "Token dns-txt-token ja emitido para o apex. A API do SWA zera validation_token depois que o dominio fica Ready, entao o valor corrente precisa ser preservado aqui."
  type        = string
  default     = "_4mdweg4s15bm5qayflvroflljnvvf5e"
}
