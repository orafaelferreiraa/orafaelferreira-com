# Prompt: Code Review

Revise a alteracao ou trecho de codigo com foco em bugs, regressao, seguranca, performance e manutencao.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| alvo | string | true | Descricao do trecho, arquivo ou PR a revisar |
| foco | string | false | Area principal da revisao, como "frontend", "infra", "SEO" ou "completo" |
| profundidade | enum: rapida, media, completa | false | Nivel de detalhamento. Default: media |

## Regras

- Priorizar problemas concretos antes de resumo
- Apontar arquivos e linhas quando possivel
- Distinguir risco real de preferencia de estilo

## Saida esperada

- Findings ordenados por severidade
- Assumptions abertas
- Resumo curto do impacto