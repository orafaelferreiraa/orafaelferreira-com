output "static_web_app_default_hostname" {
  value       = azurerm_static_web_app.this.default_hostname
  description = "Default hostname of the Azure Static Web App."
}

output "static_web_app_id" {
  value       = azurerm_static_web_app.this.id
  description = "Resource ID of the Azure Static Web App."
}
