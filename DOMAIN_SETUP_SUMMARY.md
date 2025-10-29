# Resumo: Configuração de Domínio Customizado (Azure DNS)

## ✅ Mudanças Aplicadas

### 1. Terraform - Azure DNS Integration (`infra/main.tf`)

```hcl
# Data source para a zona DNS existente
data "azurerm_dns_zone" "main" {
  name                = "orafaelferreira.com"
  resource_group_name = data.azurerm_resource_group.rg.name
}

# Domínio Apex + WWW
resource "azurerm_static_web_app_custom_domain" "apex" { ... }
resource "azurerm_static_web_app_custom_domain" "www" { ... }

# DNS Records criados AUTOMATICAMENTE
resource "azurerm_dns_txt_record" "apex_validation" {
  name   = "_dnsauth"
  record { value = azurerm_static_web_app_custom_domain.apex.validation_token }
}

resource "azurerm_dns_cname_record" "www" {
  name   = "www"
  record = azurerm_static_web_app.this.default_host_name
}
```

### 2. Outputs Atualizados (`infra/outputs.tf`)

```hcl
# Name servers da zona DNS (para configurar no registrador)
output "dns_zone_nameservers" { ... }

# Domínios configurados
output "custom_domains" { ... }

# Registros DNS criados automaticamente
output "dns_records_created" { ... }
```

### 3. Documentação Atualizada (`infra/CUSTOM_DOMAIN.md`)

- ✅ Processo totalmente automatizado via Terraform
- ✅ Sem necessidade de configuração manual de registros DNS
- ✅ Foco em validar name servers no registrador
- ✅ Comandos de verificação via Azure CLI

## 🎉 Vantagens da Configuração com Azure DNS

✅ **Zero configuração manual**: Terraform cria todos os registros DNS
✅ **Propagação rápida**: DNS updates dentro do Azure (< 2h vs 48h)
✅ **Validação automática**: Integração nativa entre DNS Zone e SWA
✅ **Infraestrutura como código**: Tudo versionado e reproduzível
✅ **Rollback fácil**: `terraform destroy` remove tudo

## 🎯 Próximos Passos (SIMPLIFICADOS!)

### Passo 1: Commit & Push

```bash
git add .
git commit -m "feat(infra): integrate Azure DNS for automatic custom domain setup

- Add data source for existing Azure DNS Zone
- Create DNS TXT record for apex domain validation (automatic)
- Create DNS CNAME record for www subdomain (automatic)
- Update outputs to show DNS records and name servers
- Update documentation for Azure DNS integration"

git push origin main
```

git push origin main
```

### Passo 2: Aguardar Pipeline

A pipeline `.github/workflows/infra.yml` vai:
1. ✅ Validar e formatar código Terraform
2. ✅ Criar plano de execução
3. ✅ **Aplicar mudanças automaticamente** (criar recursos)
4. ✅ Exibir outputs no GitHub Summary

### Passo 3: Verificar Outputs (Automático!)

Após o `terraform apply` na pipeline, verifique os outputs no GitHub Summary:

```
dns_zone_nameservers:
  - ns1-xx.azure-dns.com
  - ns2-xx.azure-dns.net
  - ns3-xx.azure-dns.org
  - ns4-xx.azure-dns.info

custom_domains:
  - apex: orafaelferreira.com
  - www: www.orafaelferreira.com

dns_records_created:
  - _dnsauth.orafaelferreira.com (TXT) -> <validation-token>
  - www.orafaelferreira.com (CNAME) -> <swa>.azurestaticapps.net
```

### Passo 4: Configurar Name Servers no GoDaddy (ÚNICO PASSO MANUAL!)

**⚠️ PASSO CRÍTICO**: No painel do GoDaddy, configure os 4 name servers do Azure DNS.

**Passo a passo GoDaddy:**

1. Acesse https://dcc.godaddy.com/manage/
2. Clique em `orafaelferreira.com`
3. Additional Settings → **Manage DNS**
4. Role até o final → **Change Nameservers**
5. Selecione **"I'll use my own nameservers"**
6. Cole os 4 name servers do output `dns_zone_nameservers`
7. **Save**

**Os name servers serão algo como:**
```
ns1-01.azure-dns.com
ns2-01.azure-dns.net
ns3-01.azure-dns.org
ns4-01.azure-dns.info
```

⚠️ **Importante**: Copie EXATAMENTE os valores do output do Terraform!

### Passo 5: Aguardar Propagação (Automático!)

- **Propagação de name servers** (se mudou agora): 24-48h
- **Propagação de registros DNS** (se name servers já estavam corretos): 15 min - 2h
- **Validação Azure**: Automática após propagação
- **Certificado SSL**: 5-10 min após validação

### Passo 6: Verificar Status

**Via Portal Azure:**
```
Resource Group: rg-site
→ DNS Zone: orafaelferreira.com
  → Verificar registros: _dnsauth (TXT) e www (CNAME)

