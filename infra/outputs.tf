output "static_site_id" {
  value       = azurerm_static_web_app.this.id
  description = "Resource ID of the Static Web App"
}

output "static_site_default_hostname" {
  value       = azurerm_static_web_app.this.default_host_name
  description = "Default hostname of the Static Web App"
}