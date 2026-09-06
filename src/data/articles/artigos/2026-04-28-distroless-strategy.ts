import type { Article } from '../types';

export const article: Article = {
  slug: "docker-python-distroless-kubernetes",
  title: "Imagens de contêiners Python no Kubernetes: comparação técnica e estratégia com Distroless",
  excerpt:
    "Comparação prática entre imagens de contêiners Python (slim, alpine e distroless) e como aplicar técnicas com foco em segurança e workloads no Kubernetes.",
  content: `

![Imagens de contêiner Python distroless no Kubernetes](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/distroless/1.png)

Vamos explorar estratégias multi-stage build com imagens de contêiner distroless para workloads Python no Kubernetes, criando soluções da vida real.

## O que é distroless

Imagens distroless contêm **apenas** o runtime da linguagem e suas dependências mínimas. Não incluem:

- **Shell** (bash, sh): não é possível abrir um terminal no container para debug
- **Package managers** (apt, yum, pip)
- **Utilitários do sistema** (curl, wget, vi, ls, cat)
- **Usuário root** (na variante \`-nonroot\`, roda como UID 65534). ALTO RISCO DE SEGURANÇA.

Exemplo de família de imagens distroless (valores anonimizados para referência arquitetural):

\`\`\`dockerfile
mcr.microsoft.com/azurelinux/distroless/python:3.12          # root
mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot  # non-root (recomendado)
mcr.microsoft.com/azurelinux/distroless/debug/python:3.12    # com shell (debug only)
\`\`\`

**Nota:** a variante \`debug\` inclui um shell busybox e serve para troubleshooting temporário. NÃO deve ser usada em produção.

Criei uma solução e botei para rodar no Kubernetes, um script básico em Python para consumir uma API REST e disparar notificações, rodando menos de 5 segundos, uma vez por dia.

Durante a jornada, fiz um benchmark de imagens base para comparar seus tamanho, segurança e operação. A implementação final do workload foi feita com \`mcr.microsoft.com/azurelinux/base/python:3.12\` no estágio de build e \`mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot\` no runtime.

## Comparação das imagens consultadas

| Imagem | Tamanho | CVEs | Shell | Package Manager | Non-root |
|--------|---------|------|-------|------------------|----------|
| \`python:3.12-slim\` (Debian) | ~150MB | Médio-alto (Debian libs) | Sim | apt | Não (root) |
| \`python:3.12-alpine\` | ~50MB | Baixo | Sim | apk | Não (root) |
| \`registry.example.com/containeres/python-build:3.12\` | ~100MB | Baixo | Sim | tdnf | Não (root) |
| \`registry.example.com/containeres/python-runtime-distroless:3.12-nonroot\` | ~30MB | Mínimo | Não | Não | Sim |

![Comparação de tamanho e CVEs entre imagens Python slim, alpine e distroless](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/distroless/2.png)

**OBS:** a quantidade/severidade de CVEs varia conforme data do scan, base de vulnerabilidades e versão exata da imagem.

## O "problema"

Mesmo imagens otimizadas para runtime geral ainda podem incluir componentes que não são necessários para workloads curtos, por exemplo Jobs/CronJobs:

- Shell (\`bash\`, \`sh\`)
- Package manager (\`apt\`, \`dpkg\`)
- Utilitários como \`curl\`, \`wget\` e \`find\`
- Usuário root por padrão

Obviamente quando estamos criando, precisamos de certas ferramentas para desenvolvimento e depuração. Finalizado o desenvolvimento e testes, podemos e devemos enxugar a imagem. Para um container que executa um script e termina, nada disso é necessário. Cada binário extra também amplia a superfície de possíveis ataques.

## A engenharia entrando em ação: multi-stage build + distroless

A estratégia de separar **build** e **runtime** em dois estágios:

\`\`\`dockerfile
# Stage 1: Build - instala dependências
FROM mcr.microsoft.com/azurelinux/base/python:3.12 AS build

WORKDIR /aplicativos
COPY requirements-ex.txt .
RUN pip install --no-cache-dir --target=/aplicativos/deps -r requirements-ex.txt

# Stage 2: Runtime - distroless (sem shell, sem package manager, non-root)
FROM mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot

WORKDIR /aplicativos
COPY --from=build /aplicativos/deps /aplicativos/deps
COPY worker_alertas.py .

ENV PYTHONPATH=/aplicativos/deps
ENTRYPOINT ["python3", "exemplo.py"]
\`\`\`

**Resultado:** runtime rodando no mínimo com distroless non-root, menor superfície de ataque e operação mais previsível para Jobs/CronJobs.

| Estágio | O que tem | O que NÃO tem |
|---------|-----------|----------------|
| **Build** (\`python-build:3.12\`) | pip, compiladores, headers; tudo para instalar pacotes | Não vai para a imagem final |
| **Runtime** (\`python-runtime-distroless:3.12-nonroot\`) | Python runtime, glibc, CA certs | Sem shell, sem pip, sem apt, sem binários extras |

O \`--target=/aplicativos/deps\` instala dependências em um diretório isolado, que é copiado para o segundo estágio. O \`PYTHONPATH\` aponta para esse diretório.

## Pontos de atenção na hora de desenvolver uma solução distroless do zero!

### 1. Logs

Falando de código e testes, sem \`stream=sys.stdout\` no \`logging.basicConfig()\`, os logs iam para \`stderr\` e, em alguns cenários de CronJob, não apareciam no \`kubectl logs\`:

\`\`\`python
# Logs podem não aparecer
logging.basicConfig(level=logging.INFO)

# Garante stdout
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    stream=sys.stdout,
)
\`\`\`

### 2. Erros em variáveis de ambiente

Sem shell e sem processo de init, se uma variável estivesse faltando, o container podia falhar rápido demais e dificultar a observabilidade:

\`\`\`python
REQUIRED_ENV_VARS = ["API_URL", "API_KEY", "RECIPIENTS"]

def load_config() -> dict:
    missing = [v for v in REQUIRED_ENV_VARS if v not in os.environ]
    if missing:
        logger.error("Missing env vars: %s", ", ".join(missing))
        sys.exit(1)
    # ...
\`\`\`

### 3. Debug sem shell

![Debug de contêiner distroless sem shell no Kubernetes](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/distroless/3.png)

Com distroless, \`kubectl exec -it <pod> -- /bin/sh\` não funciona. Para troubleshooting, a estratégia é trocar temporariamente para a imagem de debug:

\`\`\`dockerfile
# Temporário: apenas para troubleshooting
FROM mcr.microsoft.com/azurelinux/distroless/debug/python:3.12
\`\`\`

Isso adiciona ~15-20MB, mas habilita shell busybox. Depois do diagnóstico, o ideal é voltar para a variante \`-nonroot\`.

### 4. ENTRYPOINT, não CMD

Em imagens distroless **sem shell**, o formato exec é obrigatório:

\`\`\`dockerfile
# Shell form: exige /bin/sh (que não existe)
# CMD python3 exemplo.py

# Exec form: obrigatório para distroless
ENTRYPOINT ["python3", "exemplo.py"]
\`\`\`

## Na implementação final deste workload:

- **Build stage:** \`mcr.microsoft.com/azurelinux/base/python:3.12\`
- **Runtime stage:** \`mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot\`

Essa combinação manteve o workload simples para instalação de dependências no build e conseguimos entregar um runtime enxuto, sem shell e sem package manager em produção.

## Benefícios de segurança

1. **Sem shell**: reduz execução arbitrária de comandos
2. **Sem package manager**: impede instalação de ferramentas de exploração em runtime
3. **Non-root**: UID 65534, reduzindo risco de escalonamento trivial
4. **Superfície mínima**: tende a reduzir CVEs reportadas por scanners (como Trivy)
5. **Imutabilidade operacional**: menos formas de alterar o container em execução

## Quando usar (e quando não usar)

### Use distroless quando

- Scripts/workers que rodam e terminam (CronJobs, Functions)
- Microsserviços que não exigem debug interativo frequente
- Workloads de produção onde segurança é prioridade

### Evite distroless quando

- O ciclo de desenvolvimento depende fortemente de debug interativo
- A aplicação depende de binários de sistema (ffmpeg, imagemagick etc.)
- O time ainda não está pronto para um workflow de troubleshooting sem shell

## Template para CronJobs Python

\`\`\`dockerfile
# Stage 1: Build

FROM mcr.microsoft.com/azurelinux/base/python:3.12 AS build
WORKDIR /aplicativos
COPY requirements-ex.txt .
RUN pip install --no-cache-dir --target=/aplicativos/deps -r requirements-ex.txt

# Stage 2: Runtime (distroless)
# Para debug temporário, troque por:
# FROM mcr.microsoft.com/azurelinux/distroless/debug/python:3.12

FROM mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot
WORKDIR /aplicativos
COPY --from=build /aplicativos/deps /aplicativos/deps
COPY exemplo.py .
ENV PYTHONPATH=/aplicativos/deps
ENTRYPOINT ["python3", "exemplo.py"]
\`\`\`

E no Python, comece com:

\`\`\`python
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    stream=sys.stdout,
)
\`\`\`

![Logs em stdout de aplicação Python em contêiner distroless](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/distroless/4.jpg)

A adoção de distroless non-root removeu shell, package manager e root do runtime. Os principais desafios encontrados foram logs em stdout, validação de variáveis e troubleshooting sem shell, que são contornáveis com práticas simples.

**Nota de compliance (NDA):** nomes de imagens, caminhos e artefatos foram anonimizados para fins de publicação; exemplos, métricas e cenários estão apresentados sem identificação de cliente, tenant ou ambiente específico.

Para workloads Python executados como Jobs no Kubernetes, distroless é uma escolha sólida.

`,
  date: "2026-04-28",
  category: "Artigos",
  readTime: "10-12 min de leitura",
};
