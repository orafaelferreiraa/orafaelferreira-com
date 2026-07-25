# AI Context Kit - orafaelferreira-com

Este diretorio centraliza skills, agentes e prompts para acelerar melhorias do site e producao de artigos com alta acuracia.

## Alinhamento com MCP (Model Context Protocol - Anthropic)

Todos os arquivos seguem as best practices do MCP spec:

- **Prompts** definem `Arguments` tipados (name, type, required, description) + `Output Schema`
- **Embedded Resources** sao declarados explicitamente e carregados antes da execucao
- **Validation** de argumentos e feita antes de processar
- **Tools MCP** sao declarados por nome real (ex: `mcp_io_github_ups_get-library-docs`)
- **Completion Hints** orientam valores validos para campos como category, readTime e slug

## Objetivos

- Padronizar criacao e revisao de artigos em `src/data/articles/*.ts`
- Garantir pesquisa confiavel antes de escrever (MCP first)
- Reutilizar contexto tecnico do projeto sem repetir briefing manual
- Manter agentes, prompts e skills alinhados com o pacote oficial da Microsoft quando houver encaixe real no projeto

## Fluxo recomendado

1. Escolher um prompt em `ai/prompts/`
2. O prompt carrega automaticamente seus **Embedded Resources** e aplica **Validation**
3. O prompt invoca **Tools MCP** na ordem declarada
4. Gerar/editar artigo no formato `Article` seguindo `ai/skills/article-authoring-site-context.SKILL.md`
5. Rodar validacao local (typecheck/testes) quando houver alteracao de codigo

## Fontes obrigatorias para acuracia

| MCP | Proposito |
|-----|-----------|
| Context7 | Docs e exemplos atualizados de bibliotecas |
| Microsoft Learn | Guias oficiais Microsoft/Azure |
| GitHub | Implementacoes reais e referencias de codigo |
| Terraform | Providers, recursos e versoes |

Ver detalhes em `ai/mcp/source-of-truth-policy.md`.

## Definicao de pronto para artigos

- Conteudo tecnicamente verificavel (com fontes)
- Linguagem em portugues clara e objetiva
- Estrutura pronta para uso no parser markdown do projeto
- Metadados coerentes (slug, excerpt, categoria, data, readTime)
- Valores seguindo Completion Hints da skill de authoring

## Estrutura complementar

- `ai/agents/` — agentes do projeto, incluindo o orquestrador `loop-engineer.agent.md`
- `ai/prompts/` — prompts de fluxo para pesquisa, auditoria e escrita
- `ai/skills/azure-gcp-de-para-article.SKILL.md` — garante secao de-para Azure x GCP em artigos cloud
- `.github/skills/` — skills oficiais reaproveitaveis para este repositorio (formato GitHub Copilot)
- `.claude/skills/` — as mesmas skills, portadas para o Claude Code
