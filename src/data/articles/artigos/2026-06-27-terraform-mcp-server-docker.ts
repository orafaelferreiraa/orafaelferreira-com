import type { Article } from '../types';

export const article: Article = {
  slug: "terraform-mcp-server-docker",
  title: "MCP Server com Docker e Terraform: discovery, troubleshooting e produtividade",
  excerpt:
    "Um guia direto ao ponto para usar Terraform MCP Server com Docker no dia a dia: discovery, troubleshooting e produtividade",
  content: `

![Capa do artigo sobre Terraform MCP Server com Docker](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/01.png) 
## Resumo rápido

- MCP cria um padrão para clientes de IA se conectarem a ferramentas e dados externos.
- Terraform MCP Server é uma forma prática de trazer contexto de providers, módulos, runs e plans para um workflow mais previsível.
- Agentes de codificação trabalham em um loop de execução (análise, ação e observação), e dá para guiar esse loop com engenharia.
- MCP e skills se completam: o MCP conecta o agente a dados atuais e as skills carregam as boas práticas para orientar cada passo.

O [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) cria um formato padrão para um cliente consultar ferramentas e dados sem ficar adivinhando formato ou fazendo scraping de texto.

O protocolo foi inicialmente desenvolvido pela [Anthropic](https://www.anthropic.com/) e hoje evolui como padrão aberto no ecossistema.

E o [Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server) coloca isso no mundo Terraform.

## MCP é tipo um "USB da internet"

![Ilustração do MCP como um USB-C para apps de IA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/02.png) 

Uma analogia que ajuda muito: MCP funciona como um "USB-C" para apps de IA.

No mundo físico, você conecta mouse, teclado, webcam no mesmo padrão. No mundo de IA, você conecta servidores MCP de docs, cloud, banco, ticket, observabilidade e automação no mesmo protocolo.

Isso permite trocar informações sem reescrever tudo e diminui acoplamento entre cliente e integrações.

Exemplos simples:

- um agente conecta no MCP do Terraform para ler módulos e providers
- o mesmo agente conecta no MCP de observabilidade para investigar incidente
- depois conecta no MCP de wiki interna para buscar padrões do time

## Como o agente de IA realmente trabalha: o loop de execução

Antes de plugar qualquer MCP, vale entender como um agente de codificação (Claude Code, GitHub Copilot, Codex e afins) executa uma tarefa. Ele não resolve tudo de uma vez: trabalha em um **loop de execução**.

O ciclo se repete mais ou menos assim:

- **Análise** — o agente lê a tarefa (ou a especificação) e decide o próximo passo
- **Ação** — chama uma ferramenta: ler um arquivo, rodar um comando ou consultar um MCP
- **Observação** — lê o resultado daquela ação
- **Repetição** — volta para a análise e segue até concluir a tarefa

Quando você fica trocando prompt atrás de prompt no chat, corrigindo na tentativa e erro, o agente decide sozinho cada passo, sem trilho. É o famoso "vibe coding": até funciona, mas rende pouco e erra bastante.

A alternativa é aplicar engenharia a esse ciclo — guiar o loop em vez de só reagir a ele. Para isso existem dois controles complementares: **skills** (direção) e **MCPs** (ferramentas).

## Skills vs MCPs: dois controles que se completam

É fácil confundir os dois, mas cada um resolve um problema diferente:

- **MCP é o encanamento.** Dá ao agente *acesso* a ferramentas e dados externos — aqui, a documentação viva de providers e módulos do Terraform. Responde a "o que o agente consegue alcançar?".
- **Skill é o livro-texto.** Empacota *conhecimento e boas práticas* que o agente carrega sob demanda: workflows, convenções e guardrails. Responde a "como o agente deve trabalhar?".

A própria [HashiCorp resume bem](https://www.hashicorp.com/en/blog/introducing-hashicorp-agent-skills): o MCP é o "cano" que conecta dados à IA, enquanto as [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) são os "livros-texto" de conhecimento — e o melhor resultado vem de usar os dois juntos.

Na prática, com Terraform:

- **só com MCP:** o agente consulta a versão atual do provider e evita gerar código preso a uma versão antiga do treinamento
- **só com skill:** o agente segue o style guide, escreve testes e revisa segurança, mas sem dados atualizados
- **com os dois:** dados atuais e boas práticas dentro do mesmo loop

Skills são um [formato aberto](https://agentskills.io/home) criado pela Anthropic: cada uma é uma pasta com um arquivo \`SKILL.md\` que descreve, em linguagem natural, quando e como o agente deve agir. Diferente de um prompt pontual, a skill é reutilizável e só entra em contexto quando é relevante.

## No dia a dia

Sem MCP, o fluxo costuma ser:

1. pesquisar manualmente provider/módulo
2. abrir várias abas para comparar versões
3. cruzar informação de workspace, run e plan na mão
4. responder o time com base em contexto parcial 

Com MCP, um cliente compatível consegue consultar essas informações de forma estruturada.

Em vez de prompt genérico, você chama uma tool específica e recebe dados previsíveis. Isso reduz erros, acelera decisões e melhora rastreabilidade.

No dia a dia, os ganhos mais claros são:

- **discovery mais rápido:** buscar providers e módulos sem navegar em 10 páginas
- **menos erro de versão:** consultar versões recentes de forma objetiva

Exemplos de tools disponíveis:

- **search_providers** e **get_provider_details**
- **search_modules** e **get_module_details**
- **get_latest_provider_version** e **get_latest_module_version**
- **list_workspaces** e **get_workspace_details**
- **get_plan_json_output** e **get_run_details**

![Fluxo de uso do Terraform MCP Server no dia a dia](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/04.png) 

## Onde encontrar MCPs oficiais na internet

Se você quer fontes confiáveis para descobrir servidores MCP:

- [Site oficial do MCP](https://modelcontextprotocol.io/) (oficial: conceitos, spec e guias)
- [Organização oficial no GitHub](https://github.com/modelcontextprotocol) (oficial)
- [Lista de servidores do ecossistema MCP](https://github.com/modelcontextprotocol/servers) (comunidade/ecossistema)
- [Registry MCP da comunidade](https://github.com/modelcontextprotocol/registry) (comunidade)

Para ecossistemas grandes, vale acompanhar registries e catálogos de vendors:

- [Docker MCP Registry](https://hub.docker.com/mcp) (oficial Docker)
![Página do Docker MCP Registry no Docker Hub](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/mcpdocker.png) 
- [Microsoft MCP Registry](https://github.com/mcp?utm_source=vscode-website&utm_campaign=mcp-registry-server-launch-2025) (oficial Microsoft)
![Página do MCP Registry do GitHub e Microsoft](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/MCPRegistry.png) 
## Skills oficiais de Terraform da HashiCorp

Além do MCP Server, a HashiCorp publicou uma biblioteca aberta de skills: o [HashiCorp Agent Skills](https://www.hashicorp.com/en/blog/introducing-hashicorp-agent-skills), disponível no repositório [hashicorp/agent-skills](https://github.com/hashicorp/agent-skills).

As skills de Terraform ajudam o agente a:

- **gerar código no style guide** oficial da HashiCorp, em vez de convenções aleatórias encontradas na internet
- **escrever e rodar testes** com o framework nativo de testes do Terraform
- **orquestrar com Terraform Stacks** cenários multi-ambiente e multi-região
- **desenvolver e manter providers** seguindo o plugin framework (schema, ciclo de vida e breaking changes)
- **refatorar módulos**, quebrando configurações monolíticas em módulos reutilizáveis

Instalar é rápido. Para todas as skills, via npx:

\`\`\`bash
npx skills add hashicorp/agent-skills
\`\`\`

Ou uma skill específica:

\`\`\`bash
npx skills add hashicorp/agent-skills/terraform/code-generation/skills/terraform-style-guide
\`\`\`

No Claude Code, dá para instalar como plugin:

\`\`\`bash
claude plugin marketplace add hashicorp/agent-skills
claude plugin install terraform-code-generation@hashicorp
\`\`\`

O ganho reforça o tema deste artigo: a skill entrega as boas práticas e o MCP entrega os dados atuais. Juntos, reduzem alucinação e mantêm o código dentro do padrão.

## Onde o Docker entra de verdade

Reduzir variação de ambiente. Com [Docker](https://docs.docker.com/), você empacota o servidor MCP de forma reproduzível para:

- notebook local
- ambiente de desenvolvimento
- CI/CD
- máquina de quem entrou no time ontem

Isso corta o clássico "na minha máquina funciona" e ajuda a manter o mesmo comportamento entre ambientes.

## Setup mínimo para começar

Primeiro, confirme o Terraform no ambiente:

\`\`\`bash
terraform version
\`\`\`

Depois, rode o servidor MCP com Docker (exemplo; ajuste conforme a documentação oficial e versão mais recente):

\`\`\`bash
docker run --rm -it \
  --name terraform-mcp \
  -e TF_IN_AUTOMATION=true \
  -e TF_LOG=INFO \
  -v "\${PWD}:/workspace" \
  -w /workspace \
  hashicorp/terraform-mcp-server:1.0.0
\`\`\`

## Primeira chamada real (hands-on)

Depois de subir o servidor MCP, o fluxo mínimo no cliente costuma ser:

1. listar as tools disponíveis
2. chamar uma tool de discovery (ex.: \`search_providers\`)
3. validar estrutura de resposta antes de automatizar

Exemplo de resposta esperada (resumida). Os campos exatos podem variar conforme a tool e o cliente MCP:

\`\`\`json
{
  "providers": [
    {
      "name": "azurerm",
      "namespace": "hashicorp",
      "latest_version": "x.y.z"
    }
  ]
}
\`\`\`

Com isso, você já valida conectividade, autenticação e formato dos dados.

## Como instalar e rodar MCP com Node.js (o mínimo necessário)

Se você quiser criar ou testar um MCP sem Docker, normalmente precisa de:

- Node.js LTS (18+ ou 20+)
- npm, pnpm ou yarn
- um cliente MCP (editor, agente, CLI, ou o Inspector)

Exemplo de bootstrap rapido com Node:

\`\`\`bash
mkdir meu-mcp-node && cd meu-mcp-node
npm init -y
npm install @modelcontextprotocol/xxxx
\`\`\`

Estrutura mínima comum:

- \`package.json\`
- \`server.ts\`

Exemplo mínimo de servidor (conceitual):

\`\`\`ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server(
  { name: "meu-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

// Registrar tools aqui (status, healthcheck, consultas etc.)
\`\`\`

Execução típica em desenvolvimento:

\`\`\`bash
npx tsx server.ts
\`\`\`

No cliente MCP, configure esse servidor para rodar via stdio.

- criar um servidor MCP em TypeScript/JavaScript
- expor tools (ex.: consultar status, buscar docs, executar validações)
- rodar por stdio para o cliente consumir

![Diagrama do cliente MCP consumindo o servidor via stdio](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/04.png)

Para testar localmente, muita gente usa o [MCP Inspector](https://github.com/modelcontextprotocol/inspector).

Se a equipe usa Docker em tudo, a abordagem mais estável é empacotar também o MCP Node em container para padronizar runtime.

## Troubleshooting rápido

Quando estou com erro, normalmente eu peço ajuda para o agent corrigir mesmo.

Exemplo de configuracao MCP (Terraform MCP Server via Docker/stdio):

\`\`\`json
"io.github.hashicorp/terraform-mcp-server": {
  "type": "stdio",
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "TFE_ADDRESS",
    "-e",
    "TFE_TOKEN",
    "-e",
    "ENABLE_TF_OPERATIONS",
    "hashicorp/terraform-mcp-server:1.0.0"
  ],
  "env": {
    "TFE_ADDRESS": "\${input:TFE_ADDRESS}",
    "TFE_TOKEN": "\${input:TFE_TOKEN}",
    "ENABLE_TF_OPERATIONS": "\${input:ENABLE_TF_OPERATIONS}"
  },
  "gallery": "https://api.mcp.github.com",
  "version": "1.0.0"
}
\`\`\`

![Terminal exibindo o troubleshooting do MCP Server no Docker](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mcp.tf/03.png)

## Fluxo prático

1. subir o servidor MCP em container
2. conectar o cliente MCP (editor, agente ou automação)
3. validar uma consulta de discovery (provider/módulo)
4. validar uma consulta operacional (workspace/run/plan)

## Guardrails que você não deve ignorar

Se o servidor tiver acesso a ambientes reais, trate como componente crítico:

- use credenciais com privilégio mínimo
- evite segredo em variável solta no container
- defina limites claros para operações permitidas
- habilite logs suficientes para auditoria e troubleshooting
- separe bem o que é dev, homolog e prod

MCP acelera muito, mas sem guardrail ele também acelera o caos!

Se quiser aprofundar, estes dois cursos da Anthropic são ótimos pontos de partida:

- [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol)
- [Model Context Protocol Advanced Topics](https://anthropic.skilljar.com/model-context-protocol-advanced-topics)

Resumo:

- **Terraform** continua sendo o motor declarativo
- **MCP** organiza como ferramentas e agentes consomem contexto atualizado
- **Skills** carregam as boas práticas que guiam o agente no loop de execução
- **Docker** entrega repetibilidade para rodar isso sem drama

Se a meta é reduzir erros operacionais e ganhar velocidade com controle, combinar Terraform MCP Server, skills e Docker é um passo bastante útil.
  `,
  date: "2026-06-27",
  category: "Artigos",
  readTime: "15 min de leitura",
  tags: ["Terraform", "Docker", "DevOps", "Platform Engineering", "MCP", "IA"]
};
