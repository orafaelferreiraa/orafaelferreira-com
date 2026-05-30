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

resource "azurerm_dns_a_record" "apex" {
  provider            = azurerm.dns
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  target_resource_id  = azurerm_static_web_app.this.id
}

resource "azapi_resource" "apex_custom_domain" {
  provider  = azapi.site
  type      = "Microsoft.Web/staticSites/customDomains@2024-04-01"
  name      = "orafaelferreira.com"
  parent_id = azurerm_static_web_app.this.id

  body = {
    properties = {
      validationMethod = "dns-txt-token"
    }
  }

  response_export_values = {
    validation_token = "properties.validationToken"
  }

  depends_on = [
    azurerm_dns_a_record.apex,
  ]
}

data "azapi_resource" "apex_txt_current" {
  provider  = azapi.dns
  type      = "Microsoft.Network/dnsZones/TXT@2018-05-01"
  name      = "@"
  parent_id = data.azurerm_dns_zone.this.id

  response_export_values = {
    values = "properties.TXTRecords[].value[0]"
  }

  depends_on = [
    data.azurerm_dns_zone.this,
  ]
}

locals {
  apex_txt_values = distinct(concat(
    try(data.azapi_resource.apex_txt_current.output.values, []),
    [azapi_resource.apex_custom_domain.output.validation_token]
  ))
}

resource "azurerm_dns_txt_record" "apex_validation" {
  provider            = azurerm.dns
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600

  dynamic "record" {
    for_each = local.apex_txt_values
    content {
      value = record.value
    }
  }

  depends_on = [
    azapi_resource.apex_custom_domain,
  ]
}
