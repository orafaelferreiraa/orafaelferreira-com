# Existing Resource Group (created outside Terraform)
data "azurerm_resource_group" "rg" {
  provider = azurerm.site
  name     = "rg-site"
}

# Existing DNS zone (created outside Terraform)
data "azurerm_resource_group" "dns_rg" {
  provider = azurerm.dns
  name     = "rg-orafaelferreira.com"
}

data "azurerm_dns_zone" "this" {
  provider            = azurerm.dns
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
  provider            = azurerm.dns
  name                = "www"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  record              = azurerm_static_web_app.this.default_host_name
}

resource "azurerm_dns_a_record" "apex" {
  provider            = azurerm.dns
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  target_resource_id  = azurerm_static_web_app.this.id
}

resource "azurerm_dns_txt_record" "apex_validation" {
  count               = var.apex_domain_validation_token != "" ? 1 : 0
  provider            = azurerm.dns
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600

  record {
    value = var.apex_domain_validation_token
  }
}

resource "azurerm_static_web_app_custom_domain" "www" {
  provider          = azurerm.site
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "orafaelferreira.com"
  validation_type   = "cname-delegation"

  depends_on = [
    azurerm_dns_cname_record.www,
  ]
}

resource "azurerm_static_web_app_custom_domain" "apex" {
  count             = var.apex_domain_validation_token != "" ? 1 : 0
  provider          = azurerm.site
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "orafaelferreira.com"
  validation_type   = "dns-txt-token"

  depends_on = [
    azurerm_dns_a_record.apex,
    azurerm_dns_txt_record.apex_validation[0],
  ]
}
