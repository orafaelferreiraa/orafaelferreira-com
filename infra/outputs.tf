output "static_site_default_hostname" {
  value       = azurerm_static_web_app.this.default_host_name
  description = "Default hostname of the Static Web App"
}

output "validation_token" {
  value = azurerm_static_web_app_custom_domain.txt-value.validation_token
  description = "Validation token for the custom domain DNS TXT record"  
}