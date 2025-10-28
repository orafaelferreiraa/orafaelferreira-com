terraform {
  backend "azurerm" {
    resource_group_name  = "rg-site"
    storage_account_name = "stostateorafael"
    container_name       = "statetf"
    key                  = "infra.terraform.tfstate"
  }
}