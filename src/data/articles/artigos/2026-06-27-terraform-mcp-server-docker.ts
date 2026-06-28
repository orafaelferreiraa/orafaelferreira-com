import { Article } from '../types';

export const article: Article = {
  slug: "terraform-mcp-server-docker",
  title: "Terraform MCP Server com Docker: o que é, para que serve e como começar",
  excerpt:
    "Um guia prático sobre MCP, o papel do Terraform no fluxo de infraestrutura e como usar Docker para isolar e reproduzir um servidor MCP.",
  content: `

O [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) apareceu para padronizar a forma como clientes inteligentes conversam com ferramentas e fontes de contexto. Em vez de cada integração inventar o próprio formato, o MCP cria um contrato comum entre quem pede informação e quem expõe capacidades.

Neste artigo, vamos focar no [Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server) e saber como utilizá-lo no dia a dia, e como o [Docker](https://docs.docker.com/) entra na parada prática de distribuição, isolamento.

## Primeiramente, o que é MCP

De forma simples, MCP é um protocolo para expor contexto e ferramentas de maneira previsível. Ele faz sentido quando você quer que um cliente, agente ou editor consiga:

- descobrir ferramentas/capacidades disponíveis
- consultar estado, metadados/informações
- executar ações com limites
- manter integração padronizada entre ambientes

Em um fluxo de infraestrutura, isso abre espaço para automações com IA sem amarrar tudo a uma integração proprietária.

O [Terraform](https://developer.hashicorp.com/terraform) continua sendo a base de infraestrutura como código, e creio que irá ser por um bom tempo.

## O que o Terraform MCP Server faz na prática

No contexto do MCP, o Terraform MCP Server expõe tools com resposta estruturada para o cliente consultar documentação, estado e metadados do ecossistema Terraform. Em vez de depender de texto livre, o cliente chama operações específicas e recebe dados previsíveis.

Os principais grupos de tools são:

- **Registry (público):** pesquisa e leitura de providers, módulos e policies do Terraform Registry.
- **Registry privado:** pesquisa e leitura de módulos e providers privados da organização.
- **Terraform (HCP Terraform/Terraform Enterprise):** leitura de organizações, projetos, workspaces, runs, planos e logs, além de operações administrativas quando habilitadas.

Exemplos reais de tools úteis:

- **search_providers** e **get_provider_details**
- **search_modules** e **get_module_details**
- **get_latest_provider_version** e **get_latest_module_version**
- **list_workspaces** e **get_workspace_details**
- **get_plan_json_output** e **get_run_details**

Por que usar no dia a dia:

- padroniza consultas de IaC com menos ambiguidade
- acelera a descoberta de módulos e providers corretos antes de codar
- ajuda na revisão de impacto com dados de plan, run e logs
- reduz trabalho manual em tarefas repetitivas de workspace e variáveis
- melhora governança, já que operações destrutivas ficam desabilitadas por padrão e exigem habilitação explícita

## Por que usar Docker

O [Docker](https://docs.docker.com/) resolve um problema prático: distribuir o servidor MCP em um ambiente igual para todo mundo.

Isso ajuda porque:

- reduz conflito de versões
- isola dependências
- facilita onboarding
- simplifica reprodução local
- combina bem com ambientes de desenvolvimento e automação

Em outras palavras, o container vira uma embalagem previsível para uma ferramenta que precisa ser fácil de subir e fácil de repetir.

## Instalando o Terraform

Antes de colocar o MCP para rodar, o básico continua valendo: o Terraform precisa estar disponível onde fizer sentido no seu fluxo.

Você pode instalar o Terraform pela forma oficial recomendada para o seu sistema operacional na página de [instalação oficial do Terraform](https://developer.hashicorp.com/terraform/install) e validar a instalação com:

\`\`\`bash
terraform version
\`\`\`

Se o comando responder corretamente, o binário está disponível e pronto para uso no ambiente.

## Subindo o servidor MCP com Docker

A lógica é a mesma de qualquer servidor containerizado: definir a imagem, montar os arquivos necessários e passar as variáveis de ambiente do ambiente Terraform.

Um exemplo de estrutura com \`docker run\` fica assim:

\`\`\`bash
docker run --rm -it \
  --name terraform-mcp \
  -e TF_IN_AUTOMATION=true \
  -e TF_LOG=INFO \
  -v "\${PWD}:/workspace" \
  -w /workspace \
  hashicorp/terraform-mcp-server:1.0.0
\`\`\`

O comando segue o padrão oficial do [docker run](https://docs.docker.com/engine/reference/run/), e a imagem oficial está documentada no repositório [hashicorp/terraform-mcp-server](https://github.com/hashicorp/terraform-mcp-server).

Se você preferir \`docker compose\`, a ideia é a mesma, seguindo o [Docker Compose](https://docs.docker.com/compose/):

\`\`\`yaml
services:
  terraform-mcp:
    image: <imagem-oficial-do-servidor-mcp>
    working_dir: /workspace
    environment:
      TF_IN_AUTOMATION: "true"
      TF_LOG: INFO
    volumes:
      - ./:/workspace
\`\`\`

O nome exato da imagem pode variar conforme a distribuição usada, então vale seguir a documentação da implementação escolhida e as referências oficiais de [docker run](https://docs.docker.com/engine/reference/run/) e [Docker Compose](https://docs.docker.com/compose/).

## Como usar com um cliente MCP

Depois que o servidor está ativo, o próximo passo é apontar um cliente compatível para ele.

Para instalação, autenticação e modos de transporte, vale seguir o guia oficial de [deploy do Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server/deploy) e a [referência completa](https://developer.hashicorp.com/terraform/mcp-server/reference).

O fluxo típico é:

1. iniciar o servidor MCP em container
2. registrar a conexão no cliente
3. descobrir as ferramentas expostas
4. testar uma consulta simples
5. validar se o contexto retornado está consistente

Esse padrão é útil em editores, agentes locais e automações internas.

O ponto mais importante não é só subir o container. É saber como ele vai lidar com credenciais, estado e rede. Fique atento a:

- acesso ao backend de state
- credenciais de cloud ou de provider
- variáveis sensíveis dentro do container
- permissões mínimas necessárias
- logs suficientes para troubleshooting

Se a implementação mexe com infraestrutura real, segurança e rastreabilidade precisam vir junto.

## Quando esse modelo faz sentido

Use esse caminho quando você quer um servidor Terraform padronizado, fácil de reproduzir e que possa ser consumido por um cliente MCP sem dependência de setup manual espalhado.

Ele também faz sentido quando o objetivo é colocar Terraform dentro de um fluxo assistido por IA, sem perder a disciplina de validação que IaC exige.

## Conclusão

MCP, Terraform e Docker combinam bem porque resolvem três problemas diferentes ao mesmo tempo: integração, infraestrutura e repetibilidade.

O Terraform continua sendo a base declarativa da infraestrutura. O MCP adiciona um contrato para consumo por agentes e ferramentas. O Docker fecha o circuito com isolamento e portabilidade.

Se a sua meta é automatizar com mais contexto e menos fricção, essa é uma combinação que vale a pena estudar.
  `,
  date: "2026-06-27",
  category: "Artigos",
  readTime: "8 min de leitura",
  tags: ["Terraform", "Docker", "DevOps"]
};
