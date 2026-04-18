# Prompt: Atualizar artigo existente

Atualize o artigo mantendo estilo e estrutura do site.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| arquivo_artigo | string | true | Caminho do arquivo (ex: src/data/articles/2026-02-27-codecon.ts) |
| objetivo_atualizacao | string | true | O que precisa mudar e por que |
| preservar_voz | boolean | false | Manter tom original do autor. Default: true |

## Embedded Resources

- `src/data/articles/types.ts` — interface Article
- `src/lib/markdown.ts` — parser markdown do projeto
- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa

## Validation

- arquivo_artigo deve existir no repositorio
- objetivo_atualizacao nao pode ser generico ("melhorar" sem especificar o que)

## Tools invocados

1. **Context7** — verificar versoes e exemplos atualizados
2. **Microsoft Learn** — validar recomendacoes oficiais
3. **GitHub** — conferir praticas atuais
4. **Terraform** — quando o artigo envolver IaC

## Requisitos de execucao

1. Validar tecnicamente com MCPs antes de editar
2. Preservar voz do autor e melhorar clareza
3. Atualizar trechos desatualizados e remover afirmacoes sem fonte
4. Revisar slug/excerpt/readTime se necessario
5. Entregar diff claro das mudancas

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "change_summary": { "type": "string", "description": "Resumo do que mudou e por que" },
    "updated_article": { "type": "string", "description": "Versao final do artigo" },
    "diff": { "type": "string", "description": "Diff legivel das alteracoes" }
  },
  "required": ["change_summary", "updated_article"]
}
```
