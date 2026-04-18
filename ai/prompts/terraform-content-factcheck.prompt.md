# Prompt: Fact-check Terraform para artigos

Valide conteudo Terraform antes de publicar no blog.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| trecho | string | true | Bloco HCL ou comando Terraform a validar |
| provider | string | false | Provider alvo (ex: azurerm, aws, google). Default: inferido do trecho |
| versao_alvo | string | false | Versao especifica a validar (ex: "4.50.0") |

## Embedded Resources

- `infra/providers.tf` — versoes de provider usadas no projeto
- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa

## Validation

- trecho deve conter HCL valido ou comandos terraform
- se provider for informado, deve existir no Terraform Registry

## Tools invocados (ordem obrigatoria)

1. **Terraform** (`mcp_io_github_has`) — confirmar provider/resource, versoes e argumentos
2. **Context7** (`mcp_io_github_ups`) — docs atualizados e breaking changes
3. **Microsoft Learn** (`mcp_microsoftdocs`) — quando envolver Azure
4. **GitHub** (`mcp_io_github_git`) — exemplos reais e issues conhecidas

## Requisitos de execucao

1. Confirmar provider/resource/data source e versoes
2. Verificar argumentos obrigatorios vs opcionais
3. Apontar comandos potencialmente desatualizados
4. Cruzar docs oficiais e exemplos reais
5. Indicar versao minima recomendada para reproducao

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "line": { "type": "string" },
          "severity": { "type": "string", "enum": ["error", "warning", "info"] },
          "description": { "type": "string" },
          "fix": { "type": "string" }
        }
      }
    },
    "corrected_snippet": { "type": "string", "description": "Versao corrigida do trecho" },
    "compatibility_notes": { "type": "string" }
  },
  "required": ["issues", "corrected_snippet"]
}
```
