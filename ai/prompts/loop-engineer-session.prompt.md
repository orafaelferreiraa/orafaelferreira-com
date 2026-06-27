# Prompt: Sessao multi-agent com Loop Engineer

Execute uma sessao multi-agent em ciclo curto para resolver um problema, melhorar uma area do site ou preparar uma entrega tecnica com validacao incremental.

## Arguments

| name | type | required | description |
|------|------|----------|-------------|
| objetivo | string | true | Resultado esperado da sessao, descrito de forma especifica |
| foco | string | true | Area principal do trabalho, como "SEO", "UX", "performance", "conteudo", "infra" ou "completo" |
| contexto | string | false | Informacoes adicionais, restricoes ou links relevantes |
| profundidade | enum: rapida, media, completa | false | Nivel de aprofundamento. Default: media |
| max_loops | integer | false | Numero maximo de iteracoes do ciclo. Default: 3 |
| criterio_aceite | string | false | Condicao objetiva para encerrar a sessao |

## Embedded Resources

- `ai/agents/loop-engineer.agent.md` — orquestrador da sessao
- `ai/agents/article-researcher.agent.md` — pesquisa tecnica
- `ai/agents/article-writer.agent.md` — escrita e consolidacao
- `ai/agents/site-improvement.agent.md` — backlog e priorizacao
- `ai/skills/mcp-research-orchestrator.SKILL.md` — pesquisa confiavel
- `ai/skills/site-improvement-backlog.SKILL.md` — framework de prioridade
- `ai/mcp/source-of-truth-policy.md` — politica de acuracia

## Validation

- objetivo deve ser especifico e executavel
- foco precisa ser uma area reconhecivel do site ou do fluxo tecnico
- max_loops deve ficar entre 1 e 5

## Ciclo multi-agent

1. **Loop Engineer**: decompor o objetivo em hipoteses e tarefas menores
2. **Article Researcher**: quando houver dependencia externa, reunir evidencias e fontes
3. **Site Improvement**: quando o tema for melhoria do site, priorizar impacto, risco e esforco
4. **Article Writer**: quando o tema for escrita ou consolidacao, transformar a pesquisa em saida pronta
5. **Loop Engineer**: comparar saida com o criterio de aceite, detectar lacunas e decidir o proximo loop

## Regras de execucao

1. Comecar pelo menor ciclo que possa falsificar a hipotese principal
2. Reusar o que ja foi validado em vez de repetir pesquisa
3. Cada iteracao deve terminar com uma decisao clara: aceitar, refinar ou encerrar com pendencia
4. Se o proximo loop nao trouxer ganho material, encerrar e relatar o melhor estado alcançado

## Output Schema

```json
{
  "type": "object",
  "properties": {
    "objective": { "type": "string" },
    "plan": { "type": "string" },
    "loop_log": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "loop": { "type": "integer" },
          "agent": { "type": "string" },
          "input": { "type": "string" },
          "result": { "type": "string" },
          "decision": { "type": "string" }
        },
        "required": ["loop", "agent", "input", "result", "decision"]
      }
    },
    "final_status": { "type": "string" },
    "open_items": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["objective", "plan", "loop_log", "final_status", "open_items"]
}
```