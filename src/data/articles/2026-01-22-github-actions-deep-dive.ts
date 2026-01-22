import { Article } from './types';

export const article: Article = {
  slug: "artigo-github-actions-deep-dive",
  title: "A Stack por trás do meu Blog: Pipelines CI/CD, Testes e Estratégias GitHub Actions",
  excerpt: "Um mergulho profundo nas estratégias e padrões avançados de GitHub Actions: desde arquitetura de workflows até otimização de cache, testes piramidais, segurança e observabilidade. Tudo baseado em casos reais de produção.",
  content: `# Introdução

![]()

No [artigo anterior](https://www.orafaelferreira.com/artigo-terraform-infra-cicd), mostrei como estruturei a infraestrutura do blog com Terraform e GitHub Actions. Agora vamos um nível além: **como extrair o máximo do GitHub Actions em ambientes de produção**.

Este artigo é resultado de anos implementando pipelines DevOps em projetos reais. Vou compartilhar estratégias, padrões arquiteturais, otimizações de performance e práticas de segurança que apliquei — e as lições que aprendi no caminho.

## O que vamos cobrir

- **Arquitetura de Workflows**: organização, reuso e composição
- **Estratégias de Branching e CI/CD**: trunk-based, gitflow e seus impactos
- **Pirâmide de Testes**: da unidade ao E2E, com parallelização
- **Otimização de Performance**: caching avançado, matrizes e artifacts
- **Segurança em Pipelines**: OIDC, secrets, SBOM e scanning
- **Observabilidade**: métricas, alertas e debugging
- **Padrões de Deploy**: blue-green, canary e progressive rollout
- **Custos e Governance**: como não quebrar o banco

Ao final, você terá um arsenal de técnicas para construir pipelines robustos, rápidos e seguros.

---

## 1. Arquitetura de Workflows

### 1.1 Organização e Nomenclatura

Uma das primeiras decisões é **como organizar seus workflows**. Em projetos pequenos, tudo pode ficar em um único arquivo. Em projetos maiores, a separação por responsabilidade é essencial.

**Padrão que uso:**

\`\`\`
.github/
  workflows/
    infra-plan.yml        # PR → Terraform plan
    infra-deploy.yml      # main → Terraform apply
    deploy-app.yml        # PR/main → build + deploy
    test-unit.yml         # Testes unitários
    test-e2e.yml          # Testes E2E
    security-scan.yml     # Scans de segurança
    release.yml           # Criação de releases
\`\`\`

**Nomenclatura clara e consistente:**
- Prefixos por domínio: \`infra-*\`, \`deploy-*\`, \`test-*\`, \`security-*\`
- Sufixo indica ação: \`-plan\`, \`-deploy\`, \`-scan\`

### 1.2 Reusable Workflows

Um dos recursos mais poderosos do GitHub Actions: **workflows reutilizáveis**.

**Exemplo: workflow de build compartilhado**

\`\`\`yaml
# .github/workflows/reusable-build.yml
name: Reusable Build

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
      build-command:
        required: false
        type: string
        default: 'npm run build'
    outputs:
      artifact-name:
        description: "Nome do artifact gerado"
        value: \${{ jobs.build.outputs.artifact-name }}
    secrets:
      npm-token:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact-name: \${{ steps.upload.outputs.artifact-name }}
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: \${{ secrets.npm-token }}
      
      - name: Build
        run: \${{ inputs.build-command }}
      
      - name: Upload artifact
        id: upload
        uses: actions/upload-artifact@v4
        with:
          name: build-\${{ github.sha }}
          path: dist/
          retention-days: 7
\`\`\`

**Consumindo o workflow:**

\`\`\`yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '20'
      build-command: 'npm run build:staging'
    secrets:
      npm-token: \${{ secrets.NPM_TOKEN }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: \${{ needs.build.outputs.artifact-name }}
      # ... deploy steps
\`\`\`

**Benefícios:**
- **DRY**: evita duplicação de código
- **Consistência**: mesma lógica em todos os ambientes
- **Manutenibilidade**: uma mudança propaga para todos

### 1.3 Composite Actions

Quando a reutilização precisa ser ainda mais granular, **composite actions** são a resposta.

**Exemplo: ação para setup de ambiente Node.js**

\`\`\`yaml
# .github/actions/setup-node-env/action.yml
name: 'Setup Node Environment'
description: 'Configura Node.js com cache e instala dependências'

inputs:
  node-version:
    description: 'Versão do Node.js'
    required: true
    default: '20'
  
runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: 'npm'
    
    - name: Cache node_modules
      uses: actions/cache@v4
      with:
        path: node_modules
        key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
        restore-keys: npm-\${{ runner.os }}-
    
    - name: Install dependencies
      shell: bash
      run: |
        if [ ! -d "node_modules" ]; then
          npm ci
        fi
\`\`\`

**Uso:**

\`\`\`yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-node-env
    with:
      node-version: '20'
\`\`\`

---

## 2. Estratégias de Branching e CI/CD

A estratégia de branching influencia diretamente **como seus workflows se comportam**.

### 2.1 Trunk-Based Development

**Abordagem que uso no blog:**

\`\`\`
main (produção)
  ↑
feature branches (curta duração)
\`\`\`

**Workflows associados:**
- **PR → main**: executam validações, testes, scans
- **Push → main**: deploy automático para produção

**Vantagens:**
- Ciclos de feedback rápidos
- Menos merge conflicts
- Integração contínua genuína

**GitHub Actions pattern:**

\`\`\`yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  validate:
    if: github.event_name == 'pull_request'
    # ... validações
  
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    # ... deploy
\`\`\`

### 2.2 GitFlow Adaptado

Para projetos com múltiplos ambientes, GitFlow modificado pode fazer sentido:

\`\`\`
main (produção)
  ↑
release/* (staging)
  ↑
develop (desenvolvimento)
  ↑
feature/*
\`\`\`

**Workflows pattern:**

\`\`\`yaml
on:
  push:
    branches:
      - 'develop'
      - 'release/*'
      - 'main'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Determine environment
        id: env
        run: |
          if [[ "\${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          elif [[ "\${{ github.ref }}" =~ ^refs/heads/release/ ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
          else
            echo "environment=development" >> $GITHUB_OUTPUT
          fi
      
      - name: Deploy to \${{ steps.env.outputs.environment }}
        # ... deploy específico por ambiente
\`\`\`

### 2.3 Concurrency Control

**Problema**: múltiplos pushes podem criar race conditions no deploy.

**Solução**: controle de concorrência

\`\`\`yaml
concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: true  # Cancela deploys anteriores
\`\`\`

Para infraestrutura (Terraform), **nunca cancele runs simultâneos**:

\`\`\`yaml
concurrency:
  group: infra-\${{ github.head_ref || github.ref }}
  cancel-in-progress: false  # Evita state corruption
\`\`\`

---

## 3. Pirâmide de Testes

A pirâmide de testes guia **quanto investir em cada tipo de teste**.

\`\`\`
       /\\
      /E2E\\      ← Poucos, críticos
     /------\\
    /  API   \\    ← Médios, contratos
   /----------\\
  / Component  \\  ← Muitos, isolados
 /--------------\\
/   Unit Tests   \\ ← Base sólida
\`\`\`

### 3.1 Testes Unitários (Base)

**Objetivo**: velocidade e cobertura máxima.

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
- Cobertura visível no job summary
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

### 3.3 Testes E2E (Topo)

**Objetivo**: validar fluxos críticos de ponta a ponta.

**Playwright no projeto:**

\`\`\`yaml
- name: Get Playwright version
  id: playwright-version
  run: |
    echo "version=$(npm list @playwright/test --depth=0 --json | \\
      jq -r '.dependencies["@playwright/test"].version')" >> $GITHUB_OUTPUT

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

---

## 4. Otimização de Performance

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

---

## 5. Segurança em Pipelines

### 5.1 OIDC: Autenticação sem Secrets

**Problema**: secrets estáticos têm risco de vazamento.

**Solução**: OpenID Connect (OIDC) com Azure/AWS/GCP.

**Configuração Azure:**

\`\`\`yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login via OIDC
        uses: azure/login@v1
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
      
      - name: Deploy to Azure
        run: |
          az staticwebapp deploy \\
            --name swa-site-orafael \\
            --resource-group rg-site \\
            --app-location dist/
\`\`\`

**Benefícios:**
- Tokens de curta duração
- Auditoria via Azure AD
- Sem rotação manual

### 5.2 Gestão de Secrets

**Hierarquia de secrets:**

1. **Repository secrets**: específicos do repo
2. **Environment secrets**: por ambiente (staging/prod)
3. **Organization secrets**: compartilhados

**Pattern de uso:**

\`\`\`yaml
jobs:
  deploy-staging:
    environment: staging
    steps:
      - name: Deploy
        env:
          API_KEY: \${{ secrets.STAGING_API_KEY }}
\`\`\`

**Proteção de environments:**

- Required reviewers
- Wait timer
- Deployment branches

### 5.3 Dependency Scanning

**Dependabot configurado:**

\`\`\`yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "orafaelferreiraa"
    labels:
      - "dependencies"
      - "automerge"
  
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
\`\`\`

**Automerge seguro com Dependabot:**

\`\`\`yaml
# .github/workflows/dependabot-automerge.yml
name: Dependabot Auto-merge

on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  automerge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
      
      - name: Auto-merge minor/patch
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-minor' ||
          steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "\${{ github.event.pull_request.html_url }}"
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

### 5.4 Container Scanning

**Trivy para images Docker:**

\`\`\`yaml
- name: Build image
  run: docker build -t myapp:latest .

- name: Run Trivy scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:latest
    format: 'sarif'
    output: 'trivy-results.sarif'

- name: Upload to GitHub Security
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: 'trivy-results.sarif'
\`\`\`

### 5.5 SBOM Generation

**Software Bill of Materials para compliance:**

\`\`\`yaml
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    path: .
    format: spdx-json
    output-file: sbom.spdx.json

- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.spdx.json
\`\`\`

---

## 6. Observabilidade e Debugging

### 6.1 Job Summaries Enriquecidos

**Exemplo do projeto:**

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

### 6.2 Métricas e Timing

**Tracking de duração:**

\`\`\`yaml
- name: Record start time
  id: start
  run: echo "time=$(date +%s)" >> $GITHUB_OUTPUT

- name: Build
  run: npm run build

- name: Calculate build time
  run: |
    START=\${{ steps.start.outputs.time }}
    END=$(date +%s)
    DURATION=$((END - START))
    echo "Build took \${DURATION}s" >> $GITHUB_STEP_SUMMARY
\`\`\`

### 6.3 Debugging com tmate

**Acesso SSH ao runner em caso de falha:**

\`\`\`yaml
- name: Debug via SSH
  if: failure()
  uses: mxschmitt/action-tmate@v3
  with:
    limit-access-to-actor: true
    timeout-minutes: 15
\`\`\`

**Uso:**
1. Job falha
2. tmate inicia sessão SSH
3. Acesse via terminal para investigar
4. Continue ou cancele o job

### 6.4 Notificações Inteligentes

**Slack em caso de falha:**

\`\`\`yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "❌ Deploy failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Deploy failed on \`\${{ github.ref_name }}\`*\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|View logs>"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}
\`\`\`

---

## 7. Padrões de Deploy Avançados

### 7.1 Blue-Green Deployment

**Estratégia**: dois ambientes idênticos, troca de tráfego instantânea.

\`\`\`yaml
deploy:
  steps:
    - name: Deploy to green
      run: |
        az webapp deployment slot create \\
          --name myapp \\
          --resource-group rg-prod \\
          --slot green
        
        az webapp deployment source config-zip \\
          --name myapp \\
          --resource-group rg-prod \\
          --slot green \\
          --src dist.zip
    
    - name: Smoke test green
      run: |
        curl -f https://myapp-green.azurewebsites.net/health
    
    - name: Swap slots
      run: |
        az webapp deployment slot swap \\
          --name myapp \\
          --resource-group rg-prod \\
          --slot green \\
          --target-slot production
\`\`\`

### 7.2 Canary Release

**Estratégia**: deploy gradual com monitoramento.

\`\`\`yaml
deploy-canary:
  steps:
    - name: Deploy 10% traffic
      run: |
        kubectl set image deployment/myapp \\
          app=myapp:\${{ github.sha }}
        
        kubectl patch svc myapp -p '{"spec":{"selector":{"version":"canary"}}}'
        kubectl scale deployment/myapp-canary --replicas=1
    
    - name: Monitor for 5min
      run: |
        for i in {1..30}; do
          ERROR_RATE=$(curl -s http://prometheus/api/v1/query?query=error_rate | jq '.data.result[0].value[1]')
          if (( $(echo "$ERROR_RATE > 0.05" | bc -l) )); then
            echo "Error rate too high, rolling back"
            exit 1
          fi
          sleep 10
        done
    
    - name: Promote to 100%
      run: kubectl scale deployment/myapp-canary --replicas=10
\`\`\`

### 7.3 Progressive Rollout (Static Web Apps)

**Azure SWA com staging environments:**

\`\`\`yaml
deploy:
  steps:
    - name: Deploy to preview
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: \${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        action: 'upload'
        app_location: 'dist'
        deployment_environment: 'preview-\${{ github.event.pull_request.number }}'
    
    - name: Comment preview URL
      uses: actions/github-script@v7
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '🚀 Preview deployed: https://preview-\${{ github.event.pull_request.number }}.azurestaticapps.net'
          })
\`\`\`

---

## 8. Custos e Governance

### 8.1 Otimização de Custos

**GitHub Actions é pago após o tier gratuito:**
- Public repos: ilimitado
- Private repos: 2000 min/mês (free), depois $0.008/min

**Estratégias:**

1. **Self-hosted runners** para projetos intensivos
2. **Reduzir execuções desnecessárias** com path filters
3. **Cache agressivo** para diminuir tempo de build
4. **Paralelização inteligente**: mais jobs = mais custo

**Monitoramento:**

\`\`\`bash
gh api /orgs/{org}/settings/billing/actions
\`\`\`

### 8.2 Self-Hosted Runners

**Quando usar:**
- Workloads intensivos (builds grandes, ML)
- Requisitos de compliance (dados não podem sair do ambiente)
- Redução de custos em escala

**Setup básico:**

\`\`\`yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64]
    steps:
      # ... seu pipeline
\`\`\`

**Provisionamento via Terraform:**

\`\`\`terraform
resource "azurerm_container_instances" "runner" {
  name                = "github-runner"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  
  container {
    name   = "runner"
    image  = "myorg/github-runner:latest"
    cpu    = "2"
    memory = "4"
    
    environment_variables = {
      GITHUB_TOKEN     = var.github_token
      RUNNER_NAME      = "aci-runner-\${random_id.runner.hex}"
      RUNNER_WORKDIR   = "/work"
      LABELS           = "azure,linux,container"
    }
  }
}
\`\`\`

### 8.3 Governance e Compliance

**Rulesets (beta) para proteger workflows:**

\`\`\`yaml
# .github/rulesets/production.yml
name: Production Protection
enforcement: active
target: branch
conditions:
  ref_name:
    include: ["refs/heads/main"]
rules:
  - type: required_status_checks
    parameters:
      required_checks:
        - context: "build"
        - context: "test"
        - context: "security-scan"
  
  - type: required_deployments
    parameters:
      required_deployment_environments: ["production"]
\`\`\`

**Audit logs via API:**

\`\`\`bash
gh api /orgs/{org}/audit-log \\
  --jq '.[] | select(.action | startswith("workflows")) | {action, actor, repo}'
\`\`\`

---

## 9. Casos de Uso Avançados

### 9.1 Matrix Builds Complexas

**Build multi-plataforma:**

\`\`\`yaml
build:
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      node: [18, 20]
      exclude:
        - os: macos-latest
          node: 18
  runs-on: \${{ matrix.os }}
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node }}
    - run: npm test
\`\`\`

### 9.2 Dynamic Matrix Generation

**Gerar matriz baseado em mudanças:**

\`\`\`yaml
detect-changes:
  runs-on: ubuntu-latest
  outputs:
    matrix: \${{ steps.set-matrix.outputs.matrix }}
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Detect changed services
      id: set-matrix
      run: |
        CHANGED=$(git diff --name-only HEAD^ HEAD | \\
          grep '^services/' | \\
          cut -d/ -f2 | \\
          sort -u | \\
          jq -R -s -c 'split("\\n")[:-1]')
        echo "matrix={\"service\":$CHANGED}" >> $GITHUB_OUTPUT

test:
  needs: detect-changes
  strategy:
    matrix: \${{ fromJson(needs.detect-changes.outputs.matrix) }}
  runs-on: ubuntu-latest
  steps:
    - name: Test \${{ matrix.service }}
      run: npm test -- services/\${{ matrix.service }}
\`\`\`

### 9.3 Workflow Dispatch com Inputs

**Trigger manual com parâmetros:**

\`\`\`yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to deploy'
        required: true
        type: string
      dry-run:
        description: 'Dry run mode'
        required: false
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy \${{ inputs.version }} to \${{ inputs.environment }}
        run: |
          if [ "\${{ inputs.dry-run }}" = "true" ]; then
            echo "DRY RUN: would deploy \${{ inputs.version }}"
          else
            ./deploy.sh \${{ inputs.environment }} \${{ inputs.version }}
          fi
\`\`\`

---

## 10. Lições Aprendidas

### 10.1 Evite Over-Engineering

**Erro comum**: pipelines excessivamente complexos para projetos simples.

**Exemplo real**: inicialmente eu tinha 7 workflows separados. Consolidei para 3 e a manutenibilidade melhorou 10x.

**Regra de ouro**: comece simples, adicione complexidade quando necessário.

### 10.2 Fail Fast

**Ordene jobs por velocidade:**

\`\`\`yaml
jobs:
  lint:        # ~30s
  unit-test:   # ~2min
  build:       # ~5min
  e2e:         # ~10min
  deploy:      # ~3min
\`\`\`

Se o lint falha, economizamos 20 minutos.

### 10.3 Documente Decisões

**ADRs (Architecture Decision Records) no repo:**

\`\`\`markdown
# ADR-001: Trunk-Based Development

## Context
Precisávamos reduzir merge conflicts e acelerar feedback.

## Decision
Adotamos trunk-based dev com PRs curtos direto para main.

## Consequences
- ✅ Ciclos de feedback < 10min
- ✅ Menos conflitos
- ⚠️ Requer feature flags para trabalho em andamento
\`\`\`

### 10.4 Monitore Tendências

**Tracking de métricas ao longo do tempo:**
- Tempo médio de build
- Taxa de sucesso de deploys
- Cobertura de testes

**Ferramenta sugerida**: GitHub Insights + Datadog/Grafana.

---

## Conclusão

GitHub Actions é muito mais que "YAML que roda comandos". É uma plataforma completa para orquestrar ciclos DevOps modernos.

**Pontos-chave:**
- **Arquitetura**: reusable workflows e composite actions evitam duplicação
- **Testes**: pirâmide equilibrada com paralelização
- **Performance**: cache agressivo e artifacts estratégicos
- **Segurança**: OIDC, scanning, SBOM
- **Observabilidade**: summaries ricos e notificações inteligentes
- **Deploy**: blue-green, canary e progressive rollout
- **Custos**: otimização via path filters e self-hosted runners

O pipeline que construí para o blog é resultado de iterações, falhas e aprendizados. Não existe "melhor prática universal" — adapte às necessidades do seu projeto.

**Próximos passos sugeridos:**
1. Revise seus workflows atuais: há duplicação?
2. Implemente cache em camadas
3. Adicione job summaries informativos
4. Configure OIDC se estiver usando Azure/AWS
5. Experimente reusable workflows

E o mais importante: **meça, otimize, repita**.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png)`,
  date: "2026-01-22",
  category: "Artigos",
  readTime: "15 min de leitura",
  mediumUrl: "",
};