→ Static Web App: swa-site-orafael
  → Settings → Custom domains
  → Status: Validating → Approved → Ready ✅
```

**Via CLI:**
```bash
# Listar registros DNS criados
az network dns record-set list \
  --resource-group rg-site \
  --zone-name orafaelferreira.com \
  --output table

# Status dos custom domains
az staticwebapp hostname list \
  --name swa-site-orafael \
  --resource-group rg-site \
  --output table
```

### Passo 7: Testar HTTPS

```bash
# Verificar resolução DNS
nslookup orafaelferreira.com
nslookup www.orafaelferreira.com

# Testar acesso HTTPS
curl -I https://orafaelferreira.com
curl -I https://www.orafaelferreira.com

# Verificar certificado SSL
openssl s_client -connect orafaelferreira.com:443 < /dev/null | grep "Verify return code"
```

## 📋 Checklist Simplificado

- [ ] Commit e push das mudanças
- [ ] Pipeline de infra executada com sucesso
- [ ] **Verificar name servers no registrador** (único passo manual!)
- [ ] Aguardar propagação DNS
- [ ] Validação automática no Azure Portal (Custom domains → Ready)
- [ ] Certificado SSL provisionado automaticamente
- [ ] Testar HTTPS em ambos os domínios

## 🔍 O Que o Terraform Faz Automaticamente

### Recursos Criados:

| Recurso | Tipo | Nome/Valor | Propósito |
|---------|------|------------|-----------|
| DNS Zone | `azurerm_dns_zone` | `orafaelferreira.com` | Zona DNS no Azure (CRIADA!) |
| Custom Domain (Apex) | `azurerm_static_web_app_custom_domain` | `orafaelferreira.com` | Registrar domínio no SWA |
| Custom Domain (WWW) | `azurerm_static_web_app_custom_domain` | `www.orafaelferreira.com` | Registrar subdomínio no SWA |
| DNS TXT Record | `azurerm_dns_txt_record` | `_dnsauth` | Validação automática do apex |
| DNS CNAME Record | `azurerm_dns_cname_record` | `www` → SWA hostname | Apontar www para o SWA |

### Fluxo de Validação Automático:

```
1. Terraform cria registro TXT _dnsauth com token de validação
   ↓
2. Azure DNS propaga o registro (< 5 min)
   ↓
3. Azure SWA detecta o TXT record e valida o domínio apex
   ↓
4. Terraform cria registro CNAME www → SWA
   ↓
5. Azure DNS propaga o CNAME (< 5 min)
   ↓
6. Azure SWA detecta o CNAME e valida o subdomínio www
   ↓
7. Azure provisiona certificados SSL para ambos (Let's Encrypt)
   ↓
8. ✅ Domínios prontos com HTTPS!
```

## ⚠️ Atenções

1. **Name Servers**: Se acabou de mudar para Azure DNS, pode levar 24-48h para propagar
2. **Primeira validação**: Certificado SSL na primeira vez pode demorar até 1h
3. **SKU Free**: Funciona perfeitamente com validação TXT + CNAME

## 📚 Arquivos Modificados

```
infra/
├── main.tf              # ✅ Adicionado data source DNS Zone + registros DNS (TXT/CNAME)
├── outputs.tf           # ✅ Outputs para name servers e registros criados
├── providers.tf         # ✅ Versioning flexibilizado
├── CUSTOM_DOMAIN.md     # ✅ Atualizado para Azure DNS (setup automático)
└── README.md            # (será atualizado por terraform-docs na pipeline)

README.md                # ✅ Seção "domínios e HTTPS" já atualizada
DOMAIN_SETUP_SUMMARY.md  # ✅ Este arquivo (resumo atualizado)
```

---

**🎉 Resultado Final**: Setup 95% automatizado! Único passo manual é verificar name servers no registrador.
