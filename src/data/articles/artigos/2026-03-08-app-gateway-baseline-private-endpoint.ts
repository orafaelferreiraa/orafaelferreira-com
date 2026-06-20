import { Article } from '../types';

export const article: Article = {
  slug: "app-gateway-baseline-private-endpoint",
  title: "Arquitetura Baseline do Zero: App Service com Application Gateway, Private Link e Azure DNS",
  excerpt: "Guia completo e em ordem real para construir a baseline architecture no Azure: DNS público no Azure DNS, App Gateway WAF, Private Endpoints, Key Vault, SQL, Storage, TLS e testes finais sem retrabalho.",
  content: `# Arquitetura baseline do zero (sem retrabalho)

Muita gente me pergunta: "como eu pratico?", "como eu estudo pra certificação?", "como eu monto um laboratório de verdade?". A resposta é simples: implementando. Não adianta só assistir vídeo ou ler documentação se você nunca subiu a arquitetura com as próprias mãos.

A arquitetura que vamos implementar é baseada nas referências oficiais do [Centro de Arquitetura do Azure](https://learn.microsoft.com/pt-br/azure/architecture/), onde a Microsoft publica padrões, práticas recomendadas e arquiteturas de referência para cargas de trabalho reais.

Arquitetura final:

**Usuário -> Azure DNS (público) -> Application Gateway WAF -> Private Endpoint -> App Service**

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/labpe/01.png)

Com serviços de apoio privados:

- Key Vault
- Storage Account
- Azure SQL

[Referência oficial da Microsoft](https://learn.microsoft.com/pt-br/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant)

## O que vamos criar

- Resource Group único para o laboratório
- Domínio público delegado para Azure DNS
- VNet segmentada com subnets dedicadas
- Private DNS Zones para resolução interna de Private Link
- App Service com acesso público desabilitado
- Application Gateway WAF v2 com IP público
- Certificado TLS no Key Vault com Managed Identity
- Validações finais de ponta a ponta

Troque os nomes abaixo para o seu ambiente, mantendo o padrão:

- Resource Group: \`rg-app-baseline-lab\`
- Região: \`Brazil South\`
- Domínio: \`seudominio.com.br\`
- App público: \`app.seudominio.com.br\`
- VNet: \`vnet-app-baseline\`

# ETAPA 1 - Criar Resource Group

Crie o grupo de recursos:

- Nome: \`rg-app-baseline-lab\`
- Região: \`Brazil South\` (ou outra com suporte a zonas)

Tudo do laboratório fica aqui dentro. O RG serve como uma pasta, onde você organizar seus arquivos. E na Azure, é onde fica o seus recursos, você deletando o RG você deleta tudo que tem dentro. 

# ETAPA 2 - Utilizar domínio

Compre ou utilize o domínio público (exemplo: \`seudominio.com.br\`) no registrador da sua preferência.

# ETAPA 3 - Criar zona DNS pública no Azure

No Azure, crie uma **DNS Zone pública**:

- Nome: \`seudominio.com.br\`
- Tipo: Público

Depois de criada:

- Copie os 4 name servers da zona
- No registrador, substitua os DNS atuais pelos name servers do Azure

Quando a delegação propagar, o Azure DNS vira autoridade oficial do domínio e assim poderemos seguir com as alterações tudo dentro de um portal.

# ETAPA 4 - Criar VNet e subnets

Crie a VNet:

- Nome: \`vnet-app-baseline\`
- Address space: \`10.0.0.0/16\`
- Região: mesma do Resource Group

Crie as subnets:

\`\`\`
snet-appGateway       10.0.1.0/24
snet-appService       10.0.0.0/24
snet-privateEndpoints 10.0.2.0/27
\`\`\`

Configuração obrigatória:

- Em \`snet-appService\`, habilite delegation para \`Microsoft.Web/serverFarms\`
- A subnet do Application Gateway deve ser dedicada (não compartilhe com PE, VM ou NIC)

Nota prática importante: \`GatewaySubnet\` é reservada para \`VPN Gateway\` e \`ExpressRoute\`. Para \`Application Gateway\`, crie uma subnet dedicada com outro nome, por exemplo \`SubnetAppGateway\`, \`agw-subnet\` ou \`snet-appgw\`. O nome não é obrigatório, mas a exclusividade da subnet é obrigatória.

## NSG (Network Security Group) obrigatório na subnet do Application Gateway

Conforme a documentação da Microsoft, a subnet do Application Gateway v2 exige NSG com regras específicas. Sem essas regras, o gateway não funciona.

Crie um NSG e associe a \`snet-appGateway\` com as seguintes regras:

**Inbound:**

| Prioridade | Nome | Source | Destination | Porta | Protocolo | Ação |
|---|---|---|---|---|---|---|
| 100 | Allow-HTTP | Any | Subnet prefix | 80 | TCP | Allow |
| 110 | Allow-HTTPS | Any | Subnet prefix | 443 | TCP | Allow |
| 120 | Allow-GatewayManager | GatewayManager | Any | 65200-65535 | TCP | Allow |
| 130 | Allow-AzureLoadBalancer | AzureLoadBalancer | Any | Any | Any | Allow |

**Outbound:**

| Prioridade | Nome | Source | Destination | Porta | Protocolo | Ação |
|---|---|---|---|---|---|---|
| 100 | Allow-Internet | Any | Internet | Any | Any | Allow |

A regra \`GatewayManager\` nas portas \`65200-65535\` é obrigatória para o control plane do Application Gateway v2. Sem ela, o backend health não funciona.

## DDoS Protection

A Microsoft recomenda habilitar DDoS Protection na VNet que contém a subnet do Application Gateway com IP público. No portal:

- VNet -> DDoS Protection -> Enable


# ETAPA 5 - Criar Private DNS Zones

Crie estas zonas privadas:

- \`privatelink.azurewebsites.net\`
- \`privatelink.database.windows.net\`
- \`privatelink.vaultcore.azure.net\`
- \`privatelink.blob.core.windows.net\`

Depois, crie o **Virtual Network Link** de cada zona para \`vnet-app-baseline\`.

Sem esse passo, Private Endpoint costuma quebrar por falha de resolução DNS.


# ETAPA 6 - Criar Key Vault (privado)

Crie o Key Vault:

- Nome: \`kv-app-baseline\`
- Public network access: **Disabled**
- Authorization model: **Azure RBAC**

Depois crie o Private Endpoint do Key Vault:

- Subnet: \`snet-privateEndpoints\`
- Private DNS Zone: \`privatelink.vaultcore.azure.net\`


# ETAPA 7 - Criar Storage Account (privado)

Crie a Storage Account:

- Nome único (exemplo): \`stappbaseline123\`
- Redundância: \`ZRS\`
- Public network access: **Disabled**

Crie o Private Endpoint para Blob:

- Subresource: \`blob\`
- Subnet: \`snet-privateEndpoints\`
- Private DNS Zone: \`privatelink.blob.core.windows.net\`


# ETAPA 8 - Criar Azure SQL (privado)

Ordem recomendada no portal para evitar retrabalho:

1. Criar o SQL Server
2. Criar o SQL Database
3. Criar o Private Endpoint para o SQL

Crie o SQL Server:

- Public network access: **Disabled**

Crie o banco de dados no servidor criado:

- Camada: \`General Purpose\`
- Zone redundancy: habilitado

Depois crie o Private Endpoint do SQL:

- Subnet: \`snet-privateEndpoints\`
- Private DNS Zone: \`privatelink.database.windows.net\`


# ETAPA 9 - Criar App Service Plan

Configuração recomendada para baseline:

- Tier: \`Premium v3/v4\`
- Zone redundancy: habilitado
- Instance count inicial: \`3\`

A Microsoft recomenda no mínimo 3 instâncias para o App Service Plan com zone redundancy. Se uma zona falhar, as outras 2 mantêm a disponibilidade sem esperar o startup de novas instâncias.


# ETAPA 10 - Criar Web App

Crie o Web App (Node, .NET ou container) usando o plano da etapa anterior.

Depois configure:

- Networking -> VNet Integration -> \`snet-appService\`
- Public Network Access -> **Disabled**
- Health Check -> \`/\` (ou endpoint de health da sua app)

O Health Check permite que o App Service detecte instâncias com problema e redirecione tráfego automaticamente para instâncias saudáveis. Requer no mínimo 2 instâncias no plano.


# ETAPA 11 - Criar Private Endpoint do Web App

No Web App:

- Networking -> Private Endpoint -> Add
- Subnet: \`snet-privateEndpoints\`
- Subresource: \`sites\`
- Private DNS Zone: \`privatelink.azurewebsites.net\`

Resultado esperado: o App Service fica acessível apenas internamente.


# ETAPA 12 - Criar Application Gateway + WAF

Primeiro, crie um Public IP:

- SKU: \`Standard\`
- Zone-redundant

Depois crie o Application Gateway:

- SKU: \`WAF_v2\`
- Autoscaling: habilitado
- Min instances: \`3\` (Microsoft recomenda no mínimo 3 para evitar downtime de 6-7 min no startup de nova instância)
- Subnet: \`snet-appGateway\` (ou a subnet dedicada definida para o gateway)

Depois de criar o Application Gateway, crie uma **WAF Policy**:

- Pesquise \`Web Application Firewall policies\` -> Create
- Mode: **Prevention**
- Ruleset: \`Microsoft Default Rule Set (DRS) 2.1\` ou mais recente
- Associe ao Application Gateway criado

Sem a WAF Policy em Prevention, o WAF não bloqueia ataques como SQL injection e XSS.

Configuração inicial (HTTP temporário para validar fluxo):

1. Listener HTTP:

- Protocolo: \`HTTP\`
- Porta: \`80\`

2. Backend Pool:

- Target: FQDN
- Valor: \`nomedoapp.azurewebsites.net\`

3. HTTP Settings:

- Protocolo: \`HTTPS\`
- Porta: \`443\`
- Override host name: \`nomedoapp.azurewebsites.net\`
- SNI: habilitado

4. Health Probe customizada:

- Host: \`nomedoapp.azurewebsites.net\`
- Path: \`/\` (ou endpoint de health da sua app)

5. Rule:

- Associe Listener -> Backend Pool -> HTTP Settings

Se backend ficar \`Unhealthy\`, o problema costuma ser DNS privado não vinculado corretamente ou host/probe incorretos.


# ETAPA 13 - Criar registro DNS público

Na zona DNS pública \`seudominio.com.br\`, crie:

- Tipo: \`A\`
- Nome: \`app\`
- IP: IP público do Application Gateway

Resultado:

\`app.seudominio.com.br\` -> Application Gateway


# ETAPA 14 - Configurar HTTPS real com certificado

Emita certificado para:

\`app.seudominio.com.br\`

Pode ser Let's Encrypt, ZeroSSL ou certificado comercial.

## Tutorial rápido - certificado gratuito com ZeroSSL

Para este lab, use o fluxo por validação DNS no ZeroSSL.

1. Acesse o ZeroSSL e inicie emissão para \`app.seudominio.com.br\`.

2. Escolha validação por \`CNAME\`.

3. O ZeroSSL vai fornecer um registro parecido com este:

\`\`\`
Name
_xxxx.app.seudominio.com.br

Target
xxxx.comodoca.com
\`\`\`

4. Na zona \`seudominio.com.br\` no Azure DNS, crie o \`CNAME\` com os valores informados.

5. Aguarde propagação e valide:

\`\`\`bash
nslookup -type=CNAME _xxxx.app.seudominio.com.br
\`\`\`

6. Conclua a validação no portal do ZeroSSL e baixe os arquivos:

\`\`\`
certificate.crt
ca_bundle.crt
private.key
\`\`\`

7. Converta para \`PFX\`:

\`\`\`bash
openssl pkcs12 -export \\
  -out app-seudominio.pfx \\
  -inkey private.key \\
  -in certificate.crt \\
  -certfile ca_bundle.crt
\`\`\`

Importe o certificado no Key Vault.

## Passo obrigatório - criar User Assigned Managed Identity

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/labpe/02.png)

[Referência oficial da Microsoft](https://learn.microsoft.com/azure/application-gateway/key-vault-certs)

Conforme a documentação, a integração Application Gateway + Key Vault exige 3 passos:

1. Criar uma User Assigned Managed Identity
2. Delegar acesso dessa identidade ao Key Vault
3. Associar a identidade e o certificado no Application Gateway via CLI ou PowerShell

Importante: com Azure RBAC no Key Vault (como configuramos na ETAPA 6), o vínculo da identidade e do certificado no Application Gateway não é suportado pelo portal. Use PowerShell ou CLI.

### Passo 1 - Criar a identidade

No portal:

- Pesquise \`Managed Identities\` -> Create
- Nome: \`mi-agw-kv-reader\`
- Resource Group: \`rg-app-baseline-lab\`
- Região: mesma do lab

### Passo 2 - Conceder permissão no Key Vault

No Key Vault -> IAM:

- Role: \`Key Vault Secrets User\`
- Principal: \`mi-agw-kv-reader\`

Nota: como o Key Vault tem Private Endpoint habilitado (ETAPA 6), o Application Gateway já consegue acessar via IP privado desde que a zona \`privatelink.vaultcore.azure.net\` esteja linkada a VNet (ETAPA 5).

### Passo 3 - Associar identidade e certificado no Application Gateway (PowerShell)

\`\`\`powershell
# Obter o Application Gateway
$appgw = Get-AzApplicationGateway -Name agw-app-baseline -ResourceGroupName rg-app-baseline-lab

# Associar a User Assigned Managed Identity
Set-AzApplicationGatewayIdentity -ApplicationGateway $appgw \\
  -UserAssignedIdentityId "/subscriptions/<subscription-id>/resourceGroups/rg-app-baseline-lab/providers/Microsoft.ManagedIdentity/userAssignedIdentities/mi-agw-kv-reader"

# Obter o secret ID do certificado no Key Vault (sem versão para auto-rotação)
$secret = Get-AzKeyVaultSecret -VaultName "kv-app-baseline" -Name "<nome-do-certificado>"
$secretId = $secret.Id.Replace($secret.Version, "")

# Adicionar o certificado SSL ao Application Gateway
Add-AzApplicationGatewaySslCertificate -KeyVaultSecretId $secretId -ApplicationGateway $appgw -Name $secret.Name

# Aplicar as alterações
Set-AzApplicationGateway -ApplicationGateway $appgw
\`\`\`

### Passo 4 - Criar Listener HTTPS no portal

Agora sim, no portal:

- Application Gateway -> Listeners -> Add Listener
- Protocol: HTTPS
- Porta: 443
- Host name: \`app.seudominio.com.br\`
- Certificate: selecione o certificado adicionado no passo anterior
- Save

### Passo 5 - Redirect HTTP para HTTPS

No Application Gateway, crie uma regra de redirecionamento:

- Application Gateway -> Rules -> selecione a regra do Listener HTTP (porta 80)
- Backend targets: troque para **Redirection**
- Target type: \`Listener\`
- Target listener: o listener HTTPS criado no passo anterior
- Redirect type: \`Permanent (301)\`

Isso garante que todo acesso HTTP seja redirecionado automaticamente para HTTPS.


# ETAPA 15 - Testes finais (checklist de aceite)

Teste 1:

\`\`\`
https://app.seudominio.com.br
\`\`\`

Esperado: carregar normalmente via Application Gateway.

Teste 2:

\`\`\`
https://nomedoapp.azurewebsites.net
\`\`\`

Esperado: falhar (acesso público do App Service desabilitado).

Teste 3:

\`\`\`
nslookup app.seudominio.com.br
\`\`\`

Esperado: retornar o IP público do Application Gateway.

Se os 3 testes passarem, sua baseline esta pronta com:

- DNS público no Azure
- WAF na borda
- Private Link no backend
- Isolamento de rede
- TLS ponta a ponta


# Troubleshooting rápido

## Backend \`Unhealthy\` no Application Gateway

- Verifique se as Private DNS Zones estão linkadas a VNet
- Confirme host da probe e path de health
- Valide se o Web App responde 200 no endpoint usado na probe

## Erro de certificado no listener HTTPS

- Confirme Managed Identity ativa no Application Gateway
- Confirme role \`Key Vault Secrets User\` no Key Vault
- Aguarde propagação de permissões RBAC (pode levar alguns minutos)

## Erro de host header

- Confirme que o domínio público foi adicionado no App Service (Custom Domains), quando exigido pelo seu fluxo


# Exportar como Infrastructure as Code (IaC)

Para quem não conhece, o Azure permite exportar todos os recursos de um Resource Group como código. Você pode gerar templates em ARM (JSON), Bicep ou Terraform direto pelo portal ou CLI.

No portal: Resource Group -> Export template.

Isso é útil para versionar a infraestrutura, replicar o ambiente em outra subscription ou usar como base para automação em pipelines de CI/CD.

Neste laboratório, exportei o Resource Group inteiro no formato Terraform. O arquivo ficou com mais de 2 mil linhas, então não incluí aqui no artigo. Publiquei no meu repositório do GitHub como referência:


[**Github**](https://github.com/orafaelferreiraa/tf-app-gateway-baseline-private-endpoint)
Importante: esse export não foi testado como implementação real com \`terraform apply\`. O Azure gera o código a partir do estado atual dos recursos, mas nem sempre o resultado é aplicável sem ajustes. Use como ponto de partida e referência, não como código pronto para produção.


# Visualização da arquitetura no portal

O Azure oferece uma funcionalidade de visualização gráfica direto pelo Resource Group. No portal, acesse Resource Group -> Resource visualizer. Lá você consegue ver todos os recursos e suas conexões em um diagrama interativo, e exportar a imagem.

Este é o resultado final do nosso laboratório:

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/labpe/03.png)


# Conclusão

Esse roteiro evita o ciclo comum de "cria recurso, testa, quebra DNS, volta tudo".

Seguindo essa ordem, você implementa a arquitetura baseline completa de forma previsível: primeiro identidade e rede, depois Private Link, em seguida borda WAF e por fim DNS/TLS público com validação final.`,
  date: "2026-03-08",
  category: "Artigos",
  readTime: "22 min de leitura",
};