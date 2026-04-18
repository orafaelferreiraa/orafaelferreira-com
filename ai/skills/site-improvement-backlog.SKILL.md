# SKILL: Site Improvement Backlog

## Quando usar

- Evoluir UX, performance, SEO e confiabilidade do site
- Transformar ideias soltas em backlog executavel

## Objetivo

Priorizar melhorias com impacto real em experiencia, discoverability e manutencao.

## Embedded Resources (carregar no inicio)

- `TECH_STACK.md` — inventario tecnico do projeto
- `README.md` — arquitetura, deploy e pipelines
- `ai/mcp/source-of-truth-policy.md` — politica de pesquisa para validar recomendacoes

## Validation (antes de processar)

- foco da auditoria deve ser especifico (nao aceitar "tudo" sem direcao)
- recomendacoes com dependencia externa devem ser validadas com MCPs

## Criticidade

- P0: quebra funcional, regressao, impacto em deploy
- P1: SEO, acessibilidade, performance principal
- P2: melhorias incrementais de UX/conteudo
- P3: refinamentos visuais e tecnicos de baixo risco

## Dimensoes de analise

- Conteudo: clareza, consistencia, atualidade tecnica
- SEO: metadata, estrutura, snippets, linking
- Performance: tamanho de bundle, renderizacao, imagens
- DevEx: padroes de codigo, testes, pipelines

## Saida

- Lista priorizada de tarefas com schema: id, priority (P0-P3), title, impact, effort (baixo/medio/alto), risk
- Justificativa tecnica por item
- Plano de rollout incremental
- Criterio de aceite por item
