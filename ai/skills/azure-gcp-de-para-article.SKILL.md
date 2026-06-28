# SKILL: De-Para Azure para GCP em Artigos

## Quando usar

- Criar artigo sobre recurso, servico ou arquitetura da Azure
- Atualizar artigo Azure ja existente para incluir comparativo multi-cloud
- Revisar texto tecnico para explicitar equivalencias Azure x GCP

## Quando nao usar

- Artigos que nao tratam de cloud
- Conteudos puramente opinativos sem parte tecnica
- Comparacoes que exigem benchmark formal sem dados reais

## Objetivo

Garantir que todo artigo sobre Azure inclua um de-para claro com GCP, destacando equivalencias reais, diferencas de comportamento e limites da comparacao.

## Embedded Resources (carregar antes de escrever)

- `ai/skills/article-authoring-site-context.SKILL.md` - formato editorial e estrutura `Article`
- `ai/mcp/source-of-truth-policy.md` - regras de acuracia e validacao de fontes
- `TECH_STACK.md` - contexto tecnico do projeto

## Regras obrigatorias

- Para cada recurso Azure citado como parte principal do artigo, mapear o equivalente na GCP
- Sempre sinalizar quando a equivalencia for parcial (nao afirmar paridade total)
- Explicar diferencas em pelo menos 3 dimensoes: operacao, precificacao e limites tecnicos
- Incluir links oficiais inline na primeira mencao de Azure e GCP
- Priorizar fonte primaria: documentacao oficial Azure e Google Cloud
- Evitar linguagem de marketing; focar em decisao tecnica e trade-offs

## Estrutura recomendada no artigo

1. Contexto do problema na Azure
2. Solucao na Azure (com exemplos)
3. Secao `## De-para Azure e GCP`
4. Diferencas praticas de implementacao
5. Riscos, lock-in e custos operacionais
6. Conclusao com criterio de escolha

## Template da secao De-Para

Use no corpo do artigo:

```md
## De-para Azure e GCP

| Cenario | Azure | GCP | Observacoes praticas |
|---|---|---|---|
| Compute serverless | Azure Functions | Cloud Functions | Diferencas de gatilhos, timeout, concorrencia e cold start |
| Containers gerenciados | Azure Container Apps | Cloud Run | Escala para zero, networking e observabilidade variam |
| Kubernetes gerenciado | Azure Kubernetes Service (AKS) | Google Kubernetes Engine (GKE) | Diferencas de modo autopilot/operacao e custo base |
| Mensageria | Azure Service Bus | Pub/Sub | Semantica de entrega, ordering e dead-letter diferem |
| Banco relacional gerenciado | Azure SQL Database | Cloud SQL | Recursos de HA, replicas e tuning diferem por engine |
| Observabilidade | Azure Monitor + Application Insights | Cloud Monitoring + Cloud Logging | Modelo de coleta e integracao mudam |
| Identidade e acesso | Microsoft Entra ID + RBAC | Cloud IAM | Escopo de permissoes e governanca diferem |
```

## Checklist de qualidade

- Existe secao explicita `De-para Azure e GCP`
- Todo servico Azure central no texto tem contraparte GCP ou justificativa de ausencia
- Cada linha do de-para indica se a equivalencia e total, parcial ou apenas aproximada
- Ha links oficiais para os servicos citados
- O texto descreve ao menos um risco de migracao ou lock-in

## Completion Hints

| campo | orientacao |
|-------|------------|
| category | prefira `Artigos` quando for comparativo tecnico aprofundado |
| tags | incluir `Azure`, `GCP`, `Cloud`, `Arquitetura`, alem do tema especifico |
| excerpt | mencionar explicitamente que o artigo traz de-para Azure x GCP |

## Observacoes de rigor tecnico

- Nao presumir equivalencia por nome de produto
- Se houver multiplas opcoes na GCP para um recurso Azure, listar a principal e citar alternativas
- Quando nao houver equivalente direto, declarar `sem equivalente direto` e sugerir composicao de servicos