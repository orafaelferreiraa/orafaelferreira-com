# orafaelferreira-com (SPA)

Site pessoal/Blog em Vite + React + TypeScript, hospedado na Azure Static Web Apps (SWA) com CI/CD via GitHub Actions e infraestrutura em Terraform.

## stack

- Vite, React, TypeScript, TailwindCSS, shadcn/ui
- Azure Static Web Apps (SWA) para hosting
- Terraform (infra/) com state remoto em Azure Storage
- GitHub Actions: deploy do app e provisionamento da infra

## desenvolvimento local

Requisitos: Node.js 20+

```bash
sudo apt update
sudo apt install npm
```

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Geração de sitemap e metadados

O site gera automaticamente `public/sitemap.xml` e `public/articles-meta.json` baseado nos arquivos reais de artigos em `src/data/articles/*.ts`.

**Sitemap:**
- Inclui 9 páginas estáticas + todos os artigos dinâmicos
- Atualizado automaticamente durante `npm run build`
- URL: `https://www.orafaelferreira.com/sitemap.xml`

**Metadados de artigos:**
- JSON com slug, título, excerpto, imagem, data e URL de cada artigo
- Usado para renderização de OG tags e metadados SEO
- URL: `https://www.orafaelferreira.com/articles-meta.json`

Para regenerar manualmente:
```bash
npm run sitemap:generate
```

## RSS do blog

O site publica um feed RSS com as novidades do blog em `/rss.xml`.

O feed inclui apenas conteudo de artigos tecnicos e exclui posts de eventos, palestras e organizacao de comunidade.

- URL de assinatura: `https://www.orafaelferreira.com/rss.xml`

## deploy do app (SWA)

O deploy é automático no push para `main` quando arquivos do app mudam (`src/`, `public/`, `index.html`, configs) e também após a conclusão bem-sucedida do workflow `infra-apply` (via `workflow_run`). Workflow: `.github/workflows/deploy-app.yml`.

**Pipeline de deploy:**
- Build: `npm install` + `npm run test:ci` + `npm run test:components:ci` + `npm run typecheck` + `npm run build`
- Deploy: usa `Azure/static-web-apps-deploy@v1` com `action: upload`, `skip_app_build: true` e `app_location: dist`
- Não roda em PRs (somente em push e após infra-apply)

**Secrets necessários:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (deployment token do SWA)

## infraestrutura (Terraform)

Código em `infra/` provisiona:
- Resource Group
- Static Web App (SWA)

State remoto em Azure Storage (backend `azurerm`). Configure no `terraform init` com:

```bash
terraform init \
	-backend-config="resource_group_name=<rg-do-state>" \
	-backend-config="storage_account_name=<statename>" \
	-backend-config="container_name=tfstate" \
	-backend-config="key=infra.terraform.tfstate"
```

Execução local (Service Principal):

```bash
export ARM_CLIENT_ID=<appId-do-SP>
export ARM_CLIENT_SECRET=<clientSecret-do-SP>
export ARM_TENANT_ID=<tenantId>
export ARM_SUBSCRIPTION_ID=<subscriptionId>
export SWA_REPOSITORY_TOKEN=<github-PAT>
cd infra
terraform plan
terraform apply -auto-approve \
  -var "repository_url=https://github.com/<owner>/<repo>" \
  -var "repository_branch=main" \
  -var "repository_token=${SWA_REPOSITORY_TOKEN}"
cd -
```

### Pipelines de infraestrutura

**PR workflow** (`.github/workflows/infra-plan.yml`):
- Disparo: PRs que alteram `infra/**` ou o próprio workflow
- Passos: `init` → `fmt` → `validate` → `tflint` → `trivy` → `checkov` → `plan`
- Plan usa valores placeholder para `repository_*` (não requer secrets de GitHub)
- Artifact do plan é salvo e comentário detalhado é postado no PR
- Validações de segurança: Trivy e Checkov (`soft_fail: true` no core validation)

