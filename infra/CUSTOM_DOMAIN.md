# Configuração de Domínio Customizado - Azure Static Web App

Este guia explica como conectar o domínio `orafaelferreira.com` ao Azure Static Web App usando Terraform.

**🎉 Configuração 100% Automatizada!** O Terraform cria a zona DNS no Azure e todos os registros necessários automaticamente.

## 📋 Pré-requisitos

- Domínio `orafaelferreira.com` registrado no **GoDaddy** (ou outro registrador)
- Acesso ao painel GoDaddy para configurar name servers (único passo manual)

## 🚀 Processo de Configuração

### 1. Deploy da Infraestrutura

O Terraform vai automaticamente:
- ✅ **Criar a zona DNS no Azure** (`orafaelferreira.com`)
- ✅ Criar os recursos de custom domain no SWA
- ✅ Criar registro TXT `_dnsauth` para validação do domínio apex
- ✅ Criar registro CNAME `www` apontando para o SWA
- ✅ Configurar validação automática no Azure

```bash
cd infra
terraform init
terraform plan
terraform apply
```

### 2. Verificar Outputs

Após o `terraform apply`, verifique os recursos criados:

```bash
# Name servers da zona DNS (devem estar configurados no registrador)
terraform output dns_zone_nameservers

# Domínios customizados configurados
terraform output custom_domains

# Registros DNS criados automaticamente
terraform output dns_records_created
```

### 3. Configurar Name Servers no GoDaddy (ÚNICO PASSO MANUAL!)

**⚠️ PASSO CRÍTICO**: Configure os name servers do Azure DNS no GoDaddy.

**Como fazer no GoDaddy:**

1. Acesse [GoDaddy Domain Manager](https://dcc.godaddy.com/manage/)
2. Clique no seu domínio `orafaelferreira.com`
3. Role até **Additional Settings** → **Manage DNS**
4. Clique em **Change Nameservers** (no final da página)
5. Selecione **"I'll use my own nameservers"**
6. Cole os 4 name servers exibidos no output `dns_zone_nameservers`:
   ```
   ns1-xx.azure-dns.com
   ns2-xx.azure-dns.net
   ns3-xx.azure-dns.org
   ns4-xx.azure-dns.info
   ```
7. Clique em **Save**

⏱️ **Tempo de propagação**: 24-48 horas (normalmente < 2 horas)

### 4. Aguardar Propagação DNS

- A propagação DNS pode levar de **15 minutos a 2 horas** (normalmente mais rápido dentro do Azure)
- Para checar: `nslookup orafaelferreira.com` ou use [DNS Checker](https://dnschecker.org/)

### 5. Validação Automática no Azure

Após a propagação DNS, o Azure **automaticamente**:
- ✅ Valida o domínio via registro TXT
- ✅ Provisiona certificado SSL/TLS gratuito (Let's Encrypt)
- ✅ Ativa HTTPS para ambos os domínios

Você pode acompanhar no portal Azure ou via CLI:

```bash
az staticwebapp hostname list \
  --name swa-site-orafael \
  --resource-group rg-site
```

## 🔒 Certificado SSL/TLS

O Azure Static Web App **provisiona automaticamente** certificados SSL/TLS gratuitos via Let's Encrypt.

- **Renovação**: Automática
- **Protocolo**: TLS 1.2+
- **Tempo de provisionamento**: 5-10 minutos após validação DNS

## 🧪 Testar a Configuração

Após tudo configurado:

```bash
# Testar resolução DNS
nslookup orafaelferreira.com
nslookup www.orafaelferreira.com

# Testar HTTP (deve redirecionar para HTTPS)
curl -I http://orafaelferreira.com

# Testar HTTPS
curl -I https://orafaelferreira.com
curl -I https://www.orafaelferreira.com

# Verificar certificado SSL
openssl s_client -connect orafaelferreira.com:443 -servername orafaelferreira.com < /dev/null
```

## 📋 Recursos DNS Criados Automaticamente

O Terraform cria os seguintes recursos:

| Recurso | Tipo | Nome/Valor | Propósito |
|---------|------|------------|-----------|
| 1 | DNS Zone | `orafaelferreira.com` | Zona DNS no Azure |
| 2 | TXT Record | `_dnsauth` | Validação do domínio apex |
| 3 | CNAME Record | `www` → SWA | Apontar www para o SWA |

## 🔍 Verificar Recursos no Azure

### Via Portal Azure:

**DNS Zone:**
1. Resource Group: `rg-site`
2. DNS Zone: `orafaelferreira.com`
3. Verificar registros: `_dnsauth` (TXT) e `www` (CNAME)

**Static Web App:**
1. Resource Group: `rg-site`
2. Static Web App: `swa-site-orafael`
3. Settings → Custom domains
4. Status: `Validating` → `Approved` → `Ready`

### Via CLI:

```bash
# Listar registros DNS
az network dns record-set list \
  --resource-group rg-site \
  --zone-name orafaelferreira.com \
  --output table

# Verificar custom domains no SWA
az staticwebapp hostname list \
  --name swa-site-orafael \
  --resource-group rg-site \
  --query "[].{Domain:name,Status:status}" \
  --output table
```

## ⚠️ Troubleshooting

### Erro: "Domain validation failed"

**Causa**: DNS não propagou ou name servers não estão corretos no registrador.

**Solução**: 
- Verifique se os name servers do Azure DNS estão configurados no registrador
- Aguarde mais tempo para propagação (até 48h se acabou de mudar name servers)
- Confirme os registros DNS: `dig _dnsauth.orafaelferreira.com TXT` e `dig www.orafaelferreira.com CNAME`

### Erro: "Certificate provisioning failed"

**Causa**: Validação bem-sucedida mas certificado não foi emitido.

**Solução**:
- Aguarde até 24h (primeiro certificado pode demorar)
- Verifique se não há CAA records bloqueando Let's Encrypt
- Entre em contato com suporte Azure se persistir

### Name servers não estão propagando

**Solução**: 
1. Confirme que configurou os 4 name servers do Azure no registrador
2. Use `nslookup -type=NS orafaelferreira.com` para verificar
3. Aguarde até 48h para propagação completa

### Registros DNS não aparecem na zona

**Causa**: Terraform ainda não foi aplicado ou houve erro.

**Solução**:
```bash
cd infra
terraform plan  # Verificar o que será criado
terraform apply # Aplicar mudanças
```

## 🎯 Vantagens de Usar Azure DNS

✅ **Totalmente automatizado**: Terraform cria tudo (sem configuração manual)
✅ **Propagação rápida**: DNS updates são mais rápidos dentro do Azure
✅ **Integração nativa**: Validação automática entre DNS Zone e SWA
✅ **Infraestrutura como código**: Tudo versionado e reproduzível
✅ **Rollback fácil**: `terraform destroy` remove tudo

## 📚 Referências

- [Azure DNS Zones](https://learn.microsoft.com/azure/dns/dns-zones-records)
- [Azure Static Web Apps - Custom Domains](https://learn.microsoft.com/azure/static-web-apps/custom-domain)
- [Terraform: azurerm_dns_txt_record](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dns_txt_record)
- [Terraform: azurerm_dns_cname_record](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/dns_cname_record)

---

## 🔄 Remover Domínio Customizado

Para remover os domínios e registros DNS:

```bash
cd infra
# Comente ou remova os blocos de custom_domain e dns_record no main.tf
terraform plan
terraform apply
```

O Terraform automaticamente remove:
- Registros DNS (_dnsauth TXT e www CNAME)
- Custom domains no SWA
- Certificados SSL associados
