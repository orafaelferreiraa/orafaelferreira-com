# Arquitetura: Custom Domain com Azure DNS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REGISTRADOR DE DOMÍNIO                          │
│                       (GoDaddy / Registro.br / etc.)                    │
│                                                                         │
│  Domain: orafaelferreira.com                                           │
│                                                                         │
│  Name Servers (CONFIGURAÇÃO MANUAL - ÚNICA VEZ):                       │
│    • ns1-xx.azure-dns.com                                              │
│    • ns2-xx.azure-dns.net                                              │
│    • ns3-xx.azure-dns.org                                              │
│    • ns4-xx.azure-dns.info                                             │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ DNS Queries
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          AZURE DNS ZONE                                 │
│                      (orafaelferreira.com)                              │
│                                                                         │
│  Registros DNS (CRIADOS AUTOMATICAMENTE PELO TERRAFORM):               │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  TXT Record: _dnsauth.orafaelferreira.com                     │    │
│  │  Valor: <validation-token-gerado-pelo-azure>                  │    │
│  │  TTL: 3600                                                     │    │
│  │  ➜ Propósito: Validar domínio apex no SWA                     │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  CNAME Record: www.orafaelferreira.com                        │    │
│  │  Valor: swa-site-orafael.azurestaticapps.net                  │    │
│  │  TTL: 3600                                                     │    │
│  │  ➜ Propósito: Apontar subdomínio para SWA                     │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
└────────────┬────────────────────────────────────┬───────────────────────┘
             │                                    │
             │ Validação TXT                      │ CNAME Resolution
             │                                    │
             ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AZURE STATIC WEB APP (SWA)                           │
│                       swa-site-orafael                                  │
│                                                                         │
│  Custom Domains (CONFIGURADOS PELO TERRAFORM):                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  1. orafaelferreira.com (apex)                                │    │
│  │     Status: Validating → Approved → Ready                     │    │
│  │     Validation: dns-txt-token                                 │    │
│  │     SSL/TLS: ✅ Let's Encrypt (auto-renovado)                 │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  2. www.orafaelferreira.com (subdomain)                       │    │
│  │     Status: Validating → Approved → Ready                     │    │
│  │     Validation: cname-delegation                              │    │
│  │     SSL/TLS: ✅ Let's Encrypt (auto-renovado)                 │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Default Hostname:                                                     │
│  • swa-site-orafael.azurestaticapps.net                                │
│                                                                         │
│  Content:                                                               │
│  • React SPA (Vite build from dist/)                                   │
│  • Routing: SPA fallback (staticwebapp.config.json)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           USUÁRIOS FINAIS                               │
└─────────────────────────────────────────────────────────────────────────┘
       │                                    │
       │ https://orafaelferreira.com       │ https://www.orafaelferreira.com
       ▼                                    ▼
    ┌──────┐                             ┌──────┐
    │ 🔒   │ SSL/TLS Encryption         │ 🔒   │ SSL/TLS Encryption
    │ ✅   │ Let's Encrypt Certificate  │ ✅   │ Let's Encrypt Certificate
    │ 🚀   │ CDN Global Distribution    │ 🚀   │ CDN Global Distribution
    └──────┘                             └──────┘
```

---

## Fluxo de Configuração (Terraform)

```
1️⃣  TERRAFORM APPLY
    ├─ Cria Custom Domain (apex) no SWA
    ├─ Cria Custom Domain (www) no SWA
    ├─ Gera validation token para apex
    ├─ Cria DNS TXT record com validation token
    └─ Cria DNS CNAME record apontando para SWA

2️⃣  DNS PROPAGATION (automático)
    ├─ Azure DNS propaga TXT record (~5 min)
    └─ Azure DNS propaga CNAME record (~5 min)

3️⃣  AZURE VALIDATION (automático)
    ├─ SWA detecta TXT record _dnsauth
    ├─ Valida domínio apex ✅
    ├─ SWA detecta CNAME www
    └─ Valida subdomínio www ✅

4️⃣  SSL PROVISIONING (automático)
    ├─ Azure solicita certificado Let's Encrypt
    ├─ Valida propriedade do domínio
    ├─ Emite certificado SSL/TLS
    └─ Configura auto-renovação ✅

5️⃣  PRONTO! 🎉
    ├─ https://orafaelferreira.com ✅
    └─ https://www.orafaelferreira.com ✅
```

---

## Dependências entre Recursos

```
azurerm_dns_zone (data source)
    │
    ├──▶ azurerm_dns_txt_record.apex_validation
    │       │
    │       │ (usa validation_token de)
    │       │
    │       └──▶ azurerm_static_web_app_custom_domain.apex
    │
    └──▶ azurerm_dns_cname_record.www
            │
            │ (aponta para default_host_name de)
            │
            └──▶ azurerm_static_web_app.this
                     │
                     └──▶ azurerm_static_web_app_custom_domain.www
```

---

## Comparação: Antes vs Depois

### ❌ Antes (Configuração Manual)

1. Terraform aplica → gera tokens
2. **VOCÊ copia tokens manualmente**
3. **VOCÊ vai no painel DNS do registrador**
4. **VOCÊ cria registros TXT e CNAME**
5. Aguarda propagação (15 min - 48h)
6. Azure valida
7. Certificado provisionado

**Passos manuais**: 3  
**Tempo**: 1-48 horas (dependendo do registrador)  
**Risco de erro**: Alto (cópia errada de token, typo em registros)

---

### ✅ Depois (Azure DNS Automatizado)

1. Terraform aplica → **cria tudo automaticamente**
2. Aguarda propagação (5-15 min dentro do Azure)
3. Azure valida
4. Certificado provisionado

**Passos manuais**: 0 (exceto verificar name servers no registrador - uma vez)  
**Tempo**: 5-20 minutos  
**Risco de erro**: Mínimo (tudo via código)

---

## Recursos Terraform Criados

| Recurso | Type | Address | Descrição |
|---------|------|---------|-----------|
| DNS Zone | `data.azurerm_dns_zone.main` | Existente | Zona DNS do domínio |
| SWA Custom Domain (Apex) | `azurerm_static_web_app_custom_domain.apex` | Criado | Domínio apex no SWA |
| SWA Custom Domain (WWW) | `azurerm_static_web_app_custom_domain.www` | Criado | Subdomínio www no SWA |
| DNS TXT Record | `azurerm_dns_txt_record.apex_validation` | Criado | Validação apex |
| DNS CNAME Record | `azurerm_dns_cname_record.www` | Criado | Apontamento www |

**Total**: 4 recursos criados automaticamente pelo Terraform