**Push workflow** (`.github/workflows/infra-apply.yml` - nome: `infra-apply`):
- Disparo: push em `main` que altera `infra/**` ou o próprio workflow
- Passos: `init` → `fmt` → `validate` → `tflint` → `trivy` → `checkov` → `apply`
- Apply usa valores reais via secrets (repository linkage)
- Documentação com `terraform-docs` é injetada no README e commitada automaticamente
- Resumo do job sem seção de outputs (removida para evitar ruído quando não definidos)

**Secrets necessários:**
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_CLIENT_SECRET` (Service Principal)
- `GH_PAT_SWA` (GitHub PAT para linkage do SWA com o repositório)

### Referência do módulo (auto)

O bloco abaixo é gerado automaticamente pelo `terraform-docs` a partir do conteúdo de `infra/`. Ele é atualizado em pushes para `main`.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | ~> 1.14.0 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | 4.50.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm.dns"></a> [azurerm.dns](#provider\_azurerm.dns) | 4.50.0 |
| <a name="provider_azurerm.site"></a> [azurerm.site](#provider\_azurerm.site) | 4.50.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_dns_a_record.apex](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/dns_a_record) | resource |
| [azurerm_dns_txt_record.apex_validation](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/dns_txt_record) | resource |
| [azurerm_static_web_app.this](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/static_web_app) | resource |
| [azurerm_static_web_app_custom_domain.apex](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/static_web_app_custom_domain) | resource |
| [azurerm_dns_zone.this](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/data-sources/dns_zone) | data source |
| [azurerm_resource_group.dns_rg](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/data-sources/resource_group) | data source |
| [azurerm_resource_group.rg](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/data-sources/resource_group) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_apex_domain_validation_token"></a> [apex\_domain\_validation\_token](#input\_apex\_domain\_validation\_token) | Token TXT de validacao do dominio apex gerado pelo Static Web App (Custom domains > Add > Generate code) | `string` | `""` | no |
| <a name="input_dns_subscription_id"></a> [dns\_subscription\_id](#input\_dns\_subscription\_id) | Subscription ID onde esta a zona DNS orafaelferreira.com | `string` | `""` | no |
| <a name="input_repository_branch"></a> [repository\_branch](#input\_repository\_branch) | Branch do repositório para linkage opcional do SWA | `string` | `""` | no |
| <a name="input_repository_token"></a> [repository\_token](#input\_repository\_token) | GitHub PAT para linkage opcional do SWA | `string` | `""` | no |
| <a name="input_repository_url"></a> [repository\_url](#input\_repository\_url) | GitHub repository URL para linkage opcional do SWA | `string` | `""` | no |
| <a name="input_site_subscription_id"></a> [site\_subscription\_id](#input\_site\_subscription\_id) | Subscription ID onde estao rg-site e a Static Web App | `string` | `""` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->

## domínios e HTTPS

O domínio customizado `www.orafaelferreira.com` são configurados via Terraform no SWA.

**TLS**: Certificados são provisionados e renovados automaticamente pelo Azure após validação DNS.

## notas

- Testes: CI roda unit tests (`vitest`), component tests (React Testing Library) e E2E (Playwright) para i18n e smoke.
- Lint no CI foi desabilitado para evitar ruído causado por conteúdo em markdown inline nos arquivos de artigos. O typecheck (TS) permanece ativo.
- A pasta `infra/` possui `.gitignore` próprio para evitar que `.terraform/`, `*.tfstate` e `*.tfplan` entrem em commits. O lockfile `.terraform.lock.hcl` é versionado.
- A pipeline de deploy usa `npm install` ao invés de `npm ci` para maior flexibilidade quando há atualizações de dependências.
- Workflows de infra e deploy são independentes mas coordenados: mudanças de infra triggam apply → deploy do app via `workflow_run`. Commits automáticos do `terraform-docs` (actor `github-actions[bot]`) não disparam o deploy do app (condição adicionada em `deploy-app.yml`).

## Diagrama Simples


```mermaid
graph LR
    subgraph "👨‍💻 Rafael escreve o código"
        Code["📝 Código do site (Artigo Novo)"]
    end

    subgraph "🔄 GitHub cuida do resto"
        GH["🐙 GitHub guarda o código"]
        CI["🤖 Robô automático testa e empacota)"]
    end

    subgraph "☁️ Azure hospeda o site"
        Azure["☁️ Microsoft Azure (servidor na nuvem)"]
        Domain["🌐 www.orafaelferreira.com"]
    end

    subgraph "📱 Visitante acessa"
        User["🧑 Você visitando o site"]
    end

    Code -->|"envia"| GH
    GH -->|"ativa"| CI
    CI -->|"publica"| Azure
    Azure -->|"responde em"| Domain
    User -->|"acessa"| Domain

    style Code fill:#3b82f6,color:#fff,stroke:#2563eb
    style GH fill:#333,color:#fff,stroke:#555
    style CI fill:#333,color:#fff,stroke:#555
    style Azure fill:#0078D4,color:#fff,stroke:#005a9e
    style Domain fill:#10b981,color:#fff,stroke:#059669
    style User fill:#8b5cf6,color:#fff,stroke:#7c3aed
