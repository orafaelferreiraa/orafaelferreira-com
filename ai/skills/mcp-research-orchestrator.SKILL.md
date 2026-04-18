# SKILL: MCP Research Orchestrator

## Quando usar

- Criacao de novos artigos tecnicos
- Atualizacao de artigos existentes com mudancas de stack
- Melhorias de site que dependem de referencia externa

## Objetivo

Produzir um pacote de pesquisa confiavel usando Context7 + Microsoft Learn + GitHub + Terraform antes de qualquer escrita.

## Embedded Resources (carregar antes de executar)

- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa e checklist de acuracia
- `TECH_STACK.md` — inventario tecnico para contextualizar pesquisa
- `src/data/articles/types.ts` — interface Article para alinhar saida

## Entradas (Arguments)

| name | type | required | description |
|------|------|----------|-------------|
| tema | string | true | Assunto principal a pesquisar |
| publico_alvo | string | true | Perfil tecnico do leitor |
| nivel | enum: iniciante, intermediario, avancado | false | Profundidade. Default: intermediario |
| escopo | enum: conceitual, tutorial, hands-on, comparativo | false | Formato esperado |

## Validation (antes de processar)

- tema nao pode ser vago ("cloud" sozinho nao serve; "Azure Container Apps com Dapr" serve)
- publico_alvo deve incluir nivel tecnico e area de atuacao

## Passos (com tools MCP explicitos)

1. **Context7** (`mcp_io_github_ups_resolve-library-id` + `mcp_io_github_ups_get-library-docs`)
   - Resolver biblioteca/produto
   - Levantar API, exemplos atuais e breaking changes

2. **Microsoft Learn** (`mcp_microsoftdocs_microsoft_docs_search` + `mcp_microsoftdocs_microsoft_docs_fetch`)
   - Confirmar guias oficiais e recomendacoes de arquitetura
   - Extrair boas praticas de seguranca e operacao

3. **GitHub** (`mcp_io_github_git_search_code` + `mcp_io_github_git_search_repositories`)
   - Buscar exemplos reais ativos
   - Coletar padroes de implementacao e pitfalls

4. **Terraform** (`mcp_io_github_has_search_providers` + `mcp_io_github_has_get_provider_details`)
   - Verificar provider/resource e parametros corretos
   - Validar versoes e comportamento esperado

5. **Consolidacao**
   - Produzir resumo tecnico objetivo
   - Listar riscos, limitacoes e opinioes separadamente de fatos
   - Validar que nenhuma afirmacao ficou sem fonte

## Formato de saida

- Resumo executivo (5-8 linhas)
- Evidencias organizadas por fonte (Context7 / Learn / GitHub / Terraform)
- Top 5 erros comuns a evitar
- Recomendacao final pronta para virar artigo
