terraform {
  backend "azurerm" {
    # Storage Account onde o state será armazenado
    resource_group_name  = "rg-site"
    storage_account_name = "stostateorafael"
    container_name       = "statetf"
    key                  = "infra.terraform.tfstate"
    
    # Usar Azure AD auth (OIDC do GitHub via azure/login)
    use_azuread_auth     = true
  }
}