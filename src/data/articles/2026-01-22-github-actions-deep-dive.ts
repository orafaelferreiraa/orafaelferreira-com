import { Article } from './types';

export const article: Article = {
  slug: "artigo-github-actions-deep-dive",
  title: "A Stack por trás do meu Blog: Pipelines CI/CD, Testes e Estratégias GitHub Actions",
  excerpt: "Um mergulho profundo nas estratégias e padrões avançados de GitHub Actions: desde arquitetura de workflows até otimização de cache, testes piramidais, segurança e observabilidade. Tudo baseado em casos reais de produção.",
  content: `# Introdução

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/01.png)

No [artigo anterior](https://www.orafaelferreira.com/artigo-terraform-infra-cicd), mostrei como estruturei a infraestrutura do blog com Terraform e GitHub Actions. Agora vamos seguir em frente e fazer um deep dive no GitHub Actions (Pipelines CI/CD).

Vou compartilhar estratégias de deploy, pull requests, conceitos de engenharia de platforma aplicadas na prática, otimizações de performance e práticas de segurança que apliquei.

## O que vamos ver:

- **Arquitetura de Workflows**: Overview das 3 pipelines (infra-plan, infra-deploy, deploy-app)
- **Estratégias de Branching**: trunk-based development aplicado na prática
- **Pirâmide de Testes**: unitários, componentes e E2E
- **Otimização de Performance**: caching de dependências e providers Terraform
- **Segurança em Pipelines**: tflint, tfsec, Checkov e gestão de secrets Azure
- **Job Summaries**: informações dos outputs após as execuções

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/02.png)

## 1. Arquitetura de Workflows

### 1.1 Organização e Nomenclatura

Uma das primeiras decisões que tomei foi: **como organizar as workflows**. Em projetos menores, tudo pode ficar em um único arquivo. Em projetos maiores, com a separação fica mais a manutenção e sua usabilidade.

**Estrutura atual do projeto:**

\`\`\`
.github/
  workflows/
    infra-plan.yml        # PR → Terraform plan + validações
    infra-apply.yml       # main → Terraform apply + docs
    deploy-app.yml        # main → build + testes + deploy
\`\`\`

### 1.2 Path Filters: Execute Apenas o Necessário

Uma otimização simples mas poderosa: **não rode workflows quando não há mudanças relevantes**.

**infra-plan.yml** (executa apenas em mudanças na infra):

\`\`\`yaml
on:
  pull_request:
    branches: [ main ]
    paths:
      - 'infra/**'
      - '.github/workflows/infra-plan.yml'
\`\`\`

**deploy-app.yml** (executa em mudanças no código da aplicação):

\`\`\`yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'e2e/**'
      - 'public/**'
      - 'index.html'
      - 'package.json'
      - 'package-lock.json'
      - 'bun.lockb'
      - 'tsconfig*.json'
      - 'vite.config.ts'
      - 'tailwind.config.ts'
      - 'postcss.config.js'
      - 'eslint.config.js'
      - '.github/workflows/deploy-app.yml'
\`\`\`

Se você só mexer no README, nenhum workflow roda.

### 1.3 Workflow Chaining: Infra → App

O **deploy-app.yml** tem um trigger com uma condition: aguarda a workflow **infra-apply** terminar com sucesso:

\`\`\`yaml
on:
  workflow_run:
    workflows: ["infra-apply"]
    types:
      - completed
    branches: [ main ]

jobs:
  build_and_deploy:
    if: github.event.workflow_run.conclusion == 'success'
\`\`\`

Se eu alterar algo na infraestrutura (Terraform) e o código do site ao mesmo tempo, a infra deve ser provisionada antes do deploy da app.

## 2. Estratégias de Branching e CI/CD

A estratégia de branching influencia diretamente **como seus workflows se comportam**.

### 2.1 Trunk-Based Development na Prática

**Abordagem implementada:**

\`\`\`
main (produção)
  ↑
feature branches ou commits diretos
\`\`\`

**Workflow por evento:**

**Pull Request → main** (infra-plan.yml):
\`\`\`yaml
on:
  pull_request:
    branches: [ main ]
    paths:
      - 'infra/**'
      - '.github/workflows/infra-plan.yml'
  workflow_dispatch:

jobs:
  terraform-plan:
    # Executa plan, validações, scans
    # Adiciona comentário do plan no PR
\`\`\`

**Push → main** (infra-apply.yml e deploy-app.yml):
\`\`\`yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'infra/**'
      - '.github/workflows/infra-apply.yml'
  workflow_dispatch:

jobs:
  terraform:         # infra-apply
  build_and_deploy:  # deploy-app
\`\`\`

**Proteção adicional**: o bot github-actions é bloqueado para evitar loops infinitos:

\`\`\`yaml
if: github.actor != 'github-actions[bot]'
\`\`\`

### 2.2 Concurrency Control

**Problema**: múltiplos pushes podem criar race conditions no deploy.

**Solução**: controle de concorrência

\`\`\`yaml
concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: true  # Cancela deploys anteriores
\`\`\`

Para infraestrutura (Terraform):

\`\`\`yaml
concurrency:
  group: infra-\${{ github.head_ref || github.ref }}
  cancel-in-progress: true  # Cancela runs anteriores
\`\`\`

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/03.png)

## 3. Pirâmide de Testes

\`\`\`


        /\\
       /  \\
      / E2E\\          ← Poucos, críticos
     /------\\
    /  API   \\        ← Médios, contratos
   /----------\\
  / Unit Tests \\       ← Base sólida
 /--------------\\

 
\`\`\`

### 3.1 Testes Unitários (Base)

**No projeto do blog:**

\`\`\`yaml
- name: Unit tests
  run: npm run test:ci
\`\`\`

\`\`\`json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
\`\`\`

**Configuração Vitest:**

\`\`\`typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
  },
});
\`\`\`

**Output no CI:**
- Output no job summary
- Falha se abaixo dos thresholds

### 3.2 Testes de Componente

**Objetivo**: validar UI isoladamente.

\`\`\`yaml
- name: Component tests
  run: npm run test:components:ci
\`\`\`

**React Testing Library + Vitest:**

\`\`\`typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('executa onClick quando clicado', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('renderiza variantes corretamente', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });
});
\`\`\`

**Configuração específica:**

\`\`\`typescript
// vitest.config.components.ts
export default defineConfig({
  test: {
    include: ['src/components/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
\`\`\`

### 3.3 Testes E2E

**Objetivo**: validar fluxos críticos de ponta a ponta.

\`\`\`yaml
- name: Get Playwright version
  id: playwright-version
  run: echo "version=$(npm list @playwright/test --depth=0 --json 2>/dev/null | jq -r '.dependencies["@playwright/test"].version // empty')" >> \$GITHUB_OUTPUT
  
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-\${{ runner.os }}-\${{ steps.playwright-version.outputs.version }}

- name: Install Playwright browsers
   if: steps.playwright-cache.outputs.cache-hit != 'true'
   run: npx playwright install --with-deps

- name: E2E smoke tests
   run: npm run test:e2e:ci
\`\`\`

**Testes smoke (cenários críticos):**

\`\`\`typescript
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rafael Ferreira/);
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('deve navegar para artigo e renderizar conteúdo', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Blog');
    await page.click('a:has-text("Terraform")').first();
    
    await expect(page).toHaveURL(/artigo-terraform/);
    await expect(page.locator('article')).toBeVisible();
  });
  
  test('deve alternar idioma', async ({ page }) => {
    await page.goto('/');
    const initialLang = await page.locator('html').getAttribute('lang');
    
    await page.click('[data-testid="language-toggle"]');
    
    const newLang = await page.locator('html').getAttribute('lang');
    expect(newLang).not.toBe(initialLang);
  });
});
\`\`\`

**Configuração Playwright:**

\`\`\`typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
\`\`\`

### 3.4 Paralelização de Testes

**Estratégia de matriz:**

\`\`\`yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - name: Run tests
      run: npm run test:ci -- --shard=\${{ matrix.shard }}/4
\`\`\`

**Para Playwright:**

\`\`\`yaml
e2e:
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      shardIndex: [1, 2, 3, 4]
      shardTotal: [4]
  steps:
    - name: Run E2E
      run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
\`\`\`

**Resultado**: redução de ~75% no tempo de execução.

## 4. Otimização de Performance

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/04.png)

### 4.1 Estratégias de Cache Avançadas

**Cache em camadas:**

\`\`\`yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
      ~/.cache/ms-playwright
    key: \${{ runner.os }}-deps-\${{ hashFiles('**/package-lock.json') }}-\${{ hashFiles('**/playwright.config.ts') }}
    restore-keys: |
      \${{ runner.os }}-deps-\${{ hashFiles('**/package-lock.json') }}-
      \${{ runner.os }}-deps-
\`\`\`

**Cache de build:**

\`\`\`yaml
- name: Cache build output
  uses: actions/cache@v4
  with:
    path: |
      .next/cache
      dist/
      .vite/
    key: build-\${{ runner.os }}-\${{ github.sha }}
    restore-keys: |
      build-\${{ runner.os }}-
\`\`\`

**Cache de Terraform providers:**

\`\`\`yaml
- name: Cache Terraform
  uses: actions/cache@v4
  with:
    path: |
      infra/.terraform
      ~/.terraform.d/plugin-cache
    key: terraform-\${{ runner.os }}-\${{ hashFiles('infra/.terraform.lock.hcl') }}
\`\`\`

### 4.2 Artifacts Estratégicos

**Quando usar artifacts vs cache:**

| Cache | Artifacts |
|-------|-----------|
| Dependências | Build outputs |
| Providers/plugins | Test reports |
| Ferramentas CLI | Deploy packages |
| Reutilização entre jobs | Transferência entre workflows |

**Exemplo otimizado:**

\`\`\`yaml
build:
  steps:
    - name: Build
      run: npm run build
    
    - name: Upload build
      uses: actions/upload-artifact@v4
      with:
        name: dist-\${{ github.sha }}
        path: dist/
        retention-days: 7
        if-no-files-found: error

deploy:
  needs: build
  steps:
    - name: Download build
      uses: actions/download-artifact@v4
      with:
        name: dist-\${{ github.sha }}
        path: dist/
\`\`\`

### 4.3 Job Conditionals Inteligentes

**Evite jobs desnecessários:**

\`\`\`yaml
deploy-docs:
  if: |
    github.event_name == 'push' &&
    github.ref == 'refs/heads/main' &&
    contains(github.event.head_commit.message, '[docs]')
\`\`\`

**Path filters:**

\`\`\`yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '!**/*.md'
\`\`\`

**Combinação com GitHub CLI:**

\`\`\`yaml
- name: Check for relevant changes
  id: changes
  run: |
    FILES=$(gh pr view \${{ github.event.pull_request.number }} \\
      --json files --jq '.files[].path')
    if echo "$FILES" | grep -E '^src/'; then
      echo "has-src-changes=true" >> $GITHUB_OUTPUT
    fi

- name: Run tests
  if: steps.changes.outputs.has-src-changes == 'true'
  run: npm test
\`\`\`

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/05.png)

## 5. Segurança nas Pipelines

### 5.1 A Pirâmide de Segurança em IaC

Assim como aplicações (unit → component → E2E), infraestrutura também precisa de validações em camadas:

| Camada | Ferramenta | Foco |
|--------|-----------|------|
| **Compliance** | Checkov | Policies CIS, PCI-DSS, HIPAA |
| **Segurança** | tfsec | Vulnerabilidades e misconfigurations |
| **Estilo** | TFLint | Boas práticas e sintaxe |

**Sincero?** Para um blog talvez não fosse necessário. Mas esse projeto é meu **lab vivo** - é aqui onde testo estratégias e aprendo antes de levar pra produção. Vale a pena pelos ~30s adicionados no deploy.

### 5.2 Implementação

**TFLint:**
\`\`\`yaml
- name: Setup TFLint
  uses: terraform-linters/setup-tflint@v4

- name: Cache TFLint plugins
  uses: actions/cache@v4
  with:
    path: ~/.tflint.d/plugins
    key: \${{ runner.os }}-tflint-\${{ hashFiles('infra/.tflint.hcl') }}

- name: Run TFLint
  run: tflint --init && tflint -f compact
\`\`\`

**tfsec:**
\`\`\`yaml
- name: tfsec scan
  uses: aquasecurity/tfsec-action@v1.0.3
  with:
    working_directory: infra
    soft_fail: false
\`\`\`

**Checkov:**
\`\`\`yaml
- name: Checkov scan
  uses: bridgecrewio/checkov-action@v12
  with:
    directory: infra
    soft_fail: false
\`\`\`

### 5.3 Gestão de Secrets

\`\`\`yaml
jobs:
  terraform:
    env:
      ARM_CLIENT_ID: \${{ secrets.AZURE_CLIENT_ID }}
      ARM_CLIENT_SECRET: \${{ secrets.AZURE_CLIENT_SECRET }}
      ARM_TENANT_ID: \${{ secrets.AZURE_TENANT_ID }}
      ARM_SUBSCRIPTION_ID: \${{ secrets.AZURE_SUBSCRIPTION_ID }}

deploy:
  steps:
    - name: Deploy to Azure Static Web Apps
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
\`\`\`

## 6. Job Summaries: Visibilidade Pós-Execução

### 6.1 Job Summary no deploy-app.yml

\`\`\`yaml
- name: Job summary
  if: always()
  run: |
    {
      echo "## 🚀 App Deploy Summary"
      echo ""
      echo "| Item | Value |"
      echo "|------|-------|"
      echo "| Event | \\\`\${{ github.event_name }}\\\` |"
      echo "| Branch | \\\`\${{ github.ref_name }}\\\` |"
      echo "| Actor | \\\`\${{ github.actor }}\\\` |"
      echo "| Commit | \\\`$(git rev-parse --short HEAD)\\\` |"
      echo ""
      echo "### 📦 Build Info"
      echo ""
      echo "| Metric | Value |"
      echo "|--------|-------|"
      echo "| Output | \\\`dist/\\\` |"
      echo "| Files | $(find dist -type f | wc -l) |"
      echo "| Size | $(du -sh dist | cut -f1) |"
      echo ""
      echo "### ✅ Deploy Status"
      echo ""
      echo "Application deployed to **Azure Static Web Apps**"
      echo ""
      echo "🌐 [View Application](https://www.orafaelferreira.com)"
    } >> "$GITHUB_STEP_SUMMARY"
\`\`\`

**Por que \`if: always()\`?**
- Roda mesmo se steps anteriores falharem
- Sempre tenho visibilidade do que aconteceu

### 6.2 Job Summary no infra-apply.yml

\`\`\`yaml
- name: Job summary
  if: always()
  run: |
    {
      echo "## Terraform Apply Summary";
      echo "";
      echo "| Item | Value |";
      echo "|------|-------|";
      echo "| Branch | \\\`\${{ github.ref_name }}\\\` |";
      echo "| Actor | \\\`\${{ github.actor }}\\\` |";
      echo "| Backend | \\\`stostateorafael/statetf/infra.terraform.tfstate\\\` |";
      echo "| Status | ✅ Applied |";
    } >> "$GITHUB_STEP_SUMMARY"
\`\`\`

**Benefício**: em vez de vasculhar logs, você vê um resumo direto na UI do Actions.

## 7. Deploy: Azure Static Web Apps

### 7.1 Deploy Direto para Produção

O deploy-app.yml faz um **deploy simples e direto** para o Azure Static Web Apps:

\`\`\`yaml
- name: Deploy to Azure Static Web Apps
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    action: 'upload'
    app_location: 'dist'
    skip_app_build: true  # Já fizemos build antes
\`\`\`

**Por que skip_app_build: true?**
- O build já foi executado antes (\`npm run build\`)
- Testes já rodaram (unitários e componentes)
- Apenas fazemos upload do \`dist/\` pronto

### 7.2 Fluxo Completo do Deploy

\`\`\`
1. Install deps (npm install)
   ↓
2. Unit tests (Vitest)
   ↓
3. Component tests (React Testing Library)
   ↓
4. Type check (tsc)
   ↓
5. Build (Vite)
   ↓
6. Deploy to Azure SWA
   ↓
7. Job Summary (métricas)
\`\`\`

**Tempo total**: ~3-5 minutos dependendo do cache

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/07.png)

## 8. Custos

### 8.1 Custo Zero para Repositórios Públicos

**GitHub Actions pricing:**
- **Public repos**: minutos ilimitados ✅
- Private repos: 2000 min/mês (free), depois $0.008/min

Como o blog é **público**, os custos são **zero**. Mas ainda assim está otimizado.

### 8.2 Timeouts: Proteção Contra Runs Travados

Todas as pipelines têm **timeout configurado**:

\`\`\`yaml
# infra-plan.yml
timeout-minutes: 25

# infra-apply.yml
timeout-minutes: 30

# deploy-app.yml
timeout-minutes: 20
\`\`\`

**Por quê?**
- Evita workflows travados consumindo hardware
- Falha rápida em caso de problemas em loop infinito

## 9. Workflow Dispatch: Triggers Manuais

### 9.1 Trigger Manual nas 3 Pipelines

Todas as 3 workflows suportam **trigger manual** via \`workflow_dispatch\`, permitindo execução sob demanda sem precisar fazer commits:

\`\`\`yaml
on:
  workflow_dispatch:
\`\`\`

**Como usar:**
1. Vá para GitHub Actions
2. Selecione o workflow desejado
3. Clique em "Run workflow"
4. Confirme a execução

## Conclusão

- **Arquitetura**: 3 workflows com responsabilidades segregadas
- **Path filters**: executa apenas quando necessário
- **Concurrency control**: evita race conditions
- **Testes**: pirâmide com unitários + componentes
- **Cache**: dependências npm, providers Terraform e plugins TFLint
- **Segurança**: TFLint + tfsec + Checkov validam código Terraform
- **Documentação**: terraform-docs auto-gera docs no README
- **Deploy**: direto para Azure SWA após validações
- **Job summaries**: métricas claras em cada execução
- **Workflow dispatch**: todas as 3 pipelines podem ser executadas manualmente

Não comecei com tudo isso, fui evoluindo conforme fui aprendendo coisas novas e implementando em um case real. 
Faça o mesmo, crie algum projeto pequeno pessoal, quebre, teste, aprenda, evolua!

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gh-deep-dipe/06.png)`,
  date: "2026-01-22",
  category: "Artigos",
  readTime: "15 min de leitura",
};
