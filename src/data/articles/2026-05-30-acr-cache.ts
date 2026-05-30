import { Article } from './types';

export const article: Article = {
  slug: "azure-container-registry-artifact-cache",
  title: "Azure Container Registry Artifact Cache: arquitetura, seguranca e promocao entre ambientes",
  excerpt:
    "Guia pratico para implementar Artifact Cache no Azure Container Registry com foco em performance, seguranca, pull-through cache e promocao de imagens entre ambientes.",
  content: `
Este artigo faz parte da serie sobre Docker e containers, agora com foco em **Azure Container Registry (ACR) Artifact Cache**.


Se voce trabalha com AKS, App Service, Functions, Container Apps ou pipelines de CI/CD, provavelmente ja enfrentou pelo menos um destes problemas:

- limite de pull em registries publicos
- latencia e instabilidade para baixar imagens em horario de pico
- dependencia direta de registry externo em ambiente de producao
- proliferacao de secrets para autenticacao entre registries

O Artifact Cache do ACR resolve esse conjunto com uma abordagem de **pull-through cache**: voce continua puxando imagem com o nome do seu ACR, e a plataforma busca e armazena o conteudo do upstream no primeiro pull.

## Onde a Docker entra diretamente neste desenho

Mesmo sendo um recurso do ACR, a operacao do dia a dia passa por componentes do ecossistema Docker:

- **Docker Engine** no host de build ou no workstation
- **Docker CLI** para validar pull, tags e comportamento do cache
- **Docker Hub** como upstream comum para imagens base e imagens de runtime
- **Formato OCI de imagens** consumido por Docker e tambem por runtimes cloud-native

Na pratica, boa parte do valor aparece quando voce tira dependencia direta de pull no Docker Hub em momentos de pico e passa a concentrar distribuicao via ACR com cache local.

## O que e Artifact Cache, na pratica

Pense no Artifact Cache como uma camada de distribuicao local para imagens:

1. Seu runtime (AKS, por exemplo) faz pull em \`meuacr.azurecr.io/time/api:1.0.0\`.
2. Se a imagem ainda nao estiver no cache, o ACR busca no upstream definido na regra.
3. O cliente recebe a imagem e, em paralelo, o ACR persiste o conteudo de forma assincrona.
4. Nos proximos pulls, a entrega sai do proprio ACR.

Esse comportamento reduz dependencia de internet no caminho critico, melhora previsibilidade de pull e permite aplicar controle de rede/seguranca dentro do seu perimetro Azure.

## Quando esse recurso brilha

### 1. Escala em cluster

Quando muitos nos sobem ao mesmo tempo (rolling update, autoscale, node replacement), o cache reduz pressao no upstream e no egress externo.

### 2. Promocao de imagens entre ambientes

Voce pode usar um ACR de desenvolvimento como origem e um ACR de producao como destino, promovendo imagens por demanda no primeiro pull.

### 3. Ambientes restritos por rede

Com Private Link/ACLs e Trusted Services bem configurados, voce evita expor pipeline e runtime diretamente ao registry externo.

### 4. Governanca e seguranca

Com ACR-to-ACR + Managed Identity, reduz o uso de credenciais de longa duracao e concentra autorizacao em RBAC/ABAC.

## Upstreams suportados (resumo)

De acordo com a documentacao oficial, o Artifact Cache suporta varios registries upstream, com diferencas de autenticacao por fonte. Alguns exemplos:

- Docker Hub (somente autenticado)
- Azure Container Registry (somente autenticado)
- GHCR (autenticado e nao autenticado)
- Quay (autenticado e nao autenticado)
- registry.k8s.io (CLI)
- Microsoft Artifact Registry (nao autenticado)

Para Docker Hub, use credential set; para ACR-to-ACR, a abordagem recomendada e usar **User-Assigned Managed Identity (UAMI)**.

### Exemplo com Docker Hub como upstream

Um padrao comum e cachear imagens oficiais usadas como base de aplicacoes:

\`\`\`bash
az acr cache create \\
  --registry "acrpocprod" \\
  --name "dockerhub-nginx" \\
  --source-repo "docker.io/library/nginx" \\
  --target-repo "mirror/library/nginx" \\
  --cred-set "DockerHubCredSet"
\`\`\`

Depois, em vez de puxar direto do Docker Hub, seu ambiente passa a consumir:

\`\`\`bash
docker pull acrpocprod.azurecr.io/mirror/library/nginx:stable
\`\`\`

Isso preserva compatibilidade com fluxo Docker e melhora confiabilidade operacional em ambientes corporativos.

## Limites e comportamento que voce precisa saber

Esses pontos costumam gerar duvida em troubleshooting:

1. O cache **nao e prefetch automatico de novas tags**. A tag so entra quando alguem puxa.
2. Limite de **ate 1.000 cache rules** por registry.
3. Regras **nao podem sobrepor** namespace/caminho.
4. O primeiro pull pode sofrer latencia maior; os seguintes tendem a ser mais estaveis.
5. Em ACR-to-ACR, o upstream exige autenticacao.

## Implementacao recomendada: ACR-to-ACR com Managed Identity

### Pre-requisitos

- Dois registries: upstream (origem) e downstream (cache).
- Azure CLI 2.85.0+.
- Permissoes para criar UAMI, role assignment e cache rule.

### Passo 1: criar a identidade

\`\`\`bash
RG="rg-container"
IDENTITY_NAME="acr-cache-uami"

az identity create \\
  --name "$IDENTITY_NAME" \\
  --resource-group "$RG"
\`\`\`

### Passo 2: capturar IDs da identidade

\`\`\`bash
IDENTITY_PRINCIPAL_ID=$(az identity show \\
  --name "$IDENTITY_NAME" \\
  --resource-group "$RG" \\
  --query principalId -o tsv)

IDENTITY_RESOURCE_ID=$(az identity show \\
  --name "$IDENTITY_NAME" \\
  --resource-group "$RG" \\
  --query id -o tsv)
\`\`\`

### Passo 3: anexar identidade ao ACR downstream

\`\`\`bash
DOWNSTREAM_ACR="acrpocprod"

az acr identity assign \\
  --name "$DOWNSTREAM_ACR" \\
  --identities "$IDENTITY_RESOURCE_ID"
\`\`\`

### Passo 4: garantir permissao de leitura no ACR upstream

Se seu upstream estiver com ABAC habilitado, prefira escopo por repositorio.

\`\`\`bash
UPSTREAM_ACR="acrpocdev"
UPSTREAM_ID=$(az acr show --name "$UPSTREAM_ACR" --query id -o tsv)

# Habilite ABAC se necessario
az acr update --name "$UPSTREAM_ACR" --role-assignment-mode rbac-abac

az role assignment create \\
  --role "Container Registry Repository Reader" \\
  --assignee "$IDENTITY_PRINCIPAL_ID" \\
  --scope "$UPSTREAM_ID/repositories/team-a/api"
\`\`\`

Em cenarios mais amplos de descoberta/catalogo, voce pode complementar com \`Container Registry Repository Catalog Lister\` no escopo adequado.

### Passo 5: criar a cache rule com \`--identity\`

\`\`\`bash
az acr cache create \\
  --registry "$DOWNSTREAM_ACR" \\
  --name "promote-team-a-api" \\
  --source-repo "\${UPSTREAM_ACR}.azurecr.io/team-a/api" \\
  --target-repo "promoted/team-a/api" \\
  --identity "$IDENTITY_RESOURCE_ID"
\`\`\`

### Passo 6: validar

\`\`\`bash
az acr cache show -r "$DOWNSTREAM_ACR" -n "promote-team-a-api"
az acr login --name "$DOWNSTREAM_ACR"
docker pull "\${DOWNSTREAM_ACR}.azurecr.io/promoted/team-a/api:1.4.0"
\`\`\`

No primeiro pull, o downstream busca no upstream e hidrata cache. Depois, o consumo tende a ficar mais rapido e previsivel.

## Matriz de decisao rapida

| Cenario | Recomendacao |
|---|---|
| Docker Hub publico com limite de pull | Artifact Cache + credential set |
| ACR dev para ACR prod no mesmo tenant | Artifact Cache + UAMI |
| Necessidade de menor blast radius de secret | Evitar usuario/senha e usar UAMI |
| Upstream em rede restrita | Validar Trusted Services e ACLs no source |
| Cross-tenant com MI | Nao suportado no modelo atual para MI |

## Troubleshooting objetivo

### Erro de autorizacao no cache rule

- Confirme se a identidade foi anexada ao ACR downstream.
- Confirme o role assignment no upstream com escopo correto.
- Verifique se usou \`--identity\` com Resource ID completo da UAMI.

### Primeiro pull funciona, mas desempenho nao melhora

- Lembre que a copia e assincrona.
- Aguarde alguns instantes e repita pull para validar efeito de cache.
- Confira eventos/logs e permissao de leitura no upstream.

### Regra nao cria por conflito

- Regras de cache nao podem se sobrepor.
- Revise namespace de \`target-repo\` e caminhos de \`source-repo\`.

### Ambientes com rede restrita

- Verifique regras de firewall/private endpoint do upstream.
- Quando aplicavel, habilite Trusted Services no source.

## Boas praticas para ambiente real

1. Padronize naming de cache rule por dominio/time/produto.
2. Separe namespace de cache por ambiente (ex.: \`promoted/\`, \`quarantine/\`).
3. Use tags imutaveis para promocao critica (ou controle rigoroso de retag).
4. Evite escopo amplo de permissao quando ABAC estiver habilitado.
5. Adicione validacao em pipeline para garantir que a regra de cache existe antes do deploy.
6. Monitore latencia de pull e falhas de autenticacao como indicadores de saude.

## Exemplo de fluxo de promocao com governanca

1. Build publica imagem em \`devregistry.azurecr.io/team-a/api:1.4.0\`.
2. Pipeline de qualidade executa scan e testes.
3. Aprovado, o pipeline dispara pull no destino:

\`\`\`bash
docker pull prodregistry.azurecr.io/promoted/team-a/api:1.4.0
\`\`\`

4. Esse pull alimenta o cache no prod.
5. Clusters de producao consomem do ACR de producao.

Esse padrao simplifica governanca e reduz scripts customizados de import, sem abrir mao de rastreabilidade.

## Conexao com boas praticas Docker para supply chain

Para manter o artigo alinhado com a comunidade Docker e com cenarios reais de plataforma:

1. Mantenha imagens base oficiais e versionadas (evite depender sempre de \`latest\`).
2. Use tags imutaveis para promover release entre ambientes.
3. Reduza pulls diretos em registry publico durante janela critica de deploy.
4. Centralize auditoria de consumo de imagem no registry corporativo.
5. Preserve experiencia do time com comandos Docker conhecidos, mudando apenas o endpoint.

## Conclusao

O Azure Container Registry Artifact Cache nao e apenas um recurso de conveniencia. Em plataformas com muitos deploys e multiplos ambientes, ele vira uma camada de resiliencia operacional.

Combinando:

- pull-through cache
- identidade gerenciada
- RBAC/ABAC bem definido
- segmentacao de namespace por ambiente

voce constroi uma estrategia mais segura, previsivel e escalavel para distribuicao de imagens.

Para quem ja esta na jornada de Docker + Kubernetes + Azure, Artifact Cache e um passo natural para maturidade de supply chain de containers.

## Referencias

- Microsoft Learn: Optimize image pulls with artifact cache in Azure Container Registry
  https://learn.microsoft.com/azure/container-registry/artifact-cache-overview
- Microsoft Learn: Enable artifact cache to cache artifacts from another Azure Container Registry
  https://learn.microsoft.com/azure/container-registry/artifact-cache-acr-to-acr-cli
- Azure CLI: az acr cache
  https://learn.microsoft.com/cli/azure/acr/cache
- Azure Compute Blog (contexto ACR-to-ACR e MI)
  https://techcommunity.microsoft.com/blog/azurecompute/use-azure-container-registry-as-an-upstream-source-for-artifact-cache/4415604
- Docker Docs: Docker Hub usage and limits
  https://docs.docker.com/docker-hub/usage/
- Docker Docs: docker pull reference
  https://docs.docker.com/reference/cli/docker/image/pull/
`,
  date: "2026-05-30",
  category: "Artigos",
  readTime: "15 min de leitura",
};
