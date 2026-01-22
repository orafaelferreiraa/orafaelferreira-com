import { Article } from './types';

export const article: Article = {
  slug: "platform-engineering-policy-as-code-governanca-invisivel",
  title: "Governança Invisível: Platform Engineering e Policy-as-Code que aceleram times",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gov-pac/cover.png",
  excerpt: "Uma visão agnóstica de cloud sobre como Platform Engineering e Policy-as-Code reduzem carga cognitiva, aumentam segurança e aceleram entregas.",
  content: `

Governança Invisível: Platform Engineering e Policy-as-Code que aceleram times

Resumo
Este artigo consolida e refina os dois rascunhos originais em uma visão única, prática e agnóstica de cloud. Mostro como Platform Engineering e Policy-as-Code (PaC) reduzem carga cognitiva, aumentam segurança e tornam a governança um acelerador — não um bloqueio.

1) Por que Platform Engineering agora
• O pêndulo saiu do “Silo de TI” para a autonomia extrema. Sem guardrails, surgem riscos sérios de custo, segurança e compliance.
• Platform Engineering (https://platformengineering.org/) cria “Golden Paths”: fazer o certo vira o caminho mais fácil, com automação, padronização e segurança embutidas.
• A plataforma é um produto: o desenvolvedor é o cliente; o objetivo é reduzir fricção de ponta a ponta e elevar o DevEx. Conceitos de Internal Developer Platforms (IDPs): https://internaldeveloperplatform.org/
• Leitura crítica recomendada: Martin Fowler – Platform Engineering: https://martinfowler.com/articles/platform-teams-stuff-done.html

2) O que é Policy-as-Code (PaC)
• PaC codifica regras de negócio, segurança e compliance como código executável, versionado e testável em Git.
• Benefícios: feedback imediato (IDE/CI), consistência entre ambientes, rastreabilidade GitOps e escala sem gargalos humanos.
• PaC é agnóstico: pode validar IaC (Terraform/Pulumi), Kubernetes (Admission Controllers) e APIs (autorização).
• Leitura recomendada: Policy-as-Code (PlatformEngineering.org): https://platformengineering.org/blog/policy-as-code

3) CAPOC: Compliance at the Point of Change
• Separação de responsabilidades:
  – Shift-left: o time executa scans e testes de políticas localmente e no CI.
  – Gate: a plataforma admite apenas mudanças conformes (staging/produção) com Admission Controllers.
• Resultado: menos retrabalho, menor MTTR de segurança, previsibilidade operacional e financeira.

4) Ecossistema agnóstico de políticas
• OPA/Rego: poderoso, ideal para multicloud e autorização de APIs (docs: https://www.openpolicyagent.org/docs; cursos: https://academy.styra.com/). CNCF: https://www.cncf.io/
• Kyverno/YAML: nativo Kubernetes, com mutações (remediação automática) e curva de aprendizado menor (exemplos: https://kyverno.io/policies/).
• Conftest/OPA: valida terraform plan, kubectl e manifests antes do apply.
• Nativas de nuvem (Azure Policy, AWS SCP/Config, GCP Org Policies): ótimas como enforcement final sem acoplar lógica de negócio.

5) Fluxo DevEx com governança sem atrito
• IDE: plugins de IaC apontam violação (tags, regiões, tipos de disco) “o quanto antes”.
• CI: job “pac-test” barra PRs fora do padrão com mensagens claras e acionáveis.
• Admission Controllers: impedem deploys incorretos; mutações podem corrigir automaticamente.
• Runtime: auditoria contínua e drift detection mantêm conformidade e visibilidade.

6) Exemplos práticos (média complexidade)
6.1) Rego (OPA) – Regiões permitidas e tagging obrigatória
package platform.regions

default allow = false

allowed_regions = {"eastus", "brazilsouth", "westeurope"}

deny[msg] {
  input.location
  not input.location in allowed_regions
  msg := sprintf("Região %s não permitida por compliance.", [input.location])
}

deny[msg] {
  not input.tags.owner
  msg := "Tag obrigatória 'owner' ausente."
}

allow {
  input.location in allowed_regions
  input.tags.owner
}

Uso: conftest test plan.json antes do terraform apply.

6.2) Kyverno – Assinatura de imagem e mutação de labels
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: enforce-signed-images-and-labels
spec:
  validationFailureAction: Enforce
  rules:
    - name: require-signed-images
      match:
        resources:
          kinds: [Pod]
      verifyImages:
        - imageReferences: ["ghcr.io/empresa/*"]
          attestations:
            - type: cosign  
              keyless: true
    - name: add-owner-label
      match:
        resources:
          kinds: [Deployment]
      mutate:
        patchStrategicMerge:
          metadata:
            labels:
              owner: "platform"

7) FinOps por design
• Tags obrigatórias (owner, costCenter, env) e SKUs/quotas por ambiente evitam custos indevidos (FinOps Foundation: https://www.finops.org/).
• Janelas de desligamento automático para dev/sandbox e limites por time/produto.
• Orçamentos e alertas integrados ao pipeline para fail‑fast financeiro.

8) Portal do Desenvolvedor e DX
• Erros de política devem ser humanos e prescritivos: explique o que falhou e como corrigir.
• Integre documentação e “como fazer certo” no Backstage (https://backstage.io/) ou portal similar.
• Golden Paths: templates e geradores já com tags, redes e SKUs válidos.

9) Estratégia de rollout saudável
• Audit → Warn → Enforce → Remediate (comunicação ativa entre fases).
• Comece com quick wins (tags e regiões) e evolua para políticas críticas.
• Colete dados antes de endurecer: impacto, equipes afetadas, velocidade de correção.

10) Métricas que importam
• Time‑to‑Feedback de política (IDE/CI em segundos). DORA Metrics: https://cloud.google.com/devops
• % de conformidade por ambiente/equipe.
• Incidentes evitados (deploys negados por violações críticas).
• Redução de gastos indevidos e riscos de não‑conformidade.

Nota organizacional: Team Topologies para estrutura de times e interação plataforma/stream-aligned: https://teamtopologies.com/

11) Anti‑padrões comuns
• “Bloquear tudo no dia 1”: incentiva bypass e quebra confiança.
• Mensagens crípticas: “Policy Failed” sem contexto não ajuda ninguém.
• Acoplamento a uma única nuvem/ferramenta: reduz portabilidade e aumenta retrabalho.

12) Plano 30–60–90 dias
• 30: inventário de políticas, modo Audit, mensagens claras, primeiros Golden Paths.
• 60: CI com “pac-test”, Admission em staging, dashboards de conformidade.
• 90: Enforce em produção para políticas críticas, mutações automáticas, metas de SLO.

13) FAQ rápido
• PaC atrasa entregas? Não. Antecipar feedback reduz retrabalho e acelera merges.
• Rego é difícil? Comece por Kyverno/YAML e evolua conforme maturidade.
• Abandono políticas nativas da nuvem? Não. Use-as como enforcement final.

Conclusão
Platform Engineering e Policy‑as‑Code tornam governança invisível e produtiva. Quando o caminho certo é o mais fácil, times entregam com mais velocidade, segurança e previsibilidade — sem “time do não”, com mentoria automatizada. Menos carga cognitiva, menos risco, mais foco no que importa: código que gera valor.

Próximos passos sugeridos
• Comece em modo Audit com tags obrigatórias e regiões permitidas.
• Pilote um Golden Path com CI + Admission em staging.
• Meça time‑to‑feedback e conformidade; endureça onde fizer sentido.

`,
  date: "2026-01-21",
  category: "Artigos",
  readTime: "18–22 min de leitura",
  mediumUrl: ""
};
