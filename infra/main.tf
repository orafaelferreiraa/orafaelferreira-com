# Existing Resource Group (created outside Terraform)
data "azurerm_resource_group" "rg" {
  name = "rg-site"
}
# Azure Static Web App (SWA)
resource "azurerm_static_web_app" "this" {
  tags = {
    test: "1"
  }
  name                = "swa-site-orafael"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = "eastus2"

  sku_tier = "Free"
  sku_size = "Free"

  repository_url     = var.repository_url
  repository_branch  = var.repository_branch
  repository_token   = var.repository_token

}

# validation_type
resource "azurerm_static_web_app_custom_domain" "txt-value" {
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "www.orafaelferreira.com"
  validation_type   = "dns-txt-token"
}