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
| **React** | `18.3.1` | SPA principal e composição de páginas/componentes |
| **React DOM** | `18.3.1` | Renderização via `createRoot` |
| **TypeScript** | `5.8.3` | Tipagem do app e configs (`.ts/.tsx`) |
| **Vite** | `7.2.4` | Dev server, build e preview |
| **@vitejs/plugin-react-swc** | `3.11.0` | Transpilação React com SWC |
| **React Router DOM** | `6.30.1` | Roteamento SPA com rotas lazy-loaded |

### Arquitetura de app
- SPA client-side com `BrowserRouter`.
- Code splitting com `React.lazy()` + `Suspense`.
- Alias de import `@/*` em `tsconfig` e `vite.config.ts`.
- Base path configurada como `/` para compatibilidade com Azure SWA.

---

## UI, Estilos e Design System

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **Tailwind CSS** | `3.4.17` | Styling utilitário principal |
| **PostCSS** | `8.5.6` | Pipeline CSS |
| **Autoprefixer** | `10.4.21` | Prefixos cross-browser |
| **tailwindcss-animate** | `1.0.7` | Animações utilitárias |
| **@tailwindcss/typography** | `0.5.16` | Tipografia para conteúdo |
| **shadcn/ui** | config via `components.json` | Base de componentes reutilizáveis |
| **Radix UI** | múltiplos pacotes | Primitives acessíveis (`accordion`, `dialog`, `tabs`, etc.) |
| **class-variance-authority** | `0.7.1` | Variantes de componentes |
| **clsx** | `2.1.1` | Composição condicional de classes |
| **tailwind-merge** | `2.6.0` | Merge inteligente de classes Tailwind |
| **lucide-react** | `0.462.0` | Ícones |
| **sonner** | `1.7.4` | Toast notifications |
| **next-themes** | `0.3.0` | Suporte a tema |

### Fontes e tema
- Tokens de tema baseados em CSS variables (`hsl(var(--...))`).
- `darkMode: ["class"]`.
- Font families configuradas: `Inter`, `Poppins`, `JetBrains Mono`.

---

## Roteamento, SEO, i18n e Conteúdo

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **react-helmet-async** | `2.0.5` | SEO metadata por página |
| **i18next** | `25.6.0` | Internacionalização |
| **react-i18next** | `16.2.2` | Integração i18n com React |
| **i18next-browser-languagedetector** | `8.2.0` | Detecção de idioma (`querystring`, `localStorage`, `navigator`) |
| **Google Analytics (gtag)** | custom integration | Tracking de page view via `VITE_GA_MEASUREMENT_ID` |
| **Parser Markdown custom** | código próprio | Conversão Markdown → HTML no client |

### Estrutura de conteúdo
- Artigos em `src/data/articles/*.ts`.
- Rotas de conteúdo e páginas institucionais carregadas lazy.
- Idiomas ativos: `pt-BR` e `en`.

---

## Testes e Qualidade

| Tecnologia | Versão | Uso no projeto |
|---|---|---|
| **Vitest** | `4.0.13` | Testes unitários e de componente |
| **@testing-library/react** | `16.0.1` | Testes de componentes React |
| **@testing-library/jest-dom** | `6.6.3` | Matchers de DOM |
| **jsdom** | `24.1.3` | Ambiente de teste browser-like |
| **Playwright** | `1.56.1` | E2E (`smoke` e `i18n`) |
| **ESLint** | `9.32.0` | Linting |
| **typescript-eslint** | `8.38.0` | Regras TS no ESLint |
| **eslint-plugin-react-hooks** | `5.2.0` | Regras de hooks |
| **eslint-plugin-react-refresh** | `0.4.20` | Regras para Fast Refresh |
| **@eslint/js** + **globals** | `9.32.0` / `15.15.0` | Base de configuração lint |

### Estratégia de testes
- Unit tests: `npm run test:ci`.
- Component tests (config separada): `npm run test:components:ci`.
- E2E: `npm run test:e2e` (`test:e2e:ci` disponível).
- Pipeline de deploy executa unit + component + typecheck + build.

---

## Build, Tooling e Runtime

| Tecnologia | Versão/Canal | Uso no projeto |
|---|---|---|
| **Node.js** | `20` (CI) / `20+` (local) | Runtime de build e scripts |
| **npm** | lockfile `package-lock.json` | Gerenciamento de dependências |
| **Bun lockfile** | `bun.lockb` | Lockfile presente no repo |
| **SWC (via plugin Vite)** | transitivo | Build/transpile React |

### Scripts importantes
- `dev`, `build`, `preview`, `typecheck`.
- `test:ci`, `test:components:ci`, `test:e2e`, `test:e2e:ci`.

---

## CI/CD com GitHub Actions

### Workflows do repositório
| Workflow | Arquivo | Objetivo |
|---|---|---|
| **deploy-app** | `.github/workflows/deploy-app.yml` | Build, testes e deploy da SPA |
| **infra-plan** | `.github/workflows/infra-plan.yml` | Validação + `terraform plan` |
| **infra-apply** | `.github/workflows/infra-apply.yml` | Validação + `terraform apply` + docs |

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
- **55 tecnologias/ferramentas** listados nas tabelas do documento.

### Stack principal
- **Frontend**: React + TypeScript + Vite.
- **UI**: Tailwind + shadcn/ui + Radix UI.
- **Conteúdo/SEO**: markdown custom + react-helmet-async + i18n.
- **Testes**: Vitest + React Testing Library + Playwright.
- **CI/CD**: GitHub Actions com deploy em Azure SWA.
- **IaC**: Terraform + azurerm com state remoto em Azure Blob.

### Ferramentas recorrentes no dia a dia
- Node.js 20+, npm, ESLint, TypeScript, Terraform CLI, GitHub Actions.

---

> Documento gerado a partir da análise do repositório `orafaelferreira-com` (código-fonte + configs + workflows + Terraform).