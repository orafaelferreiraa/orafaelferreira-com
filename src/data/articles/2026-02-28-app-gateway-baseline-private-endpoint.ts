import { Article } from './types';

export const article: Article = {
  slug: "app-gateway-baseline-private-endpoint",
  title: " Arquitetura de Referência: Application Gateway, Private Endpoint e App Service",
  excerpt: "Um passo a passo real para construir a arquitetura baseline do App Service com Application Gateway e Private Endpoint. Inclui certificados gratuitos, Managed Identity, DNS e correções importantes da documentação oficial.",
  content: `# Introdução

![](xxxx)

Neste artigo, vou montar do zero uma arquitetura baseline de **App Service com Application Gateway e Private Endpoint**, seguindo a referência da Microsoft e, principalmente, preenchendo lacunas que costumam confundir na prática.

Referência oficial:

https://learn.microsoft.com/pt-br/azure/architecture/web-apps/app-service/architectures/baseline-zone-redundant

Arquitetura final (visão simples):

Internet  
↓  
Application Gateway (WAF)  
↓  
Private Endpoint  
↓  
App Service

Ou, em uma linha: **User → App Gateway → Private Endpoint → App Service**.

## O que vamos construir

- Virtual Network segmentada
- Application Gateway WAF v2
- App Service isolado com Private Endpoint
- Key Vault com certificado
- Managed Identity
- Certificado gratuito com ZeroSSL
- DNS público
- TLS end-to-end

---

# 1. Criando a Virtual Network

Comece criando uma VNet com o endereço abaixo:

\`\`\`
10.0.0.0/16
\`\`\`

Depois, crie as subnets:

\`\`\`
AppGatewaySubnet        10.0.1.0/24
AppServiceSubnet        10.0.0.0/24
PrivateEndpointsSubnet  10.0.2.0/27
\`\`\`

Ponto importante: o **Application Gateway precisa de subnet dedicada**. Essa subnet não pode ser compartilhada com:

- Private Endpoints
- NICs
- VMs
- Integração do App Service

### Erro comum da documentação

Em alguns exemplos você verá a subnet chamada **GatewaySubnet**. Evite isso para esse cenário: \`GatewaySubnet\` é reservada para **VPN Gateway**.  
Para Application Gateway, use outro nome (como \`AppGatewaySubnet\`), desde que seja dedicada.

---

# 2. Criando o App Service

Crie o Web App normalmente (runtime Python ou .NET, plano B1 ou superior).  
Em seguida, vá em **Networking → Private Endpoint → Add** e selecione \`PrivateEndpointsSubnet\`.

Ao fazer isso, o Azure cria o vínculo com:

\`\`\`
privatelink.azurewebsites.net
\`\`\`

Também é feito o registro no DNS privado automaticamente (quando a integração está correta).

---

# 3. Criando o Application Gateway

Na criação do Application Gateway, use:

- **Tier**: WAF v2
- **Zones**: 1, 2 e 3
- **Subnet**: \`AppGatewaySubnet\`
- **Frontend**: Public IP Standard

Essa combinação já te coloca em uma base próxima de produção para alta disponibilidade.

---

# 4. Configurando o Backend Pool

No **Backend Pool**, escolha:

- **Target type**: App Services
- Selecione o Web App criado

Sem segredo aqui, mas vale conferir se escolheu o app correto no subscription/resource group certo.

---

# 5. Configurando o Backend Settings

Em **Backend Settings**, configure:

- Protocol: HTTPS
- Port: 443
- Override hostname: No

Esse ponto costuma gerar dúvida. Se o domínio já está corretamente registrado no App Service e no listener, em geral você não precisa de override.

---

# 6. Criando o Listener HTTP

Crie um listener inicial para validação:

- Protocol: HTTP
- Port: 80
- Frontend: Public IP

Depois crie a regra ligando **Listener HTTP → Backend Pool**.

---

# 7. Testando pelo IP público

Acesse:

\`\`\`
http://IP-DO-APP-GATEWAY
\`\`\`

Se você visualizar:

\`\`\`
Your web app is running and waiting for your content
\`\`\`

o roteamento base está funcionando.

---

# 8. Gerando certificado gratuito com ZeroSSL

Acesse https://zerossl.com e gere um certificado via **CNAME validation**.

Você receberá algo como:

\`\`\`
Name:
_xxxxx.orafaelferreira.xyz

Target:
xxxxx.comodoca.com
\`\`\`

Crie esse CNAME no seu provedor DNS (ex.: GoDaddy).  
Depois baixe os arquivos:

\`\`\`
certificate.crt
ca_bundle.crt
private.key
\`\`\`

---

# 9. Convertendo para PFX

O Application Gateway trabalha com PFX. Converta com OpenSSL:

\`\`\`bash
openssl pkcs12 -export \\
 -out certificate.pfx \\
 -inkey private.key \\
 -in certificate.crt \\
 -certfile ca_bundle.crt
\`\`\`

Defina uma senha, porque ela será usada na importação.

---

# 10. Importando certificado no Key Vault

No Key Vault, vá em **Certificates → Import**, selecione \`certificate.pfx\` e informe a senha criada no passo anterior.

---

# 11. Ativando Managed Identity no Application Gateway

Aqui está um ponto que costuma passar batido: para ler segredo/certificado no Key Vault, o Application Gateway precisa de identidade.

No recurso do gateway:

- **Identity**
- **System Assigned**: On
- Save

---

# 12. Concedendo permissão no Key Vault

No Key Vault, em **Access Control (IAM)**, adicione a role:

\`\`\`
Key Vault Secrets User
\`\`\`

Selecione como principal o **Application Gateway** e salve.

---

# 13. Associando certificado via CLI

Na prática, o portal pode falhar em alguns cenários com Key Vault RBAC. A forma mais confiável é via CLI:

\`\`\`bash
az network application-gateway ssl-cert create \\
 --resource-group rg-app-baseline \\
 --gateway-name ap-app-baseline \\
 --name cert-kv \\
 --key-vault-secret-id https://kv-app-baseline.vault.azure.net/secrets/cert
\`\`\`

Depois disso, o certificado já aparece para seleção no listener HTTPS.

---

# 14. Criando o Listener HTTPS

No Application Gateway, vá em **Listeners → Add** e configure:

- Protocol: HTTPS
- Port: 443
- Certificado: o importado do Key Vault

Teste com:

\`\`\`
https://IP-DO-GATEWAY
\`\`\`

É normal haver aviso no navegador nesse momento, porque o certificado foi emitido para o domínio e não para o IP.

---

# 15. Configurando DNS público

No seu provedor DNS (GoDaddy, por exemplo), crie um registro A:

\`\`\`
A record

Host: @
Points to: IP-DO-GATEWAY
\`\`\`

Valide com:

\`\`\`
nslookup orafaelferreira.xyz
\`\`\`

---

# 16. Registrando domínio no App Service

O App Service valida Host Header. Se o domínio não estiver cadastrado nele, você pode receber erro mesmo com gateway e DNS corretos.

No App Service, vá em **Custom Domains** e adicione:

\`\`\`
orafaelferreira.xyz
\`\`\`

Se necessário, conclua a validação via registro TXT.

---

# 17. Ajustando Listener HTTPS com domínio

Edite o listener HTTPS e informe o hostname:

\`\`\`
orafaelferreira.xyz
\`\`\`

Confirme o certificado e salve.  
Agora o teste principal é:

\`\`\`
https://orafaelferreira.xyz
\`\`\`

---

# 18. Fluxo final da requisição

Com tudo configurado, o caminho fica assim:

Browser  
↓  
DNS resolve para Application Gateway  
↓  
WAF inspeciona o tráfego  
↓  
TLS termination no gateway  
↓  
Nova sessão TLS para o backend  
↓  
Private Endpoint  
↓  
App Service

---

# Pontos da documentação que merecem atenção

## 1) Uso de GatewaySubnet

Pode induzir erro para quem está começando. Reforçando: \`GatewaySubnet\` é para VPN Gateway, não para Application Gateway.

## 2) Key Vault com RBAC

Em alguns cenários, o portal não faz o vínculo como esperado. Ter o caminho via CLI evita perder tempo em troubleshooting.

## 3) Managed Identity

A documentação cita identidade, mas nem sempre detalha o impacto prático. Sem identidade, o gateway não consegue ler o certificado no Key Vault.

## 4) Health Probe com 404

A probe padrão usa \`/\`. Se sua aplicação não responder 200 nesse path, o backend fica unhealthy. Ajuste a probe para um endpoint de saúde quando necessário.

## 5) Host Header no App Service

Domínio não registrado no App Service = possível falha de roteamento/validação, mesmo que o restante esteja aparentemente correto.

---

# Conclusão

Essa arquitetura entrega uma base sólida para workloads web no Azure, com:

- WAF
- TLS end-to-end
- Private Endpoint
- DNS público
- Certificado gratuito
- Key Vault
- Managed Identity

Mais do que “subir recurso”, esse tipo de laboratório te força a entender o que realmente importa em cloud: **rede, DNS, TLS, identidade e fluxo HTTP**.  
É isso que transforma prática em experiência de engenharia.`,
  date: "2026-02-22",
  category: "Artigos",
  readTime: "18 min de leitura",
};