# Source of Truth Policy (MCP)

Este arquivo e um **embedded resource** referenciado por todos os prompts e agents do kit.
Sempre que um prompt ou agent listar este arquivo em "Embedded Resources", ele deve ser carregado antes da execucao.

## Regra principal

Para qualquer artigo tecnico ou melhoria com dependencia externa, pesquisar primeiro e escrever depois.

## Tools MCP disponiveis

| MCP | tools principais | quando usar |
|-----|-----------------|-------------|
| Context7 | `mcp_io_github_ups_resolve-library-id`, `mcp_io_github_ups_get-library-docs` | Docs e exemplos de bibliotecas/frameworks |
| Microsoft Learn | `mcp_microsoftdocs_microsoft_docs_search`, `mcp_microsoftdocs_microsoft_docs_fetch`, `mcp_microsoftdocs_microsoft_code_sample_search` | Guias oficiais Microsoft/Azure |
| GitHub | `mcp_io_github_git_search_code`, `mcp_io_github_git_search_repositories`, `mcp_io_github_git_get_file_contents` | Implementacoes reais e padroes |
| Terraform | `mcp_io_github_has_search_providers`, `mcp_io_github_has_get_provider_details`, `mcp_io_github_has_get_latest_provider_version` | Providers, resources e versoes |

## Ordem de consulta recomendada

1. Context7
- Resolver biblioteca/produto
- Coletar API docs, exemplos e breaking changes

2. Microsoft Learn
- Validar recomendacoes oficiais Microsoft/Azure
- Confirmar limits, SKUs, procedimentos e seguranca

3. GitHub
- Buscar implementacoes reais e padroes de mercado
- Conferir activity recente e manutencao do repositorio

4. Terraform
- Confirmar provider/resource corretos
- Validar versao e argumentos aceitos

## Checklist de acuracia

- Nao afirmar recurso sem fonte tecnica recente
- Evitar comandos desatualizados
- Sinalizar trade-offs (custo, lock-in, operacao)
- Diferenciar claramente recomendacao oficial vs pratica de comunidade

## Saida padrao de pesquisa

- Tema pesquisado
- Fontes utilizadas (4 blocos: Context7, Learn, GitHub, Terraform)
- Conclusoes validadas
- Riscos e observacoes
- Material pronto para virar artigo/post

## Referenciado por

- `ai/prompts/new-article-from-topic.prompt.md`
- `ai/prompts/update-existing-article.prompt.md`
- `ai/prompts/site-improvement-from-audit.prompt.md`
- `ai/prompts/terraform-content-factcheck.prompt.md`
- `ai/skills/mcp-research-orchestrator.SKILL.md`
- `ai/agents/article-researcher.agent.md`
- `ai/agents/site-improvement.agent.md`
