output "static_site_default_hostname" {
  value       = azurerm_static_web_app.this.default_host_name
  description = "Default hostname of the Static Web App"
}

output "custom_domains" {
  value = {
    apex = azurerm_static_web_app_custom_domain.apex.domain_name
    www  = azurerm_static_web_app_custom_domain.www.domain_name
  }
  description = "Custom domains configured for the Static Web App"
}
