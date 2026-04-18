# Prompt: Melhorias do site por auditoria

Faca uma auditoria do site e gere backlog de melhorias priorizadas.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| foco | string | true | Area da auditoria (ex: "SEO", "performance", "UX", "seguranca", "completo") |
| profundidade | enum: rapida, media, completa | false | Nivel de detalhe. Default: media |

## Embedded Resources

- `TECH_STACK.md` — inventario tecnico completo do projeto
- `README.md` — arquitetura, pipelines e deploy
- `ai/skills/site-improvement-backlog.SKILL.md` — framework de priorizacao P0-P3
- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa

## Validation

- foco deve ser uma area tecnica reconhecida, nao generico

## Tools invocados (sob demanda)

- **Context7** — quando avaliar dependencias ou bibliotecas
- **Microsoft Learn** — quando avaliar configuracoes Azure/SWA
- **GitHub** — quando comparar com padroes de mercado
- **Terraform** — quando avaliar infra

## Requisitos de execucao

1. Consultar MCPs quando depender de referencia externa
2. Classificar itens em P0/P1/P2/P3 conforme skill de backlog
3. Informar impacto, esforco e risco por item
4. Sugerir ordem de implementacao incremental

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "backlog": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "priority": { "type": "string", "enum": ["P0", "P1", "P2", "P3"] },
          "title": { "type": "string" },
          "impact": { "type": "string" },
          "effort": { "type": "string", "enum": ["baixo", "medio", "alto"] },
          "risk": { "type": "string" }
        }
      }
    },
    "execution_plan": { "type": "string", "description": "Fases de implementacao" }
  },
  "required": ["backlog", "execution_plan"]
}
```
