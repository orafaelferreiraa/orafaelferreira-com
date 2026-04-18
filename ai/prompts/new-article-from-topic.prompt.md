# Prompt: Novo artigo a partir de tema

Crie um artigo tecnico novo para meu site com base nos argumentos abaixo.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| tema | string | true | Assunto principal do artigo (ex: "Azure Container Apps com Dapr") |
| publico_alvo | string | true | Perfil do leitor (ex: "devs pleno/senior com experiencia em cloud") |
| objetivo | string | true | O que o leitor deve conseguir fazer apos ler |
| nivel | enum: iniciante, intermediario, avancado | false | Nivel tecnico do conteudo. Default: intermediario |
| escopo | enum: conceitual, tutorial, hands-on, comparativo, registro-evento | false | Formato do artigo. Default: hands-on |

## Embedded Resources (contexto obrigatorio)

- `src/data/articles/types.ts` — interface Article (slug, title, excerpt, content, date, category, readTime, image?, badges?)
- `src/lib/markdown.ts` — parser markdown do projeto (suporte: titulos, negrito, italico, listas, links, imagens, tabelas, blocos de codigo)
- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa MCP obrigatoria

## Validation (executar antes de processar)

- tema nao pode estar vazio
- publico_alvo deve descrever perfil tecnico
- objetivo deve ser acionavel ("entender", "implementar", "comparar")

## Tools invocados (ordem obrigatoria)

1. **Context7** (`mcp_io_github_ups`) — docs e exemplos atualizados da tecnologia
2. **Microsoft Learn** (`mcp_microsoftdocs`) — validacao oficial Microsoft/Azure
3. **GitHub** (`mcp_io_github_git`) — implementacoes reais e padroes de mercado
4. **Terraform** (`mcp_io_github_has`) — provider/resource/versionamento quando aplicavel

## Requisitos de execucao

1. Pesquisar e validar com os 4 MCPs acima ANTES de escrever
2. Trazer evidencias objetivas por fonte
3. Gerar arquivo no formato `Article` compativel com o parser markdown do projeto
4. Escrever em portugues do Brasil
5. Estruturar com foco pratico e aplicacao real
6. Incluir secoes de riscos, trade-offs e boas praticas

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "research_summary": { "type": "string", "description": "Resumo das evidencias coletadas por fonte" },
    "article_file": { "type": "string", "description": "Conteudo completo do arquivo .ts pronto para salvar" },
    "suggested_path": { "type": "string", "description": "Caminho sugerido: src/data/articles/AAAA-MM-DD-slug.ts" }
  },
  "required": ["research_summary", "article_file", "suggested_path"]
}
```