```

## Arquitetura Técnica

> Seção para quem curte DevOps, IaC e CI/CD de verdade. Todos os diagramas abaixo refletem a implementação real do projeto.

### CI/CD Pipeline — GitHub Actions

3 workflows coordenados: `infra-plan` (PR), `infra-apply` (push main) e `deploy-app` (push main + workflow_run trigger). Concurrency groups evitam execuções paralelas. Commits do `github-actions[bot]` (terraform-docs) são ignorados para não gerar loop de deploy.

```mermaid
flowchart TB
    subgraph trigger["🎯 Triggers"]
        pr_infra["🔀 PR → main<br/><code>infra/**</code>"]
        push_infra["📌 push main<br/><code>infra/**</code>"]
        push_src["📦 push main<br/><code>src/ public/ index.html<br/>configs *.json *.ts</code>"]
        wf_dispatch["🖱️ workflow_dispatch<br/>(manual)"]
    end

    subgraph plan_wf["📋 infra-plan.yml"]
        direction TB
        plan_core["🔧 Pipeline Core Validation<br/><i>orafaelferreiraa/pipeline-as-a-service-stack</i>"]
        plan_core --> tflint_p["🔍 tflint"]
        tflint_p --> trivy_p["🛡️ trivy"]
        trivy_p --> checkov_p["✅ checkov"]
        checkov_p --> tf_plan["📝 terraform plan<br/><code>-out=tfplan</code>"]
        tf_plan --> plan_artifact["📤 Upload Artifact<br/><code>terraform-plan (7d)</code>"]
        tf_plan --> pr_comment["💬 PR Comment<br/><code>actions/github-script@v7</code>"]
    end

    subgraph apply_wf["🚀 infra-apply.yml"]
        direction TB
        apply_core["🔧 Pipeline Core Validation<br/><i>pipeline-as-a-service-stack</i>"]
        apply_core --> tflint_a["🔍 tflint"]
        tflint_a --> trivy_a["🛡️ trivy"]
        trivy_a --> checkov_a["✅ checkov"]
        checkov_a --> tf_apply["⚡ terraform apply<br/><code>-auto-approve</code>"]
        tf_apply --> tfdocs["📄 terraform-docs<br/><code>inject → README.md</code>"]
        tfdocs --> docs_commit["🤖 git commit + push<br/><code>github-actions[bot]</code>"]
    end

    subgraph deploy_wf["🌐 deploy-app.yml"]
        direction TB
        npm_install["📥 npm install"]
        npm_install --> unit["🧪 vitest --run<br/><code>unit tests</code>"]
        unit --> comp["🧩 vitest --run<br/><code>component tests<br/>vitest.config.components.ts</code>"]
        comp --> tsc["🔎 tsc --noEmit<br/><code>typecheck</code>"]
        tsc --> build["🏗️ vite build<br/><code>→ dist/</code>"]
        build --> e2e["🎭 Playwright E2E<br/><code>⚠️ disabled in CI</code>"]
        e2e --> swa_deploy["☁️ Azure/static-web-apps-deploy@v1<br/><code>action: upload<br/>skip_app_build: true<br/>app_location: dist</code>"]
    end

    subgraph azure["☁️ Azure Cloud"]
        direction TB
        swa["⚡ Azure Static Web App<br/><code>swa-site-orafael</code><br/>Free tier · eastus2"]
        rg["📁 Resource Group<br/><code>rg-site</code>"]
        blob["💾 Azure Blob Storage<br/><code>stostateorafael/statetf<br/>infra.terraform.tfstate</code><br/>Azure AD Auth"]
        dns["🌍 Custom Domain<br/><code>www.orafaelferreira.com</code><br/>TLS auto · DNS TXT validation"]
        swa --> dns
        rg --> swa
    end

    push_src --> deploy_wf
    wf_dispatch --> deploy_wf
    push_infra --> apply_wf
    pr_infra --> plan_wf
    plan_wf -->|"PR approved + merge"| apply_wf

    apply_wf --> deploy_wf
    tf_apply -->|"azurerm provider<br/>v4.50.0"| swa
    tf_apply -.->|"state read/write"| blob
    swa_deploy -->|"SWA deploy token"| swa

    e2e -.->|"currently disabled"| swa

    style push_src fill:#2563eb,color:#fff
    style push_infra fill:#7c3aed,color:#fff
    style pr_infra fill:#059669,color:#fff
    style wf_dispatch fill:#6b7280,color:#fff
    style plan_wf fill:#0d1117,color:#c9d1d9,stroke:#30363d
    style apply_wf fill:#0d1117,color:#c9d1d9,stroke:#30363d
    style deploy_wf fill:#0d1117,color:#c9d1d9,stroke:#30363d
    style azure fill:#0078D4,color:#fff,stroke:#005a9e
    style swa fill:#0078D4,color:#fff
    style blob fill:#0078D4,color:#fff
    style rg fill:#0078D4,color:#fff
    style dns fill:#10b981,color:#fff
    style e2e fill:#f59e0b,color:#000,stroke-dasharray: 5 5
