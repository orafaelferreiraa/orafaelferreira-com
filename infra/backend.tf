terraform {
  backend "azurerm" {
    # Storage Account onde o state será armazenado
    resource_group_name  = "rg-site"
    storage_account_name = "stostateorafael"
    container_name       = "statetf"
    key                  = "infra.terraform.tfstate"
    
    # Usar Azure AD (RBAC) no plano de dados do Storage com Service Principal
    # Requer papel "Storage Blob Data Contributor" para o SP neste Storage Account
    use_azuread_auth     = true
  }
}