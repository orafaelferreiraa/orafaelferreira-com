// ...existing code...
import { Article } from '../types';

export const article: Article = {
  slug: "artigo-terraform-infra-evolutiva",
  title: "Atualização sobre a evolução do site: Temos mais Terraform, DNS-as-Code e multi-subscription",
  excerpt: "Como a infraestrutura do meu blog saiu da migração inicial para um desenho mais maduro: subscriptions separadas, DNS como código, azapi, preservação de TXT e um fluxo mais previsível para operar o site.",
  content: `![Imagem 01 - Capa cyberpunk](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/site-news/01.png)

# Visão Geral

No [artigo anterior](https://www.orafaelferreira.com/artigos/artigo-terraform-infra-cicd), eu mostrei a base da construção do blog com Terraform, Azure Static Web Apps e GitHub Actions. Esse texto é o passo seguinte: o que eu evoluí depois que a primeira versão já estava no ar. A ideia aqui não é repetir o conteúdo anterior, é mostrar como a infraestrutura evoluiu depois dessa decisão.
A maior mudança dessa fase foi trazer o meu domínio **orafaelferreira.com** para dentro do Azure. Ele estava registrado e com o DNS na **GoDaddy**, e eu migrei a zona para o **Azure DNS**, assim me possibilitando gerenciar o domínio como código, junto com o resto da infraestrutura.

Com o domínio dentro do Azure, eu passo a:

- Centralização dos recursos no provider Azure
- controlar a zona DNS via Terraform, no mesmo fluxo de IaC do site
- reaproveitar o mesmo domínio em outros projetos e subdomínios
- versionar e auditar cada mudança de registro como faço com qualquer outro recurso

Algumas features:

- Terraform como infraestrutura como código (IaC)
- domínio orafaelferreira.com migrado da GoDaddy para o Azure DNS
- subscriptions separadas para site e DNS
- DNS-as-Code com CNAME, A e TXT gerenciados no próprio Terraform
- azapi para cobrir o que o provider não resolve e manter tudo em IaC

## 1. Tirando o domínio da GoDaddy

Antes, o orafaelferreira.com vivia inteiro na GoDaddy: registro e DNS no mesmo lugar, tudo editado na mão pelo painel. Funcionava, mas me prendia a cliques e deixava o DNS fora do meu fluxo de IaC.

![Imagem 00 - Migração GoDaddy para Azure DNS com Terraform](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/site-news/00.png)

A migração foi direta: criei a zona no Azure DNS, recriei os registros que já existiam e apontei os name servers do domínio na GoDaddy para os name servers do Azure. A partir daí, a autoridade do DNS passou a ser o Azure.
Isso me abre espaço para reusar o orafaelferreira.com em outros laboratórios e projetos sem repetir configuração manual.

## 2. Duas subscriptions

Aqui vou mostrar como trabalhar com duas subscriptions usando aliases de provider no Terraform. Em vez de depender de um único contexto, eu passo a indicar explicitamente onde cada recurso vive. Coisas que acontecem no dia a dia real, com ambientes de produção, que decidi espelhar e colocar em prática aqui.

\`\`\`terraform
provider "azurerm" {
  features {}
}

provider "azurerm" {
  alias           = "site"
  features        {}
  subscription_id = var.site_subscription_id != "" ? var.site_subscription_id : null
}

provider "azurerm" {
  alias           = "dns"
  features        {}
  subscription_id = var.dns_subscription_id != "" ? var.dns_subscription_id : null
}

provider "azapi" {
  alias           = "dns"
  subscription_id = var.dns_subscription_id != "" ? var.dns_subscription_id : null
}
\`\`\`

Visualmente, a arquitetura ficou assim:

![Imagem 03 - Arquitetura multi-subscription](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/site-news/03.png)



## 3. DNS com IAC

![Imagem 02 - Azure + DNS + Terraform](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/site-news/02.png)

Essa foi a parte que mais evoluiu em relação ao artigo anterior. Antes, a ideia era basicamente “subir o SWA e validar o domínio”. Agora o DNS também virou parte do código declarativo.

\`\`\`terraform
data "azurerm_dns_zone" "this" {
  provider            = azurerm.dns
  name                = "orafaelferreira.com"
  resource_group_name = data.azurerm_resource_group.dns_rg.name
}

resource "azurerm_dns_cname_record" "www" {
  provider            = azurerm.dns
  name                = "www"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  record              = azurerm_static_web_app.this.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "www" {
  provider          = azurerm.site
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "www.orafaelferreira.com"
  validation_type   = "cname-delegation"
}
\`\`\`

- o www aponta diretamente para o host do SWA
- a validação passa a refletir o estado real do DNS

### O que é Apex?

O **apex** (ou naked domain) é o domínio raiz, sem nenhum prefixo. No caso do meu site, "orafaelferreira.com" é o apex, enquanto "www.orafaelferreira.com" é um subdomínio. O apex é importante porque é a forma "limpa" e mais comum de acessar um site: quando alguém digita só "orafaelferreira.com", está acessando o apex.

O apex também ganhou tratamento próprio. Em vez de esconder isso atrás de configuração manual, eu explicitei o caminho do registro A e a validação por TXT.

\`\`\`terraform
locals {
  apex_txt_values = distinct(concat(
    var.apex_base_txt_records,
    [azurerm_static_web_app_custom_domain.apex.validation_token]
  ))
}

resource "azurerm_dns_a_record" "apex" {
  provider            = azurerm.dns
  name                = "@"
  zone_name           = data.azurerm_dns_zone.this.name
  resource_group_name = data.azurerm_dns_zone.this.resource_group_name
  ttl                 = 3600
  target_resource_id  = azurerm_static_web_app.this.id
}
\`\`\`

O detalhe importante está no distinct(concat(...)). Ele preserva os TXT base do domínio, como SPF, e adiciona o token de validação do Azure sem sobrescrever o que já existe.

Esse tipo de cuidado evita uma classe de erro chata: mudar o domínio para validar o SWA e quebrar outros usos do TXT sem perceber.

## 4. Por que usei azapi

Nem tudo o que eu precisava encaixou bem no provider padrão do AzureRM. No caso do TXT do apex, eu usei azapi para garantir o controle do record set.

\`\`\`terraform
resource "azapi_resource" "apex_validation_txt" {
  provider  = azapi.dns
  type      = "Microsoft.Network/dnsZones/TXT@2018-05-01"
  name      = "@"
  parent_id = data.azurerm_dns_zone.this.id

  body = {
    properties = {
      TTL = 3600
      TXTRecords = [for value in local.apex_txt_values : {
        value = [value]
      }]
    }
  }
}
\`\`\`

Esse é um bom exemplo de onde o Terraform brilha: você não precisa forçar a solução para caber numa única ferramenta. Usa a melhor peça disponível para cada responsabilidade.

## 5. O site continua simples, mas a operação ficou melhor

Mesmo com essa evolução, eu não quis transformar o blog numa plataforma altamente complexa.

O SWA continua sendo a base do hosting, e isso me ajuda porque ele entrega o suficiente sem exigir engenharia excessiva para um site pessoal.

## 6. Quando esse nível de estrutura faz sentido

Nem todo projeto precisa começar assim. Se você está montando um site simples e isolado, talvez uma subscription só e um conjunto mínimo de recursos já resolvam. Mas quando o projeto vira laboratório vivo, quando você quer experimentar, evoluir e manter tudo auditável, esse tipo de arquitetura começa a fazer sentido.

No meu caso, o blog é também um espaço para testar ideias que depois podem virar conteúdo, palestra ou prática de trabalho. Então vale a pena investir tempo e esforço nessa base.

## Conclusão

Tirar o orafaelferreira.com da GoDaddy e trazer o domínio para o Azure foi o que destravou tudo: o DNS deixou de ser um painel manual e isolado e passou a fazer parte do mesmo código que descreve o site para criar os registros DNS. Com isso, a infraestrutura saiu de uma migração funcional para um desenho em que o site e o domínio ficam melhor organizados. De quebra, o domínio fica pronto para ser reaproveitado em outros projetos, sempre via IaC. Isso me ajuda no meu vibe coding, compartilhando o troubleshooting com a IA.

`,
  date: "2026-06-14",
  category: "Artigos",
  readTime: "6 min de leitura"
};