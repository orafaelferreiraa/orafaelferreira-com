import { Article } from '../types';

export const article: Article = {
  slug: "terraform-mcp-server-docker",
  title: "Terraform MCP Server com Docker na vida real de DevOps e Platform Engineer",
  excerpt:
    "Um guia direto ao ponto para usar Terraform MCP Server com Docker no dia a dia: discovery, troubleshooting, governança e produtividade com menos atrito.",
  content: `

Se voce trabalha com infraestrutura todo dia, provavelmente ja viveu isso:

- um dev pede um modulo "rapido" para subir um recurso
- voce abre o Registry, depois abre docs, depois abre changelog
- alguem pergunta no chat "qual versao segura desse provider?"
- no meio disso, surge um run quebrado no workspace de producao

No fim, a maior dor nem sempre e o Terraform em si. E o contexto espalhado.

O [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) entra exatamente nesse ponto. Ele cria um contrato padrao para um cliente consultar ferramentas e dados sem ficar adivinhando formato ou fazendo scraping de texto.

E o [Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server) coloca isso no mundo Terraform.

## Traduzindo para a vida real

Sem MCP, o fluxo costuma ser:

1. pesquisar manualmente provider/modulo
2. abrir varias abas para comparar versoes
3. cruzar informacao de workspace, run e plan na mao
4. responder o time com base em contexto parcial

Com MCP, um cliente compativel consegue consultar essas informacoes de forma estruturada.

Em vez de prompt generico, voce chama uma tool especifica e recebe dados previsiveis. Isso reduz ruído, acelera decisoes e melhora rastreabilidade.

## O que voce ganha como DevOps/Platform Engineer

No dia a dia, os ganhos mais claros sao:

- **discovery mais rapido:** buscar providers e modulos sem navegar em 10 paginas
- **menos erro de versao:** consultar versoes recentes de forma objetiva
- **triagem melhor:** cruzar detalhes de runs/plans/workspaces com menos tentativa e erro
- **onboarding mais simples:** o time aprende um fluxo padrao, nao um conjunto de "macetes"
- **governanca:** operacoes sensiveis podem ficar bloqueadas por padrao e so liberar quando fizer sentido

Exemplos de tools comuns nesse contexto:

- **search_providers** e **get_provider_details**
- **search_modules** e **get_module_details**
- **get_latest_provider_version** e **get_latest_module_version**
- **list_workspaces** e **get_workspace_details**
- **get_plan_json_output** e **get_run_details**

## Onde o Docker entra de verdade

Nao e sobre "usar container porque sim". E sobre reduzir variacao de ambiente.

Com [Docker](https://docs.docker.com/), voce empacota o servidor MCP de forma reproduzivel para:

- notebook local
- ambiente de desenvolvimento
- CI/CD
- maquina de quem entrou no time ontem

Isso corta o classico "na minha maquina funciona" e ajuda a manter o mesmo comportamento entre ambientes.

## Setup minimo para comecar

Primeiro, confirme o Terraform no ambiente:

\`\`\`bash
terraform version
\`\`\`

Depois, rode o servidor MCP com Docker (ajuste de acordo com a documentacao oficial da imagem):

\`\`\`bash
docker run --rm -it \
  --name terraform-mcp \
  -e TF_IN_AUTOMATION=true \
  -e TF_LOG=INFO \
  -v "\${PWD}:/workspace" \
  -w /workspace \
  hashicorp/terraform-mcp-server:1.0.0
\`\`\`

Se preferir compose:

\`\`\`yaml
services:
  terraform-mcp:
    image: hashicorp/terraform-mcp-server:1.0.0
    working_dir: /workspace
    environment:
      TF_IN_AUTOMATION: "true"
      TF_LOG: INFO
    volumes:
      - ./:/workspace
\`\`\`

Referencias oficiais:

- [Terraform MCP Server (visao geral)](https://developer.hashicorp.com/terraform/mcp-server)
- [Deploy do Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server/deploy)
- [Referencia do Terraform MCP Server](https://developer.hashicorp.com/terraform/mcp-server/reference)
- [Docker run](https://docs.docker.com/engine/reference/run/)

## Fluxo pratico que funciona no dia a dia

Um fluxo simples e realista para squads de plataforma:

1. subir o servidor MCP em container
2. conectar o cliente MCP (editor, agente ou automacao)
3. validar uma consulta de discovery (provider/modulo)
4. validar uma consulta operacional (workspace/run/plan)
5. documentar o playbook no repo para o time repetir

Quando isso entra no ritmo semanal, voce ganha previsibilidade.

## Guardrails que voce nao deve ignorar

Se o servidor tiver acesso a ambientes reais, trate como componente critico:

- use credenciais com privilegio minimo
- evite segredo em variavel solta no container
- defina limites claros para operacoes permitidas
- habilite logs suficientes para auditoria e troubleshooting
- separe bem o que e dev, homolog e prod

MCP acelera muito, mas sem guardrail ele tambem acelera erro.

## Quando vale usar (e quando nao vale)

Faz sentido quando:

- sua equipe consulta muito Registry e estado de workspace
- voce quer padronizar operacao entre pessoas e ambientes
- existe demanda real por automacao assistida por IA

Talvez nao faca sentido agora quando:

- o time ainda nao tem maturidade minima em Terraform
- nao existe processo claro de revisao de mudanca
- o problema principal hoje e organizacao basica de IaC

Nesse caso, primeiro arrume fundacao (modulos, convencoes, pipelines), depois coloque MCP.

## Fechando

Para DevOps e Platform Engineer, o valor dessa combinacao e pragmatico:

- **Terraform** continua sendo o motor declarativo
- **MCP** organiza como ferramentas e agentes consomem contexto
- **Docker** entrega repetibilidade para rodar isso sem drama

Se a meta e reduzir friccao operacional e ganhar velocidade com controle, Terraform MCP Server com Docker e um passo bastante util.
  `,
  date: "2026-06-27",
  category: "Artigos",
  readTime: "9 min de leitura",
  tags: ["Terraform", "Docker", "DevOps", "Platform Engineering", "MCP"]
};
