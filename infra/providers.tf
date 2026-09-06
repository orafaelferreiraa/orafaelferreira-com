terraform {
  required_version = "~> 1.14.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
  resource_provider_registrations = "none"
}

provider "azurerm" {
  alias                            = "site"
  features {}
  resource_provider_registrations = "none"
  subscription_id                 = var.site_subscription_id != "" ? var.site_subscription_id : null
}

provider "azurerm" {
  alias                            = "dns"
  features {}
  resource_provider_registrations = "none"
  subscription_id                 = var.dns_subscription_id != "" ? var.dns_subscription_id : null
}


provider "azapi" {
  alias           = "site"
  subscription_id = var.site_subscription_id != "" ? var.site_subscription_id : null
}

provider "azapi" {
  alias           = "dns"
  subscription_id = var.dns_subscription_id != "" ? var.dns_subscription_id : null
}
