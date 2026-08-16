# 🚀 TECH_STACK - orafaelferreira-com

Inventário técnico do projeto `orafaelferreira-com`, baseado na análise dos arquivos de código, configuração, workflows e infraestrutura deste repositório.

## 📋 Índice

1. [Frontend & SPA](#frontend--spa)
2. [UI, Estilos e Design System](#ui-estilos-e-design-system)
3. [Roteamento, SEO, i18n e Conteúdo](#roteamento-seo-i18n-e-conteúdo)
4. [Testes e Qualidade](#testes-e-qualidade)
5. [Build, Tooling e Runtime](#build-tooling-e-runtime)
6. [CI/CD com GitHub Actions](#cicd-com-github-actions)
7. [Infraestrutura como Código (Terraform)](#infraestrutura-como-código-terraform)
8. [Cloud & Azure Services](#cloud--azure-services)
9. [Segurança, Configurações Web e Boas Práticas](#segurança-configurações-web-e-boas-práticas)
10. [Resumo Rápido](#resumo-rápido)

---

## Frontend & SPA

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **React** | `19.2.7` | SPA principal e composição de páginas/componentes |
| **React DOM** | `19.2.7` | Renderização via `createRoot` |
| **TypeScript** | `~6.0.3` | Tipagem do app e configs (`.ts/.tsx`) |
| **Vite** | `8.1.4` | Dev server, build e preview |
| **@vitejs/plugin-react-swc** | `4.3.1` | Transpilação React com SWC |
| **react-router** | `8.3.0` | Roteamento SPA com rotas lazy-loaded (pacote único desde a v7, substitui `react-router-dom`) |
| **lovable-tagger** | `1.3.1` | Plugin Vite dev-only que marca componentes; origem/integração com a plataforma Lovable.dev |

### Arquitetura de app
- SPA client-side com `BrowserRouter`.
- Code splitting com `React.lazy()` + `Suspense`.
- Alias de import `@/*` em `tsconfig` e `vite.config.ts`.
- Base path configurada como `/` para compatibilidade com Azure SWA.

---

## UI, Estilos e Design System

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **Tailwind CSS** | `4.3.2` | Styling utilitário principal |
| **@tailwindcss/postcss** | `4.3.2` | Integração Tailwind v4 com o pipeline PostCSS |
| **PostCSS** | `8.5.17` | Pipeline CSS |
| **Autoprefixer** | `10.5.2` | Prefixos cross-browser |
| **tailwindcss-animate** | `1.0.7` | Animações utilitárias |
| **@tailwindcss/typography** | `0.5.20` | Tipografia para conteúdo |
| **shadcn/ui** | config via `components.json` | Base de componentes reutilizáveis |
| **Radix UI** | múltiplos pacotes | Primitives acessíveis (`accordion`, `dialog`, `tabs`, etc.) |
| **class-variance-authority** | `0.7.1` | Variantes de componentes |
| **clsx** | `2.1.1` | Composição condicional de classes |
| **tailwind-merge** | `3.6.0` | Merge inteligente de classes Tailwind |
| **lucide-react** | `1.24.0` | Ícones |
| **react-icons** | `5.7.0` | Ícones adicionais (conjuntos além do lucide) |
| **sonner** | `2.0.7` | Toast notifications |
| **next-themes** | `0.4.6` | Suporte a tema |

### Fontes e tema
- Tokens de tema baseados em CSS variables (`hsl(var(--...))`).
- `darkMode: ["class"]`.
- Font families configuradas: `Inter`, `Poppins`, `JetBrains Mono`.

---

## Roteamento, SEO, i18n e Conteúdo

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **react-helmet-async** | `3.0.0` | SEO metadata por página |
| **i18next** | `26.3.6` | Internacionalização |
| **react-i18next** | `17.0.9` | Integração i18n com React |
| **i18next-browser-languagedetector** | `8.2.1` | Detecção de idioma (`querystring`, `localStorage`, `navigator`) |
| **Google Analytics (gtag)** | custom integration | Tracking de page view via `VITE_GA_MEASUREMENT_ID` |
| **Parser Markdown custom** | código próprio | Conversão Markdown → HTML no client |

### Estrutura de conteúdo
- `src/data/articles/artigos/` (~38 arquivos): artigos técnicos, incluídos no RSS.
- `src/data/articles/blog-posts/` (~50 arquivos): eventos, palestras e posts de comunidade, fora do RSS.
- Cada arquivo segue `YYYY-MM-DD-slug.ts` e exporta `{ article: Article }` (tipo em
  `src/data/articles/types.ts`); descoberta automática via `import.meta.glob` em
  `src/data/articles/index.ts`.
- Rotas de conteúdo e páginas institucionais carregadas lazy.
- Idiomas ativos: `pt-BR` (padrão) e `en`, em dois pares de dicionário mantidos manualmente:
  `src/i18n/locales/{en,pt-BR}.ts` (strings de UI) e `src/i18n/experiences/{en,pt-BR}.ts`
  (conteúdo de experiências/timeline).

---

## Testes e Qualidade

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **Vitest** | `4.1.10` | Testes unitários e de componente |
| **@testing-library/react** | `16.3.2` | Testes de componentes React |
| **@testing-library/jest-dom** | `6.9.1` | Matchers de DOM |
| **jsdom** | `29.1.1` | Ambiente de teste browser-like |
| **Playwright** | `1.61.1` | E2E (`smoke` e `i18n`) |
| **ESLint** | `10.7.0` | Linting |
| **typescript-eslint** | `8.63.0` | Regras TS no ESLint |
| **eslint-plugin-react-hooks** | `7.1.1` | Regras de hooks |
| **eslint-plugin-react-refresh** | `0.5.3` | Regras para Fast Refresh |
| **@eslint/js** + **globals** | `10.0.1` / `17.7.0` | Base de configuração lint |

### Estratégia de testes
- Unit tests: `npm run test:ci`.
- Component tests (config separada): `npm run test:components:ci`.
- E2E: `npm run test:e2e` (`test:e2e:ci` disponível) — funcional localmente, mas **desabilitado no
  CI** (passo comentado em `deploy-app.yml`).
- Pipeline de deploy executa unit + component + typecheck + build.

---

## Build, Tooling e Runtime

| Tecnologia | Versão/Canal | Uso no projeto |
|---|---|---|
| **Node.js** | `22` (CI) / `22+` (local) | Runtime de build e scripts (sem `engines` no `package.json` nem `.nvmrc` fixando localmente) |
| **npm** | lockfile `package-lock.json` | Gerenciamento de dependências |
| **SWC (via plugin Vite)** | transitivo | Build/transpile React |

### Scripts importantes
- `dev`, `build`, `preview`, `typecheck`.
- `sync:talks` (`scripts/sync-talks-and-events.mjs`) e `schedule:generate`
  (`scripts/generate-event-schedule.mjs`) — automação da agenda de palestras; `sync:talks` roda dentro
  do `build`, `schedule:generate` só é chamado pelo workflow `regenerate-event-schedule`.
- `rss:generate`, `sitemap:generate` — geram `public/rss.xml` e `public/sitemap.xml` +
  `public/articles-meta.json` a partir dos artigos.
- `test:ci`, `test:components:ci`, `test:e2e`, `test:e2e:ci`.

---

## CI/CD com GitHub Actions

### Workflows do repositório
| Workflow | Arquivo | Objetivo |
|---|---|---|
| **deploy-app** | `.github/workflows/deploy-app.yml` | Build, testes e deploy da SPA |
| **infra-plan** | `.github/workflows/infra-plan.yml` | Validação + `terraform plan` |
| **infra-apply** | `.github/workflows/infra-apply.yml` | Validação + `terraform apply` + docs |
| **sync-talks-on-event-day** | `.github/workflows/sync-talks-on-event-day.yml` | Dispara via `schedule` (cron auto-gerado), move talks passadas e atualiza a agenda; opcionalmente notifica Power Automate (`POWER_AUTOMATE_WEBHOOK_URL`); commit/push com `WORKFLOW_PAT` |
| **regenerate-event-schedule** | `.github/workflows/regenerate-event-schedule.yml` | Dispara em push a `Talks.tsx`/`generate-event-schedule.mjs` ou após o workflow acima rodar; regenera o cron de agendamento; commit/push com `WORKFLOW_PAT` |

### Actions utilizadas
| Action | Versão | Uso |
|---|---|---|
| `actions/checkout` | `v4` | Checkout do código |
| `actions/setup-node` | `v4` | Setup Node.js + cache npm |
| `Azure/static-web-apps-deploy` | `v1` | Deploy para Azure SWA |
| `hashicorp/setup-terraform` | `v3` | Setup Terraform |
| `actions/cache` | `v4` | Cache de providers Terraform |
| `actions/upload-artifact` | `v4` | Upload do `tfplan` |
| `actions/github-script` | `v7` | Comentário de plan em PR |
| `terraform-docs/gh-actions` | `v1.3.0` | Injeção de docs Terraform no README |

### Reusable workflow externo
- `orafaelferreiraa/pipeline-as-a-service-stack/.github/workflows/pipeline-core.yaml@main`
- Ferramentas habilitadas via flags:
  - `tflint`
  - `trivy`
  - `checkov`
  - `terraform-docs` (no apply)

---

## Infraestrutura como Código (Terraform)

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **Terraform Core** | `~> 1.14.0` | Provisionamento IaC |
| **Provider azurerm** | `4.50.0` | Recursos Azure |
| **Backend azurerm** | Azure Blob + Azure AD auth | State remoto |

### Estrutura `infra/`
- `providers.tf`: versões de Terraform/provider.
- `backend.tf`: backend remoto (`use_azuread_auth = true`).
- `variables.tf`: `repository_url`, `repository_branch`, `repository_token`.
- `main.tf`: recursos de SWA e domínio customizado.

### Recursos provisionados
- `data.azurerm_resource_group.rg` (RG existente).
- `azurerm_static_web_app` (`swa-site-orafael`, tier `Free`).
- `azurerm_static_web_app_custom_domain` (`www.orafaelferreira.com`, `dns-txt-token`).

---

## Cloud & Azure Services

| Serviço | Uso |
|---|---|
| **Azure Static Web Apps** | Hosting da SPA |
| **Azure Resource Group** | Agrupamento lógico dos recursos |
| **Azure Blob Storage** | Backend remoto do Terraform state |
| **Azure AD (Entra ID) auth** | Autenticação no backend Terraform (`use_azuread_auth`) |
| **Custom Domain + TLS gerenciado** | `www.orafaelferreira.com` com validação DNS TXT |

---

## Segurança, Configurações Web e Boas Práticas

### Headers e comportamento de rota (SWA)
Arquivo: `public/staticwebapp.config.json`
- SPA fallback para `/index.html`.
- Headers globais:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Cache-Control: public, max-age=3600`

### Segurança/qualidade na pipeline
- Scans de IaC: `trivy` + `checkov`.
- Lint de Terraform: `tflint`.
- Type safety no app: `tsc --noEmit`.
- Concurrency groups para evitar execuções paralelas concorrentes.

---

## Resumo Rápido

### Total de tecnologias
- **~58 tecnologias/ferramentas** listadas nas tabelas do documento.

### Stack principal
- **Frontend**: React 19 + TypeScript ~6.0 + Vite 8.
- **UI**: Tailwind v4 + shadcn/ui + Radix UI.
- **Conteúdo/SEO**: markdown custom + react-helmet-async + i18n (pt-BR/en).
- **Testes**: Vitest 4 + React Testing Library + Playwright 1.61 (E2E desabilitado no CI).
- **CI/CD**: GitHub Actions com deploy em Azure SWA + automação da agenda de palestras.
- **IaC**: Terraform + azurerm com state remoto em Azure Blob.

### Ferramentas recorrentes no dia a dia
- Node.js 22+, npm, ESLint, TypeScript, Terraform CLI, GitHub Actions.

---

> Documento gerado a partir da análise do repositório `orafaelferreira-com` (código-fonte + configs + workflows + Terraform).