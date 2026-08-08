import { Article } from '../types';

export const article: Article = {
  slug: "tdc-floripa-2026-devsecops",
  title: "Vibe Coding com DevSecOps: a IA gerou o site, mas a segurança do deploy foi MINHA - TDC Florianópolis 2026",
  excerpt: "Na Trilha Software Security do TDC Florianópolis 2026, contei como a IA gerou meu portfólio, mas quem garantiu que estivesse seguro em produção fui eu — uma jornada de vibe coding, Lovable, GitHub Copilot, Terraform e responsabilidade.",
  content: `
# TDC Florianópolis 2026 — Trilha Software Security

No dia **23 de julho de 2026**, junto com [**Jéssica Mello**](https://www.linkedin.com/in/jessica-tmello/) (LowOps Consultoria), palestrei na [**Trilha Software Security do TDC Florianópolis**](https://thedevconf.com/tdc/2026/florianopolis/trilha-software-security), um dos maiores eventos de tecnologia do Brasil, realizado no **CentroSul, em Florianópolis - SC**.

A trilha abordou um tema central: **"Construindo software seguro do design à produção em tempos de IA"** — explorando como a IA generativa acelera o desenvolvimento, mas também expande riscos e responsabilidades.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/tdc26/00.png)

[Leia o post de divulgação no LinkedIn](https://www.linkedin.com/posts/orafaelferreiraa_no-dia-23-de-julho-eu-e-a-j%C3%A9ssica-mello-activity-7478409858585747456-WSXT?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAiBr9cBknrEzJyFEqCS03tes6G6R1yclRw)

## Agenda

**Sessão:** Vibe Coding com DevSecOps: a IA gerou o site, mas a segurança do deploy foi MINHA

**Palestrantes:**
- Rafael Ferreira (Senior Azure Platform Engineer, Stefanini North America, Microsoft MVP)
- Jéssica Mello (LowOps Consultoria)

**Horário:** 14:10–14:45

**Resumo:** Um estudo de caso real sobre os limites e riscos do "vibe coding" quando confrontado com exigências reais de produção — e como DevSecOps resolve isso.

## Programação da Trilha Software Security

O dia foi repleto de conteúdo técnico de altíssimo nível:

- **10:30–11:05** | *Mobile 2026: O custo da compatibilidade e a nova era de exploits com IA* — Michel Anderson Lütz Teixeira (AI/R Company)
- **11:15–11:50** | *SecOps Autônomo: Automatizando Bumps de Dependência e Resolução de CVEs com IA em Pipelines Zero Trust* — Felipe Faria (Mindera)
- **11:55–12:30** | *Desenvolvimento seguro com IA: planejamento, revisão e Cross-Agent na prática* — Marcelo Martins (Unicred)
- **14:10–14:45** | *Vibe Coding com DevSecOps: a IA gerou o site, mas a segurança do deploy foi MINHA* — Rafael Ferreira & Jéssica Mello
- **14:50–15:25** | *Prompt Injection: um problema de segurança em LLMs* — Guilherme Luiz Maia Pinto (Fortress OS)
- **15:30–16:30** | *Painel: Da AppSec à AgentSec: quem garante a segurança quando a IA escreve, corrige, opera e decide?* — Georgia Maria Ferro Benetti, Rodrigo Diehl, Kalita da Silva, Gabriel Ferreira Ramos da Conceição
- **17:10–17:45** | *Eficiência em AppSec: Utilizando a IA para escalar Segurança em Aplicações* — Thiago Lotufo (Globo)
- **17:50–18:25** | *IA em produção é risco: como governar decisões automatizadas com segurança* — Wesley Souza (AdviceHealth)

## A Jornada: IA Escreve, Você Responde

### O Problema

Meu portfólio pessoal (\`orafaelferreira.com\`) estava obsoleto. Precisava modernizá-lo rápido, com estilo contemporâneo, mantendo foco em conteúdo (artigos, palestras, certificações). Tempo era um luxo que não tinha.

### O Prompt & o Lovable

Estruturei um prompt detalhado — estilo visual, seções esperadas (blog, palestras, sobre), stack preferido (React), tom de voz — e usei o [**Lovable**](https://lovable.dev/) para gerar **100% via IA generativa** uma primeira versão.

O resultado foi perfeito para um protótipo: um site one-page bonito, responsivo, rodando em produção em horas.

Mas aí vem o problema.

### A Crise do Vibe Coding em Produção

Quando saí do "protótipo legal" pra "arquitetura profissional", os clássicos apareceram:

- **Vendor lock-in:** o Lovable gerou código otimizado pra sua plataforma, não pra ser exportado e sustentado.
- **Custo insustentável:** hospedagem on-demand sendo cobrada por requisição.
- **Arquitetura monolítica:** one-page, tudo bundled junto, sem code-splitting, sem preocupação com assets.
- **Falta de padrão:** sem versionamento Git, sem pipeline, sem testes, sem "agora meu site quebrou em produção, e aí?".

Ficou claro: **a IA é excelente em acelerar, mas não entende responsabilidade.**

### Retomando o Controle

Exportei o código do Lovable pro [**GitHub**](https://github.com/orafaelferreiraa/orafaelferreira-com), e daí começou o trabalho real.

Refatorei com **[GitHub Copilot](https://github.com/features/copilot)** (que também gera código, mas agora *meu*, meu repositório, minhas decisões), adotei **GitFlow** completo, versionamento semântico, e transformei o "site bonito" em "sistema profissional":

- Separei conteúdo (TypeScript data files, não CMS) de apresentação.
- Estruturei componentes reutilizáveis.
- Implementei i18n (português + inglês).

### DevSecOps de Verdade

Agora veio a camada que diferencia um hobby de um sistema em produção:

**Infraestrutura 100% como código** via [**Terraform**](https://www.terraform.io/):
- [**Azure Static Web App**](https://learn.microsoft.com/en-us/azure/static-web-apps/) (distribuição global, HTTPS nativo, hosting seguro).
- DNS automatizado (apex + www) com validação de domínio.
- Tudo versionado, revisível, auditável.

**Pipeline de segurança** via [**GitHub Actions**](https://github.com/features/actions):
- **[tflint](https://github.com/terraform-linters/tflint)** — análise estática do Terraform.
- **[trivy](https://github.com/aquasecurity/trivy)** — scanning de vulnerabilidades em imagens e artefatos.
- **[checkov](https://www.checkov.io/)** — compliance & policy as code.
- Rodam tanto no \`terraform plan\` quanto no \`apply\` — sem passar, não deploya.

**Segredos sem hardcoding:**
- [**Service Principal**](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals) do Azure com mínimos privilégios.
- Secrets armazenados no GitHub (criptografados, nunca em logs de build).
- Rotação automática de credenciais.

**Resultado:** posso quebrar meu site à vontade — qualquer merge pra main passa por um gauntlet de checks, testes e validações. Se algo errado subir, ele bate em policy e não sai do passe.

### Stack Final & Qualidade

A evolução não parou em infraestrutura:

- **Frontend:** [**React 19**](https://react.dev/) + [**TypeScript**](https://www.typescriptlang.org/) + [**Vite**](https://vitejs.dev/) + [**TailwindCSS**](https://tailwindcss.com/) + [**shadcn/ui**](https://ui.shadcn.com/) (design system moderno, acessível).
- **Testes:** pirâmide completa — unit/integration com [**Vitest**](https://vitest.dev/) & [**React Testing Library**](https://testing-library.com/), E2E com [**Playwright**](https://playwright.dev/).
- **SEO tradicional + GEO:** structured data, meta tags, sitemaps, RSS — mas também otimizado pra "Generative Engine Optimization" (como LLMs descobrem conteúdo).

Tudo isso não seria possível se eu tivesse confiado 100% no "vibe coding" inicial.

## Os 4 C's do Cloud Native Security (Aplicados Aqui)

A estrutura clássica de segurança em cloud funciona em camadas:

1. **Cloud:** políticas de acesso, roles, networking (tudo Terraform, nada clicável em portal).
2. **Cluster/Infra:** Azure Static Web App é gerenciada, mas o Terraform valida config & compliance.
3. **Container:** Trivy verifica imagens; Checkov valida policies.
4. **Code:** GitHub Copilot ajuda, mas os testes garantem que o código faz o que deve.

Nenhuma camada é ignorada. Nenhuma depende só da IA.

## De "Prompt Engineer" a "Harness Engineer"

Quando você usa IA pra gerar código, a evolução natural é:

- **Fase 1:** Prompt Engineer — "escrever bons prompts" é o skill.
- **Fase 2:** Harness Engineer — "estruturar o loop IA + automação + feedback" é o skill.

Um harness engineer não só escreve prompts bons; ele:
- Define pipeline, testes, validações que a IA passa por.
- Entende quando a IA pode ir sozinha e quando não.
- Desenha feedback loops (errar, aprender, melhorar).
- Não confia na IA sozinha — a IA é aceleradora, não substituta.

Essa jornada do site foi aprender a ser um harness engineer, não só um prompt engineer.

## Checklist Prático: Do "Funcionando" ao "Seguro em Produção"

Aqui está o que você **não pode ignorar** depois que a IA gera algo funcional:

- **Segredos:** nunca hardcode. Use vaults, env vars, managed secrets.
- **Infraestrutura:** IaC (Terraform, CloudFormation, ARM) — nada de cliques em portal.
- **Testes:** unit, integration, E2E — a IA gera código, mas testes garantem que funciona *seu* caso de uso.
- **Scanning:** SAST (código), DAST (rodando), dependency checks, container scanning.
- **Logs & Monitoramento:** quem vai investigar incidente às 3 da manhã? Você. Logo, precisa de visibilidade.
- **Documentação:** a IA gera código rápido, mas documentação arquitetural é coisa de humano.
- **Código review:** até a IA merece code review.
- **Backup & Disaster Recovery:** quando der merda (e vai dar), você precisa de plano B.

## Lições da Jornada

1. **Um prompt bem estruturado bate tentativa e erro** — qualidade da entrada determina qualidade da saída.
2. **Unir IA + automação + cloud não é o futuro; é o presente** — mas exige T-shaped skills (rápido em amplitude, profundo em especialização).
3. **UX importa tanto quanto o produto** — design é decisão, não accident.
4. **A IA é o acelerador; você é o piloto** — profissional generalista (velocidade, vibe coding) precisa ser também especialista em T (DevOps, Terraform, Cloud, Security) pra sustentar o que a IA acelera.

E um thought final, polêmico: **se você não está gostando do seu trabalho, ou não está usando IA do jeito certo, ou está no emprego errado.**

## Slides da Apresentação

<i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:** [Vibe Coding com DevSecOps: a IA gerou o site, mas a segurança do deploy foi MINHA](https://stoblobcertificados011.blob.core.windows.net/palestras/tdcfloripa26.pdf)

## Repositórios

- [Repositório do Site](https://github.com/orafaelferreiraa/orafaelferreira-com) — código-fonte, Terraform, pipeline completa.

---

Participar do **TDC Florianópolis** na trilha de Software Security foi uma oportunidade incrível de conectar a jornada real com profissionais que enfrentam os mesmos desafios: **como usar IA pra ir rápido sem sacrificar segurança, qualidade e responsabilidade.**

Se você está mergulhando em vibe coding, generative AI, ou IA no deploy — as lições dessa jornada valem ouro.
`,
  date: "2026-07-23",
  category: "Palestras",
  readTime: "8 min de leitura",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/tdc26/00.png",
};
