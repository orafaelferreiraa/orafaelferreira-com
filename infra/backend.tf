terraform {
  backend "azurerm" {
    # Storage Account onde o state será armazenado
    resource_group_name  = "rg-site"
    storage_account_name = "stostateorafael"
    container_name       = "statetf"
    key                  = "infra.terraform.tfstate"
    
    # Usar Managed Identity para autenticação
    use_msi              = true
    # Subscription e Tenant precisam ser passados via variáveis de ambiente ou backend-config
  }
}