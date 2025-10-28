output "static_site_default_hostname" {
  value       = azurerm_static_web_app.this.default_host_name
  description = "Default hostname of the Static Web App"
}