import { Article } from './types';

export const article: Article = {
  slug: "docker-python-distroless-kubernetes",
  title: "De 150MB para 50MB: Imagens Docker Python com Distroless no Kubernetes",
  excerpt:
    "Como reduzimos uma imagem de CronJob Python de ~150MB para ~50MB com multi-stage build e distroless, aumentando segurança e mantendo operação simples no Kubernetes.",
  content: `

> Estratégia de multi-stage build com imagens distroless para workloads Python no Kubernetes, com problemas reais e lições aprendidas em produção.

## Contexto

Tínhamos um CronJob no Kubernetes que executava um script Python para consumir uma API REST e disparar notificações. O script tinha duas dependências (\`azure-identity\` e \`requests\`) e rodava por menos de 5 segundos, uma vez por dia.

A primeira versão usava \`python:3.12-slim\` e gerava uma imagem de **~150MB**. Funcionava, mas carregava itens desnecessários em runtime, como shell, package manager e utilitários de sistema. O objetivo passou a ser reduzir tamanho e superfície de ataque com distroless.

## O problema: o que sobra no \`slim\`

Mesmo a variante \`slim\` do Python ainda inclui:

- Shell (\`bash\`, \`sh\`)
- Package manager (\`apt\`, \`dpkg\`)
- Utilitários como \`curl\`, \`wget\` e \`find\`
- Usuário root por padrão

Para um container que executa um script e termina, nada disso é necessário. Cada binário extra também amplia a superfície de ataque.

## A solução: multi-stage build + distroless

A estratégia separa **build** e **runtime** em dois estágios:

\`\`\`dockerfile
# Stage 1: Build - instala dependências
FROM mcr.microsoft.com/azurelinux/base/python:3.12 AS build

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --target=/app/deps -r requirements.txt

# Stage 2: Runtime - distroless (sem shell, sem package manager, non-root)
FROM mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot

WORKDIR /app
COPY --from=build /app/deps /app/deps
COPY main.py .

ENV PYTHONPATH=/app/deps
ENTRYPOINT ["python3", "main.py"]
\`\`\`

**Resultado: ~50MB**, redução de **~67%** em relação ao \`slim\`.

### Por que funciona

| Estágio | O que tem | O que NÃO tem |
|---------|-----------|----------------|
| **Build** (\`base/python:3.12\`) | pip, compiladores, headers; tudo para instalar pacotes | Não vai para a imagem final |
| **Runtime** (\`distroless/python:3.12-nonroot\`) | Python runtime, glibc, CA certs | Sem shell, sem pip, sem apt, sem binários extras |

O \`--target=/app/deps\` instala dependências em um diretório isolado, que é copiado para o segundo estágio. O \`PYTHONPATH\` aponta para esse diretório.

## O que é distroless

Imagens distroless contêm **apenas** o runtime da linguagem e suas dependências mínimas. Não incluem:

- **Shell** (bash, sh): não é possível abrir um terminal no container
- **Package managers** (apt, yum, pip)
- **Utilitários do sistema** (curl, wget, vi, ls, cat)
- **Usuário root** (na variante \`-nonroot\`, roda como UID 65534)

A Microsoft mantém imagens distroless para Azure Linux:

\`\`\`
mcr.microsoft.com/azurelinux/distroless/python:3.12          # root
mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot  # non-root (recomendado)
mcr.microsoft.com/azurelinux/distroless/debug/python:3.12    # com shell (debug only)
\`\`\`

> **Nota:** a variante \`debug\` inclui um shell busybox e serve para troubleshooting temporário. Não deve ser usada em produção.

## Armadilhas que encontramos

### 1. \`python\` vs \`python3\`

O Azure Linux distroless **não** tem o symlink \`python\` -> \`python3\`:

\`\`\`dockerfile
# Falha: "python" não existe
ENTRYPOINT ["python", "main.py"]

# Correto
ENTRYPOINT ["python3", "main.py"]
\`\`\`

**Lição:** use sempre \`python3\` em imagens Azure Linux distroless.

### 2. Logs desaparecem

Sem \`stream=sys.stdout\` no \`logging.basicConfig()\`, os logs iam para \`stderr\` e, em alguns cenários de CronJob, não apareciam no \`kubectl logs\`:

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

**Lição:** force \`stream=sys.stdout\` em workloads executados como Job/CronJob.

### 3. Erros silenciosos em variáveis de ambiente

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

**Lição:** valide dependências externas logo no início, com mensagens explícitas.

### 4. Debug sem shell

Com distroless, \`kubectl exec -it <pod> -- /bin/sh\` não funciona. Para troubleshooting, a estratégia foi trocar temporariamente para a imagem de debug:

\`\`\`dockerfile
# Temporário: apenas para troubleshooting
FROM mcr.microsoft.com/azurelinux/distroless/debug/python:3.12
\`\`\`

Isso adiciona ~15-20MB, mas habilita shell busybox. Depois do diagnóstico, o ideal é voltar para a variante \`-nonroot\`.

**Lição:** deixe a variante debug documentada como comentário no Dockerfile.

### 5. ENTRYPOINT, não CMD

Em imagens distroless **sem shell**, o formato exec é obrigatório:

\`\`\`dockerfile
# Shell form: exige /bin/sh (que não existe)
CMD python3 main.py

# Exec form: obrigatório para distroless
ENTRYPOINT ["python3", "main.py"]
\`\`\`

## Comparativo de tamanho

| Imagem | Tamanho | Segurança |
|--------|---------|-----------|
| \`python:3.12\` | ~900MB | Shell, compiladores e mais exposição |
| \`python:3.12-slim\` | ~150MB | Menos pacotes, mas ainda com shell e apt |
| \`azurelinux/distroless/python:3.12-nonroot\` | **~50MB** | Sem shell, sem package manager, non-root |

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
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --target=/app/deps -r requirements.txt

# Stage 2: Runtime (distroless)
# Para debug temporário, troque por:
# FROM mcr.microsoft.com/azurelinux/distroless/debug/python:3.12
FROM mcr.microsoft.com/azurelinux/distroless/python:3.12-nonroot
WORKDIR /app
COPY --from=build /app/deps /app/deps
COPY main.py .
ENV PYTHONPATH=/app/deps
ENTRYPOINT ["python3", "main.py"]
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

## Conclusão

A migração de \`python:3.12-slim\` para distroless reduziu a imagem de **~150MB para ~50MB** e removeu shell, package manager e root do runtime. Os principais desafios encontrados (\`python3\` vs \`python\`, logs em stdout, validação de variáveis e troubleshooting sem shell) são contornáveis com práticas simples.

Para workloads Python executados como Jobs no Kubernetes, distroless é uma escolha sólida.

---

*Stack: Kubernetes, Azure Linux, Python 3.12*

`,
  date: "2026-04-18",
  category: "Artigos",
  readTime: "10-12 min de leitura",
};