```

### Application Architecture — SPA Stack

React 18 SPA com code splitting via `React.lazy()` + `Suspense`. Todas as 10 rotas são lazy-loaded. SEO via `react-helmet-async` (OG tags por página). i18n com detecção automática de idioma (`?lang=` → localStorage → navigator). Markdown dos artigos é renderizado client-side com parser custom.

```mermaid
flowchart TB
    subgraph client["🖥️ Browser · SPA · Client-Side"]
        direction TB
        entry["🚪 main.tsx<br/><code>ReactDOM.createRoot(#root)</code>"]
        entry --> app["⚛️ App.tsx<br/><code>HelmetProvider → BrowserRouter<br/>→ Suspense → Routes</code>"]
        
        app --> analytics_comp["📊 Analytics Component<br/><code>initGA + trackPageView<br/>VITE_GA_MEASUREMENT_ID</code>"]
        
        app --> routes

        subgraph routes["🗺️ React Router v6 · 10 Lazy Routes"]
            direction LR
            r1["🏠 / → Home"]
            r2["🎓 /mentoria-cloud-devops"]
            r3["📝 /blog"]
            r4["📄 /artigos/:slug"]
            r5["💼 /experiencias"]
            r6["🎤 /palestras"]
            r7["📜 /certificacoes"]
            r8["🏅 /certificados"]
            r9["🏆 /premiacoes"]
            r10["⭐ /recomendacoes"]
        end
    end

    subgraph stack["🛠️ Tech Stack"]
        direction LR
        vite["⚡ Vite 7<br/><code>@vitejs/plugin-react-swc<br/>port 8080 · base /</code>"]
        react["⚛️ React 18<br/><code>lazy() + Suspense<br/>code splitting</code>"]
        ts["🔷 TypeScript 5.8<br/><code>target ES2020<br/>moduleResolution bundler</code>"]
        tw["🎨 Tailwind 3.4<br/><code>darkMode class<br/>tailwindcss-animate</code>"]
        shadcn["🧱 shadcn/ui<br/><code>Radix primitives<br/>CVA + clsx + tw-merge</code>"]
    end

    subgraph i18n["🌍 i18next · Bilingual"]
        direction LR
        detector["🔎 LanguageDetector<br/><code>?lang= → localStorage<br/>→ navigator</code>"]
        ptbr["🇧🇷 pt-BR<br/><code>fallbackLng</code>"]
        en["🇺🇸 en"]
    end

    subgraph data["💾 Static Data Layer"]
        direction LR
        articles["📰 src/data/articles/*.ts<br/><code>~25+ posts · markdown strings<br/>→ custom HTML renderer</code>"]
        meta["🖼️ public/articles-meta.json<br/><code>OG image extraction</code>"]
        i18n_files["📂 src/i18n/locales/<br/><code>en.ts · pt-BR.ts<br/>experiences/en.ts · pt-BR.ts</code>"]
    end

    subgraph seo["🔍 SEO & Headers"]
        direction LR
        helmet["🪖 react-helmet-async<br/><code>per-page title · description<br/>OG tags · canonical URL</code>"]
        swa_config["⚙️ staticwebapp.config.json<br/><code>SPA fallback → /index.html<br/>X-Frame-Options: DENY<br/>X-Content-Type-Options: nosniff<br/>Cache-Control: 1h</code>"]
    end

    client --> stack
    client --> i18n
    client --> data
    client --> seo

    style client fill:#0d1117,color:#c9d1d9,stroke:#30363d
    style stack fill:#1a1a2e,color:#e0e0e0,stroke:#30363d
    style i18n fill:#1a1a2e,color:#e0e0e0,stroke:#30363d
    style data fill:#1a1a2e,color:#e0e0e0,stroke:#30363d
    style seo fill:#1a1a2e,color:#e0e0e0,stroke:#30363d
    style entry fill:#3b82f6,color:#fff
    style app fill:#3b82f6,color:#fff
    style analytics_comp fill:#f59e0b,color:#000
    style vite fill:#646cff,color:#fff
    style react fill:#61dafb,color:#000
    style ts fill:#3178c6,color:#fff
    style tw fill:#06b6d4,color:#fff
    style shadcn fill:#18181b,color:#fff
