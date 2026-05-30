# Existing Resource Group (created outside Terraform)
data "azurerm_resource_group" "rg" {
  name = "rg-site"
}

# Existing DNS zone (created outside Terraform)
data "azurerm_resource_group" "dns_rg" {
  provider = azurerm.site
  name     = "rg-orafaelferreira.com"
}

data "azurerm_dns_zone" "this" {
  provider            = azurerm.site
  name                = "orafaelferreira.com"
  resource_group_name = data.azurerm_resource_group.dns_rg.name
}


# Azure Static Web App (SWA)
resource "azurerm_static_web_app" "this" {
  provider            = azurerm.site
  name                = "swa-site-orafael"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = "eastus2"

  sku_tier = "Free"
  sku_size = "Free"

  repository_url    = var.repository_url != "" ? var.repository_url : null
  repository_branch = var.repository_branch != "" ? var.repository_branch : null
  repository_token  = var.repository_token != "" ? var.repository_token : null
}

resource "azurerm_dns_cname_record" "www" {
  name                = "www"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  record              = azurerm_static_web_app.this.default_host_name
}
