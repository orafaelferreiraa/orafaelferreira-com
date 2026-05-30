terraform {
  required_version = "~> 1.14.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azurerm" {
  alias = "site"
  features {}
  subscription_id = var.site_subscription_id != "" ? var.site_subscription_id : null
}

provider "azurerm" {
  alias = "dns"
  features {}
  subscription_id = var.dns_subscription_id != "" ? var.dns_subscription_id : null
}
