import type { Article } from '../types';

export const article: Article = {
  slug: "terraform-o-que-mudou-desde-a-associate",
  title: "Terraform Associate: 14 meses de mudanças que a prova 003 não cobriu",
  excerpt:
    "Certifiquei na Terraform Associate 003 em julho de 2025. De lá para cá: quatro releases do Core, azurerm 5.0, Stacks em GA, tfpolicy e o exame 004.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/terraform-o-que-mudou-desde-a-associate/capa.png",
  content: `

![Linha do tempo do Terraform entre as versões 1.12 e 1.16, marcando o ponto da certificação Associate 003](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/terraform-o-que-mudou-desde-a-associate/capa.png)

Passei na **HashiCorp Certified: Terraform Associate (003)** em **26/07/2025**. Escrevi na época sobre a estrutura da prova e a preparação em [Certificação HashiCorp Terraform Associate 003](/artigos/terraform-associate-artigo). Este artigo é a continuação: o que mudou no Terraform **depois** disso.

E mudou muita coisa. Em pouco mais de quatorze meses o Core saltou de \`v1.12\` para \`v1.16\`, o provider \`azurerm\` teve uma major version com quebra real, o Stacks saiu de beta, a HashiCorp virou parte da IBM, apareceu uma linguagem nova de governança — e o próprio exame que eu fiz foi aposentado.

Nada disso invalida o certificado, que vale até **26/07/2027**. Mas é tudo conteúdo novo para quem quer continuar afiado ou está pensando em recertificar no 004.

| Item | Situação |
|---|---|
| Exame feito | Associate 003 |
| Certificação emitida | 26/07/2025 |
| Válida até | 26/07/2027 |
| Core na data da prova | ~v1.12 |
| Core hoje | v1.16.3 |
| Releases do Core desde então | 4 (1.13, 1.14, 1.15, 1.16) |

## O Core, release a release

### v1.13 — 20/08/2025

- O comando \`terraform stacks\` entra no CLI principal.
- A **RPC interface** para integradores atinge GA.
- Correções de **resource identity** perdida em módulos aninhados.
- \`init\` ficou mais tolerante com constraints de provider.

**Traduzindo — RPC interface.** Isso é para quem **constrói ferramenta em cima do Terraform** (Atlantis, Spacelift, Terragrunt, automação própria), não para quem escreve \`.tf\`. Até aqui, essas ferramentas rodavam o binário \`terraform\` como subprocesso e liam a saída de texto ou JSON do stdout para saber o que tinha acontecido — um screen scraping de CLI, frágil porque essa saída é pensada para humano ler e muda de formato entre versões, quebrando o parser sem aviso. A RPC interface é o Terraform expondo um contrato programático estável no lugar disso. "Atingir GA" quer dizer que esse contrato já é confiável o bastante para essas plataformas dependerem dele em produção.

**Traduzindo — resource identity.** É um identificador que o provider usa para reconhecer "esse recurso na nuvem é o mesmo que este bloco no meu código", separado do ID normal que você vê. Na AWS, por exemplo, o formato do ARN pode mudar e a identity continua igual. Antes da 1.13, módulos aninhados às vezes perdiam essa referência no meio do caminho e o Terraform concluía que o recurso tinha sumido — e tentava recriar algo que já existia.

### v1.14 — 19/11/2025

- **List Resources**: arquivos \`.tfquery.hcl\` e o comando \`terraform query\`, para descobrir e filtrar recursos que existem fora do código. É a base para import em lote.
- **Actions block**: a primeira operação fora do CRUD tradicional, via lifecycle hooks ou \`-invoke\`.
- \`import\` passa a herdar variáveis de variable sets.

**Traduzindo — \`terraform query\`.** O problema que isso resolve é conhecido: para importar um recurso, seja com \`terraform import\` ou com um bloco \`import\`, você precisa **já saber o ID exato** dele na nuvem. Se você tem uma centena de bancos órfãos num levantamento de custo, isso significa ir um por um. O \`terraform query\` inverte a lógica — você escreve um arquivo perguntando "existe algo assim aí fora?" e o Terraform lista o que encontrar, para você gerar os imports em lote:

\`\`\`hcl
# arquivo: databases.tfquery.hcl
list "azurerm_mssql_database" "encontrados" {
  provider = azurerm

  config {
    # filtro de busca, específico do provider
    resource_group_name = "rg-plataforma-prod"
  }
}

# roda com: terraform query
\`\`\`

**Traduzindo — Actions block.** Até aqui, o Terraform só sabia fazer quatro coisas com um recurso: criar, ler, atualizar e destruir. Mas nem toda operação de infraestrutura é CRUD — invalidar um cache de CDN depois de um deploy, ou disparar uma função de migração, não é "criar um recurso", é uma **ação pontual**. A gambiarra histórica era \`null_resource\` com \`local-exec\`. O Actions block torna isso nativo do provider:

\`\`\`hcl
action "aws_lambda_invoke" "run_migration" {
  config {
    function_name = aws_lambda_function.migrate.function_name
  }
}

# dispara automaticamente quando o recurso muda
resource "aws_db_instance" "main" {
  # ...
  lifecycle {
    action_trigger {
      events  = [after_update]
      actions = [action.aws_lambda_invoke.run_migration]
    }
  }
}
\`\`\`

### v1.15 — a linha estável de 2026

- **Dynamic module sources**: variáveis dentro de \`source\` e \`version\` de um bloco \`module\`, com o atributo \`const\`.
- **Deprecation** de variables e outputs via \`deprecated =\`, encadeável entre módulos.
- Função \`convert()\` para conversão explícita de tipo, e type constraints em \`output\`.
- \`validate\` passa a validar o bloco \`backend\`. Build nativo para Windows ARM64.

**Traduzindo — dynamic module sources.** Antes da 1.15, o \`source\` e a \`version\` de um bloco \`module\` tinham que ser texto fixo — não dava para usar variável ali, porque o Terraform precisa resolver de onde vem o módulo **antes** de sequer processar as variáveis dele. Agora dá, o que evita duplicar o mesmo módulo só para trocar a origem por ambiente:

\`\`\`hcl
module "network" {
  source  = var.usar_espelho_privado ? "git::\${var.mirror_url}" : "app.terraform.io/acme/network/azurerm"
  version = var.module_version
}
\`\`\`

**Traduzindo — deprecation de variables e outputs.** Para quem mantém módulos reutilizáveis, agora dá para avisar quem usa uma \`variable\` ou \`output\` antiga sem quebrar o \`plan\` dessa pessoa. Sai um **warning**, não um erro, e o aviso atravessa vários níveis de módulo até chegar em quem precisa vê-lo:

\`\`\`hcl
variable "instance_size" {
  type       = string
  deprecated = "use 'sku_name' — será removido na v3.0 do módulo"
}
\`\`\`

### v1.16 — 26/08/2026, agora GA

Quando comecei este levantamento a 1.16 ainda estava em beta. Ela saiu em **26/08/2026**, com a 1.16.1 em 02/09 e a **1.16.3** como versão atual.

- \`terraform_data\` ganha um bloco **\`store\`** para guardar valores ephemeral ou sensitive entre \`plan\` e \`apply\`.
- \`graph -format\` passa a incluir saída **Mermaid**.
- \`workspace list -json\` e \`state show -json\`.
- Blocos \`import\` dentro de módulos.
- \`lifecycle { destroy = false }\`.
- Builds para Linux s390x.

**Traduzindo — \`terraform_data\` com \`store\`.** O \`terraform_data\` é aquele recurso "vazio" que muita gente usa para guardar um valor auxiliar ou forçar um trigger, sem representar nada real na nuvem. O novo bloco \`store\` deixa o provider guardar um dado privado ali dentro, marcado como ephemeral ou sensitive — útil para passar informação entre etapas sem que ela apareça no state.

**Sobre deferred actions:** a flag experimental \`-allow-deferral\`, que permitiria \`count\` e \`for_each\` resolverem com valores unknown, apareceu nas betas da 1.16 mas **não consta nas notas do release GA**. Continua sendo algo para acompanhar, não para depender em produção.

![Comparação entre um atributo comum gravado no state e um write-only argument com _wo_version](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/terraform-o-que-mudou-desde-a-associate/1.png)

## Traduzindo: ephemeral values e write-only arguments

Esse é o conceito mais importante do período inteiro, e o que o exame 004 passou a cobrar por nome. A base nasceu na 1.10 e amadureceu na 1.11 — tecnicamente antes da minha prova, mas fora do escopo do 003.

O problema: qualquer valor que passa por um \`resource\` ou \`output\` fica gravado **em texto plano** dentro do \`terraform.tfstate\` — inclusive senha, token e connection string. Quem tem acesso de leitura ao state lê esse valor para sempre, mesmo que a senha já tenha sido trocada depois.

Um **ephemeral value** é um valor que só existe durante aquele \`plan\` ou \`apply\`: nunca vai para o state, nunca vai para o arquivo de plan, e some da memória assim que a operação termina.

\`\`\`hcl
variable "db_password" {
  type      = string
  ephemeral = true
  sensitive = true
}
\`\`\`

Um **write-only attribute** é a mesma ideia aplicada a um campo específico de um recurso: você manda a senha nova para o provider, ela é aplicada, e o Terraform **nem tenta lembrar** o que mandou.

\`\`\`hcl
resource "azurerm_mssql_server" "sql" {
  administrator_login_password_wo         = var.db_password
  administrator_login_password_wo_version = 1 # sobe para forçar rotação
}
\`\`\`

O pulo do gato é o \`_wo_version\`. Como a senha nunca vai para o state, o Terraform precisa de **outra coisa** para comparar e decidir se manda a senha de novo para o Azure — e essa outra coisa é um número comum, não secreto, que **fica** gravado no state. Ele só reenvia a senha quando esse número muda:

| Apply | var.db_password | _wo_version no código | _wo_version no state | O que acontece |
|---|---|---|---|---|
| 1º | "Senha123!" | 1 | recurso novo | manda a senha para o Azure e grava só version=1 |
| 2º, nada mudou | "Senha123!" | 1 | 1 | version igual, então não toca na senha |
| 3º, rotação | "NovaSenha456!" | 2 | 1 | version mudou de 1 para 2, então manda a senha nova e grava version=2 |

**A armadilha:** se você trocar só a senha e **esquecer de subir o \`_wo_version\`**, o Terraform não percebe nada — ele não está olhando para a senha, só para o número. É exatamente por isso que o version existe: ele é o gatilho manual que substitui o diff que não pode mais existir.

## O provider azurerm: a mudança que se sente todo dia

O Core é o motor. O \`azurerm\` é o que a gente escreve toda hora. Na data da minha prova o provider estava na **v4.37.0**. De lá até hoje foram dezenas de minors na linha 4.x, depois a 5.0, e hoje a linha corrente é a **5.6.0** (17/09/2026).

### ago/2025 a mai/2026: a preparação silenciosa

Sem quebra de versão major nesse trecho, mas é aqui que o terreno da 5.0 foi preparado, recurso por recurso:

- **A onda de deprecation de storage ID começou aqui.** O \`azurerm_storage_queue\` ganhou \`storage_account_id\`, depreciando \`storage_account_name\`, na v4.46.0 (25/09/2025). Blob, table e container seguiram com \`storage_container_id\` e \`storage_account_id\` na v4.77.0 (11/06/2026). É a mesma história por nove meses — e essa migração de campo é exatamente o que ficou com \`id\` malformado na subida de 4.x para 5.x.
- **Actions e List Resources começaram antes do que parece.** A primeira Action do azurerm foi \`azurerm_virtual_machine_power\` e os primeiros List Resources foram \`azurerm_storage_account\` e \`azurerm_virtual_network\`, todos na v4.45.0 (18/09/2025) — antes mesmo do Core 1.14. Não foi um pacote fechado, foi rollout gradual por quase um ano: no total da janela, 36 novos resources, 46 novos List Resources e 6 novas Actions.
- **AKS recebeu reforço incremental**, sem um salto único: suporte a \`AzureLinux3\` e \`Ubuntu2204\` e \`ai_toolchain_operator_enabled\` na v4.47.0, integração de VNet via \`api_server_access_profile\` na v4.46.0, e a mesma linha chegando no \`KataVmIsolation\` em junho de 2026.
- **Dois recursos inteiros sumiram por fim de serviço no Azure**, não por decisão do provider: \`azurerm_mobile_network*\` (v4.57.0) e \`azurerm_spatial_anchors_account\` (v4.52.0).
- **A migração para o \`go-azure-sdk\` é contínua, não um evento**: 24 bumps de dependência em cerca de 34 releases.

Vale o registro: **não houve outra major version entre a 4.0 (agosto de 2024, antes da minha prova) e a 5.0**. A linha 4.x foi inteira em minors.

### azurerm 5.0.0 — as cinco quebras reais

Publicado em 27/07/2026. "Major" aqui não é número de marketing: campo e recurso deprecated foram **removidos de vez**, não só avisados.

- **Auto-registro de Resource Provider virou \`none\` por padrão.** No 4.x, o provider registrava sozinho cerca de 60 Resource Providers do Azure na inicialização (\`resource_provider_registrations = "legacy"\`). No 5.0 o padrão é \`"none"\`: se o RP nunca foi registrado na assinatura, o \`apply\` falha na hora de criar o recurso. Para manter o comportamento antigo, sete \`resource_provider_registrations = "legacy"\` explicitamente; para ser mais enxuto, use \`resource_providers_to_register\` listando só o que o workspace usa de fato. Isso morde forte em subscriptions novas ou pouco usadas.
- **Enhanced validation desligada por padrão.** A validação de \`location\` e de Resource Provider usando o cache de metadata do Azure saiu do padrão e foi para o bloco \`features\`. Sem reativar, um nome de região errado só é pego no \`apply\`, como erro da API, e não mais no \`plan\`. Reativa com \`features { enhanced_validation { locations = true } }\`.
- **Preflight validation só em seis recursos**: \`azurerm_app_service_environment_v3\`, \`azurerm_service_plan\`, \`azurerm_dashboard_grafana\`, \`azurerm_eventgrid_namespace\`, \`azurerm_managed_redis\` e \`azurerm_nginx_deployment\`. Todo o resto passa reto — um \`plan\` limpo deixou de ser garantia para esses tipos.
- **\`azurerm_app_service\` e \`azurerm_function_app\` foram deletados.** Não é deprecation, é remoção. Quem ainda usa precisa migrar para \`azurerm_linux_web_app\`/\`azurerm_windows_web_app\` e \`azurerm_linux_function_app\`/\`azurerm_windows_function_app\`, com \`terraform state mv\` para não recriar o recurso do zero.
- **\`skip_provider_registration\` não existe mais** no schema do provider — consequência direta do primeiro ponto.

**Se for migrar de 4.x para 5.x:** vá direto para a **5.1.0 ou superior**, não pare na 5.0.0 pura. A 5.0.0 e a 5.0.1 tiveram bugs reais de state migration em \`azurerm_storage_container\`, \`azurerm_storage_queue\`, \`azurerm_storage_share\` e \`azurerm_storage_table_entity\` — o campo \`id\` ficava malformado na subida. Só ficou tudo corrigido na 5.1.0, de 13/08/2026. Hoje a linha já está na 5.6.0, então o ponto é histórico, mas importa para quem congelou a versão.

O 5.0 também trouxe **write-only nativo para o azurerm**: \`azurerm_subnet\` ganhou \`network_security_group_id_wo\` e \`route_table_id_wo\`, com os respectivos \`_wo_version\`. É o mesmo padrão explicado lá em cima, agora num recurso Azure de verdade.

### azuread: 3.4 para 3.9, sem major version

Andamento bem mais tranquilo. Os destaques: o novo resource \`azuread_flexible_federated_identity_credential\` (3.7), suporte a filtro em \`azuread_conditional_access_policy\` (3.9) e uma sequência de correções para **eventual consistency** — a Microsoft Graph API demora para propagar depois de um \`create\`, o que fazia o Terraform reportar \`not found\` num recurso recém-criado. Corrigido progressivamente entre a 3.6 e a 3.9.

![Diagrama de um Stack do Terraform com um component reutilizável e três deployments dependentes](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/terraform-o-que-mudou-desde-a-associate/2.png)

## Mudanças que não são só do CLI

Quatro coisas que mudaram no produto e na empresa. Nenhuma aparece em \`terraform --version\`, mas todas mudam como um time de plataforma trabalha.

### Stacks saiu de beta e virou GA

**O problema que resolve:** para ter dev, qa e prod — às vezes multiplicado por tenant e por região — a saída costuma ser root module com \`tfvars\` por ambiente, ou um wrapper tipo Terragrunt. Funciona, mas o Terraform em si não sabe que esses ambientes são "a mesma coisa em estágios diferentes". Não dá para dizer nativamente "só aplica em prod depois que qa passar".

**Como o Stacks modela isso:** um **component** é a definição reutilizável da infraestrutura (rede, AKS, banco). Um **deployment** é uma instância daquele component para um ambiente específico, cada um com seu próprio state, mas todos descritos a partir da mesma definição raiz — com grafo de dependência nativo entre deployments.

\`\`\`hcl
# network.tfstack.hcl — a definição, uma vez só
component "network" {
  source = "./modules/network"
  inputs = {
    cidr = var.cidr
  }
}
\`\`\`

\`\`\`hcl
# deployments.tfdeploy.hcl — uma entrada por ambiente
deployment "prod" {
  inputs = {
    cidr = "10.10.0.0/16"
  }
}

deployment "qa" {
  inputs = {
    cidr = "10.11.0.0/16"
  }
}
\`\`\`

A diferença para root module com tfvars: aqui as duas deployments entram no **mesmo grafo** de dependência do Terraform. Dá para declarar "não aplica \`prod\` antes de \`qa\` terminar limpo" nativamente, em vez de isso morar espalhado numa pipeline por fora.

GA anunciada na HashiConf de setembro de 2025, para todos os planos de HCP Terraform baseados em RUM. O \`terraform-stacks-cli\` separado foi descontinuado — tudo entrou no CLI principal como \`terraform stacks\`. Configurações da beta pública **não migram sozinhas**, e o histórico de state se perde. Em 2026 ganhou suporte a monorepo e a "stack component configurations" via registry privado.

### HCP Terraform e o Infragraph

O nome "Terraform Cloud" já era "HCP Terraform" antes da minha prova. O que é novo: em setembro de 2025 entrou em preview público o **HCP Terraform powered by Infragraph**, um grafo de infraestrutura em tempo real dentro do HCP — a base declarada para automação agêntica, com agentes observando e agindo sobre o ciclo de vida do recurso.

### A HashiCorp agora é IBM

Aquisição fechada em 27/02/2025, por US$ 6,4 bilhões. A licença **continua BSL** — não houve volta para open source sob MPL. Em setembro de 2025, IBM e HashiCorp anunciaram o **Project Infragraph**, em private beta desde dezembro de 2025, com plano de conectar Ansible, OpenShift e watsonx Orchestrate ao mesmo grafo.

### tfpolicy: governança sai do Sentinel e entra no HCL

Lançado em beta público em julho de 2026, dentro do HCP Terraform, exigindo Terraform 1.16 ou superior. Resolve o mesmo problema que Sentinel e OPA sempre resolveram — barrar um \`plan\` que viola uma regra de governança — mas **sem trocar de linguagem**: a política é escrita em HCL, a mesma que já se usa para escrever a infraestrutura.

O que ele faz que Sentinel e OPA não faziam nativamente:

- **Enxerga relação entre recursos.** Por exemplo: "toda IAM role precisa ter pelo menos uma policy anexada". O Sentinel avalia um recurso isolado; o tfpolicy enxerga o grafo inteiro.
- **Puxa dado externo durante a avaliação.** Por exemplo: "só permite AMI aprovada", batendo num data source de verdade, e não numa lista fixa dentro da política.
- **Bloqueia provider ou módulo não aprovado antes do download**, barrando na origem.
- **Avalia depois do deploy**, contra o estado real na nuvem — pega drift e valor computado pelo provider que só existe depois do apply.

\`\`\`hcl
module_policy "git::github.com/acme/terraform-aws-vpc" "versao_minima" {
  enforce {
    condition     = core::semverconstraint(meta.version, ">= 2.0.0")
    error_message = "O módulo VPC oficial precisa estar na versão 2.0.0 ou superior."
    info_message  = "Versão do módulo VPC: \${meta.version}."
  }
}
\`\`\`

Existe o mesmo padrão para \`resource_policy\`, aplicado a um tipo de recurso específico, e para \`provider_policy\` — ambos com o mesmo bloco \`enforce\`, e os atributos do recurso acessados pelo prefixo \`attrs.\` (por exemplo \`attrs.tags.environment\`). Se você já trabalha com policy as code, vale comparar com a abordagem que descrevi em [Platform Engineering e Policy as Code](/artigos/platform-engineering-policy-as-code).

![Tabela comparando os domínios do exame Terraform Associate 003 e 004](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/terraform-o-que-mudou-desde-a-associate/3.png)

## A prova mudou debaixo de mim: 003 para 004

O exame 003 foi aposentado em **07/01/2026** e o 004 entrou no dia seguinte, mapeado para o Terraform \`v1.12\`. O certificado 003 continua válido normalmente — mas se eu fosse fazer a prova hoje, isto é o que entrou de novo:

| Domínio | O que o 003 cobrava | O que o 004 acrescentou |
|---|---|---|
| Configuração | sintaxe, variables, outputs, providers | custom conditions em blocos de validação; ephemeral values e write-only arguments como tópicos nomeados |
| State | lock, remote backend, import básico | regras de lifecycle explícitas (\`create_before_destroy\`, \`prevent_destroy\`, \`depends_on\`) como conteúdo próprio, não só sintaxe |
| Plataforma SaaS | Terraform Cloud descrito de forma genérica | HCP Terraform vira domínio dedicado, com workspaces e projects cobrados como estrutura de governança |

**Traduzindo — custom conditions.** É uma forma de fazer o Terraform recusar um \`plan\` ou \`apply\` **antes** de bater na API do provider, com uma mensagem de erro escrita por você em vez do erro genérico da cloud. O \`validation\` vive dentro de uma \`variable\`; \`precondition\` e \`postcondition\` vivem dentro de um bloco \`lifecycle\` de resource, data source ou output:

\`\`\`hcl
variable "storage_tier" {
  type = string

  validation {
    condition     = contains(["Hot", "Cool", "Cold"], var.storage_tier)
    error_message = "storage_tier precisa ser Hot, Cool ou Cold — não '\${var.storage_tier}'"
  }
}
\`\`\`

**Traduzindo — workspaces e projects no HCP Terraform.** No HCP Terraform, um **workspace** é uma instância de configuração, state e variáveis rodando lá — o equivalente a um ambiente. Um **project** é uma pasta que agrupa vários workspaces, por exemplo todos os workspaces de rede de todos os tenants, e serve para dar permissão por grupo em vez de workspace por workspace. O 004 testa isso como estrutura de governança, não só como "onde o state mora".

O gap real de conteúdo entre o 003 e o 004 é, portanto, pequeno e específico: **ephemeral values e write-only arguments**, **custom conditions** e a organização de **workspaces e projects**. O resto do exame é o mesmo esqueleto.

## De relance

- **\`terraform test\` amadureceu.** \`-junit-xml\` virou GA na 1.11, \`-parallelism\` na 1.12, \`state_key\` e \`override_during\` na 1.11. Um \`test cleanup\` experimental apareceu no ciclo da 1.16 e 1.17 para lidar com state órfão de teste que falhou.
- **State encryption continua exclusivo do OpenTofu.** Vale a distinção: um Azure Storage Account com SSE criptografa o **arquivo** do state em repouso — mas quem tem \`Storage Blob Data Reader\` naquele container abre o JSON e lê tudo em texto plano, senha incluída. É exatamente por isso que ephemeral values e write-only existem. "State encryption" é outra coisa: criptografa o **conteúdo** do state com uma chave separada (KMS, Key Vault, OpenBao), de modo que nem quem tem acesso de leitura ao blob lê nada sem a chave. Isso segue sendo do OpenTofu, desde a v1.7 dele. Se isso importa para o seu time, é o maior motivo concreto para olhar o fork.

## O que eu tiro disso

A certificação continua valendo, e o esqueleto do que ela cobra segue de pé. Mas três coisas mudaram o suficiente para entrar na minha lista de prática:

- **Ephemeral values e write-only arguments**, porque mudam como segredo trafega — e porque o 004 cobra por nome.
- **O upgrade do azurerm para 5.x**, que é quebra real e precisa de plano, não de \`terraform apply\` otimista. Se você mantém infraestrutura Azure com Terraform, vale ler junto o que escrevi em [Terraform: infraestrutura evolutiva](/artigos/artigo-terraform-infra-evolutiva).
- **Stacks e tfpolicy**, que juntos cobrem o espaço que hoje é preenchido por wrapper e por linguagem de política separada.

O resto — backend, módulo, state, import, workspace — é o mesmo Terraform que eu estudei. O que é, de novo, uma boa notícia sobre o que a certificação escolhe cobrar.

## Referências

- [Terraform 1.11: ephemeral values e write-only arguments — HashiCorp](https://www.hashicorp.com/en/blog/terraform-1-11-ephemeral-values-managed-resources-write-only-arguments)
- [Novidades do Terraform 1.15 — HashiCorp](https://www.hashicorp.com/en/blog/new-in-terraform-115-dynamic-sources-variable-deprecation-and-more)
- [Releases do hashicorp/terraform no GitHub](https://github.com/hashicorp/terraform/releases)
- [Terraform Stacks: atualização de GA — HashiCorp Developer](https://developer.hashicorp.com/terraform/language/stacks/update-GA)
- [Introducing tfpolicy — HashiCorp](https://www.hashicorp.com/en/blog/introducing-tfpolicy-a-declarative-policy-workflow-built-for-terraform)
- [Referência de política do tfpolicy — HashiCorp Developer](https://developer.hashicorp.com/terraform/policy/reference/policy)
- [Guia de upgrade do azurerm 5.0 — Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/5.0-upgrade-guide)
- [CHANGELOG-v4.md do terraform-provider-azurerm](https://github.com/hashicorp/terraform-provider-azurerm/blob/main/CHANGELOG-v4.md)
- [Histórico de versões do azurerm — Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/terraform/provider-version-history-azurerm-4-0-0-to-current)
- [Releases do terraform-provider-azuread no GitHub](https://github.com/hashicorp/terraform-provider-azuread/releases)
- [Conteúdo oficial do exame 004 — HashiCorp Developer](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004)
- [IBM conclui a aquisição da HashiCorp — TechCrunch](https://techcrunch.com/2025/02/27/ibm-closes-6-4b-hashicorp-acquisition/)
`,
  date: "2026-09-18",
  category: "Artigos",
  readTime: "18 min de leitura",
  tags: ["Terraform", "Azure", "Certificações", "DevOps", "Platform Engineering"]
};
