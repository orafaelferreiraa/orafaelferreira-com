# Existing Resource Group (created outside Terraform)
data "azurerm_resource_group" "rg" {
  name = "rg-site"
}

# Azure Static Web App (SWA)
resource "azurerm_static_web_app" "this" {
  name                = "swa-site"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location

  sku_tier = "Free"
  sku_size = "Free"  
}
