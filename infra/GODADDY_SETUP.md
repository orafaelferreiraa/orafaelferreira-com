# Guia Rápido: Configurar Name Servers no GoDaddy

## 🎯 Objetivo

Após o Terraform criar a zona DNS no Azure, você precisa configurar os name servers do Azure no GoDaddy para que o domínio aponte para os registros DNS gerenciados pelo Azure.

## 📝 Passo a Passo

### 1. Obter Name Servers do Azure

Após rodar `terraform apply`, copie os name servers do output:

```bash
cd infra
terraform output dns_zone_nameservers
```

Você verá algo como:
```
[
  "ns1-01.azure-dns.com",
  "ns2-01.azure-dns.net",
  "ns3-01.azure-dns.org",
  "ns4-01.azure-dns.info"
]
```

⚠️ **Importante**: Os números após `ns1-`, `ns2-`, etc. serão diferentes! Use os valores EXATOS que o Terraform exibiu.

---

### 2. Acessar Painel GoDaddy

1. Vá para https://dcc.godaddy.com/manage/
2. Faça login com sua conta GoDaddy
3. Você verá a lista dos seus domínios

---

### 3. Abrir Configurações DNS

1. Localize `orafaelferreira.com` na lista
2. Clique no nome do domínio **ou** clique nos 3 pontinhos → **Manage DNS**
3. Você será redirecionado para a página de gerenciamento DNS

---

### 4. Mudar Name Servers

1. **Role até o final da página** (importante!)
2. Encontre a seção **"Nameservers"**
3. Clique no botão **"Change"** ou **"Change Nameservers"**
4. Você verá duas opções:
   - ⚪ Default (GoDaddy nameservers)
   - 🔵 **Custom (use my own nameservers)** ← **SELECIONE ESTA**

---

### 5. Adicionar Name Servers do Azure

1. Após selecionar "Custom", aparecerão 4 campos de texto
2. Cole os name servers do Azure **NA ORDEM**:
   
   ```
   Campo 1: ns1-01.azure-dns.com
   Campo 2: ns2-01.azure-dns.net
   Campo 3: ns3-01.azure-dns.org
   Campo 4: ns4-01.azure-dns.info
   ```

   ⚠️ **Use os valores do SEU output, não os exemplos acima!**

3. Clique em **"Save"**

---

### 6. Confirmar Mudança

GoDaddy pode mostrar um aviso:

> ⚠️ "Changing your nameservers may impact your website, email, and other services."

**Clique em "OK" ou "Continue"** - isso é normal e esperado!

---

## ⏱️ Tempo de Propagação

| Fase | Tempo Esperado |
|------|---------------|
| GoDaddy salva a mudança | Imediato |
| Name servers globais detectam mudança | 15 min - 2 horas |
| Propagação completa (100%) | 24-48 horas |

**Dica**: Normalmente, em 1-2 horas você já consegue acessar o site!

---

## 🧪 Como Testar se Está Funcionando

### Teste 1: Verificar Name Servers

```bash
# Windows (PowerShell)
nslookup -type=NS orafaelferreira.com

# Linux/Mac
dig orafaelferreira.com NS +short
```

**Resultado esperado**: Deve retornar os name servers do Azure (ns1-xx.azure-dns.com, etc.)

---

### Teste 2: Verificar Registro TXT

```bash
nslookup -type=TXT _dnsauth.orafaelferreira.com
```

**Resultado esperado**: Deve retornar o token de validação criado pelo Terraform.

---

### Teste 3: Verificar CNAME do WWW

```bash
nslookup www.orafaelferreira.com
```

**Resultado esperado**: Deve retornar `swa-site-orafael.azurestaticapps.net`

---

### Teste 4: Testar HTTPS

```bash
curl -I https://orafaelferreira.com
curl -I https://www.orafaelferreira.com
```

**Resultado esperado**: Status `200 OK` com certificado SSL válido.

---

## ❓ FAQ

### Quanto tempo demora para o site funcionar?

- **Name servers propagarem**: 1-2 horas (normalmente)
- **Azure validar domínios**: 5-15 minutos após propagação
- **Certificado SSL ser emitido**: 5-10 minutos após validação

**Total**: ~2-3 horas na maioria dos casos

---

### Vou perder acesso ao site antigo?

Sim, temporariamente. Assim que os name servers mudarem, o domínio apontará para o Azure. Durante a propagação (1-2h), algumas pessoas verão o site antigo e outras o novo.

**Solução**: Faça a mudança fora do horário de pico!

---

### E se eu errar os name servers?

Você pode voltar e editá-los a qualquer momento no GoDaddy. Basta repetir os passos 3-5.

---

### Como voltar aos name servers antigos do GoDaddy?

1. Vá em Manage DNS → Change Nameservers
2. Selecione **"Default (GoDaddy nameservers)"**
3. Save

Isso fará o domínio voltar a usar os DNS do GoDaddy.

---

### Posso manter emails no GoDaddy?

⚠️ **Cuidado!** Se você usa email do GoDaddy (ex: `contato@orafaelferreira.com`), ao mudar os name servers, os registros MX (email) serão perdidos.

**Solução**: Após o Terraform criar a zona DNS, você precisa adicionar os registros MX manualmente no Azure DNS Zone ou reconfigurar o email para outro provedor.

---

## 📚 Referências

- [GoDaddy: Como mudar nameservers](https://www.godaddy.com/help/change-nameservers-for-my-domains-664)
- [Azure DNS Zones](https://learn.microsoft.com/azure/dns/dns-zones-records)
- [DNS Propagation Checker](https://dnschecker.org/)

---

## ✅ Checklist Final

- [ ] Terraform aplicou com sucesso
- [ ] Copiei os 4 name servers do output
- [ ] Acessei GoDaddy → Manage DNS
- [ ] Mudei para Custom nameservers
- [ ] Colei os 4 name servers do Azure
- [ ] Salvei as mudanças
- [ ] Aguardando propagação (1-2h)
- [ ] Testei `nslookup -type=NS orafaelferreira.com`
- [ ] Testei acesso HTTPS ao site

---

**🎉 Pronto! Em breve seu domínio estará funcionando com Azure DNS e certificado SSL automático!**
