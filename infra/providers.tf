terraform {
  required_version = "1.10.3"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
  }
}

provider "azurerm" {
  features {}
    use_msi = false
  use_oidc = false
}
