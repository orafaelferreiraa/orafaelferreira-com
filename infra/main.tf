# Existing Resource Group (created outside Terraform)
data "azurerm_resource_group" "rg" {
  name = "rg-site"
}
# Azure Static Web App (SWA)
resource "azurerm_static_web_app" "this" {
  name                = "swa-site-orafael"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = "eastus2"

  sku_tier = "Free"
  sku_size = "Free"
}

# # Custom Domain - Apex (root domain)
# resource "azurerm_static_web_app_custom_domain" "apex" {
#   static_web_app_id = azurerm_static_web_app.this.id
#   domain_name       = "orafaelferreira.com"
#   validation_type   = "dns-txt-token"
# }

# # Custom Domain - WWW subdomain
# resource "azurerm_static_web_app_custom_domain" "www" {
#   static_web_app_id = azurerm_static_web_app.this.id
#   domain_name       = "www.orafaelferreira.com"
#   validation_type   = "cname-delegation"
# }