```

### Testing Pyramid

3 camadas: unit (Vitest), component (Vitest + React Testing Library, config separada) e E2E (Playwright com `vite preview` como webServer). E2E está desabilitado no CI mas funcional localmente.

```mermaid
flowchart TB
    subgraph pyramid["🔺 Testing Pyramid"]
        direction TB
        
        subgraph e2e_layer["🎭 E2E · Playwright 1.56"]
            e2e_config["⚙️ playwright.config.ts<br/><code>testDir: e2e/<br/>baseURL: localhost:4173<br/>webServer: vite preview --port=4173<br/>retries: 2 (CI) · trace: on-first-retry</code>"]
            e2e_specs["📝 e2e/smoke.spec.ts<br/>e2e/i18n.spec.ts"]
            e2e_status["⚠️ Disabled in CI pipeline<br/><code>commented out in deploy-app.yml</code>"]
        end

        subgraph comp_layer["🧩 Component · Vitest RTL"]
            comp_config["⚙️ vitest.config.components.ts<br/><code>include: src/components/**/*.test.*<br/>environment: jsdom<br/>setupFiles: src/setupTests.ts</code>"]
            comp_specs["📝 src/components/ui/button.test.tsx"]
            comp_cmd["▶️ <code>npm run test:components:ci<br/>→ vitest --run --config vitest.config.components.ts</code>"]
        end

        subgraph unit_layer["🧪 Unit · Vitest 4.0"]
            unit_config["⚙️ vite.config.ts → test block<br/><code>include: src/**/*.test.*<br/>environment: jsdom<br/>setupFiles: src/setupTests.ts</code>"]
            unit_specs["📝 src/lib/markdown.test.ts"]
            unit_cmd["▶️ <code>npm run test:ci<br/>→ vitest --run --reporter=dot</code>"]
        end
    end

    subgraph ci_order["⏩ CI Execution Order"]
        direction LR
        step1["1️⃣ Unit Tests"] --> step2["2️⃣ Component Tests"] --> step3["3️⃣ Typecheck<br/><code>tsc --noEmit</code>"] --> step4["4️⃣ Build<br/><code>vite build</code>"] --> step5["5️⃣ Deploy"]
    end

    pyramid --> ci_order

    style e2e_layer fill:#f59e0b,color:#000,stroke:#d97706,stroke-dasharray: 5 5
    style comp_layer fill:#3b82f6,color:#fff,stroke:#2563eb
    style unit_layer fill:#10b981,color:#fff,stroke:#059669
    style e2e_status fill:#ef4444,color:#fff
    style ci_order fill:#0d1117,color:#c9d1d9,stroke:#30363d
```

### Terraform Infrastructure — IaC

State remoto em Azure Blob Storage com Azure AD auth. Provider azurerm `4.50.0` pinado. Validação via reusable workflow externo (`pipeline-as-a-service-stack`) com tflint + trivy + checkov + terraform-docs. Custom domain com validação DNS TXT e TLS automático.

```mermaid
flowchart TB
    subgraph tf["🟣 Terraform ~> 1.14.0 · azurerm 4.50.0"]
        direction TB
        
        subgraph backend["💾 Backend · azurerm"]
            state["🗄️ Azure Blob Storage<br/><code>stostateorafael/statetf<br/>key: infra.terraform.tfstate<br/>use_azuread_auth: true</code>"]
        end

        subgraph vars["📋 Variables"]
            v1["🔗 repository_url<br/><code>string · default '' · GitHub repo URL</code>"]
            v2["🌿 repository_branch<br/><code>string · default '' · branch name</code>"]
            v3["🔑 repository_token<br/><code>string · sensitive · default ''<br/>GitHub PAT for SWA linkage</code>"]
        end

        subgraph resources["☁️ Resources"]
            data_rg["📁 data.azurerm_resource_group.rg<br/><code>name: rg-site</code>"]
            swa_res["⚡ azurerm_static_web_app"]
            domain["🌍 azurerm_static_web_app_custom_domain<br/><code>domain: www.orafaelferreira.com<br/>validation: dns-txt-token<br/>TLS: auto-provisioned</code>"]
        end

        data_rg --> swa_res
        swa_res --> domain
    end

    subgraph auth["🔐 Service Principal Auth"]
        direction LR
        arm_client["🆔 ARM_CLIENT_ID"]
        arm_secret["🔒 ARM_CLIENT_SECRET"]
        arm_tenant["🏢 ARM_TENANT_ID"]
        arm_sub["💰 ARM_SUBSCRIPTION_ID"]
        gh_pat["🔑 GH_PAT_SWA<br/><code>→ repository_token</code>"]
    end

    subgraph pipeline_svc["🔄 Pipeline-as-a-Service"]
        direction LR
        paas["🐙 orafaelferreiraa/<br/>pipeline-as-a-service-stack<br/><code>@main</code>"]
        paas_tflint["🔍 tflint ✓"]
        paas_trivy["🛡️ trivy ✓"]
        paas_checkov["✅ checkov ✓"]
        paas_docs["📄 terraform-docs ✓<br/><code>inject → README.md</code>"]
        paas --> paas_tflint & paas_trivy & paas_checkov & paas_docs
    end

    auth --> tf
    pipeline_svc -->|"reusable workflow"| tf

    style tf fill:#7B42BC,color:#fff,stroke:#5a2d91
    style backend fill:#0078D4,color:#fff
    style resources fill:#0078D4,color:#fff
    style vars fill:#7B42BC,color:#fff
    style auth fill:#333,color:#fff
    style pipeline_svc fill:#0d1117,color:#c9d1d9,stroke:#30363d
    style state fill:#0078D4,color:#fff
    style data_rg fill:#0078D4,color:#fff
    style swa_res fill:#0078D4,color:#fff
    style domain fill:#10b981,color:#fff
    style v1 fill:#7B42BC,color:#fff
    style v2 fill:#7B42BC,color:#fff
    style v3 fill:#7B42BC,color:#fff
    style arm_client fill:#333,color:#fff
    style arm_secret fill:#333,color:#fff
    style arm_tenant fill:#333,color:#fff
    style arm_sub fill:#333,color:#fff
    style gh_pat fill:#333,color:#fff
    style paas fill:#0d1117,color:#c9d1d9
    style paas_tflint fill:#0d1117,color:#c9d1d9
    style paas_trivy fill:#0d1117,color:#c9d1d9
    style paas_checkov fill:#0d1117,color:#c9d1d9
    style paas_docs fill:#0d1117,color:#c9d1d9
```
