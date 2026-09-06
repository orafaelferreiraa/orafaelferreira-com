import type { Article } from '../types';

export const article: Article = {
  slug: "azure-container-registry-artifact-cache",
  title: "Azure Container Registry Artifact Cache: arquitetura, segurança e promoção entre ambientes",
  excerpt:
    "Guia prático de Artifact Cache no Azure Container Registry: arquitetura, segurança, pull-through cache e promoção de imagens entre ambientes.",
  content: `

![Capa do artigo sobre Azure Container Registry Artifact Cache](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/acr-cache/00.png)

Este artigo faz parte da série sobre Docker e containers, agora com foco em **Azure Container Registry (ACR) Artifact Cache**.

Se você trabalha com AKS, App Service, Functions, Container Apps ou pipelines de CI/CD, provavelmente já enfrentou pelo menos um destes problemas:

- limite de pull em registries públicos
- latência e instabilidade para baixar imagens em horário de pico
- dependência direta de registry externo em ambiente de produção
- excesso de credenciais espalhadas para autenticação entre registries

O Artifact Cache do ACR resolve esse conjunto com uma abordagem de **pull-through cache**: você continua puxando imagem com o nome do seu ACR, e a plataforma busca e armazena o conteúdo do upstream no primeiro pull.

## Onde a Docker entra diretamente neste desenho

Mesmo sendo um recurso do ACR, a operação do dia a dia passa por componentes do ecossistema Docker:

- **Docker Engine** no host de build ou no workstation
- **Docker CLI** para validar e executar comandos como pull, tags e comportamento do cache
- **Docker Hub** como upstream comum para imagens base e imagens de runtime
- **Formato OCI de imagens** — o mais comum no ecossistema Docker e runtimes cloud-native, mas não o único. 

Na prática, boa parte do valor aparece quando você tira dependência direta de pull no Docker Hub em momentos de pico e passa a concentrar distribuição via ACR com cache local.

![Diagrama do ACR como cache local entre Docker Hub e clusters](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/acr-cache/1.png)

## O que é Artifact Cache, na prática

Pense no Artifact Cache como uma camada de distribuição local para imagens:

1. Seu runtime (AKS, por exemplo) faz pull em \`meuacr.azurecr.io/time/api:1.0.0\`.
2. Se a imagem ainda não estiver no cache, o ACR busca no upstream definido na regra.
3. O cliente recebe a imagem e, em paralelo, o ACR persiste o conteúdo de forma assíncrona.
4. Nos próximos pulls, a entrega sai do próprio ACR.

Esse comportamento reduz dependência de internet no caminho crítico, melhora previsibilidade de pull e permite aplicar controle de rede/segurança dentro do seu perímetro Azure.

## Quando esse recurso brilha

### 1. Escala em cluster

Quando muitos nós sobem ao mesmo tempo (rolling update, autoscale, node replacement), o cache reduz pressão no upstream e no egress externo.

### 2. Promoção de imagens entre ambientes

Você pode manter repositórios separados por ambiente (dev, staging e prod) e usar o cache para padronizar o consumo de imagens no destino.

### 3. Ambientes restritos por rede

Com Private Link bem configurado, você evita expor pipeline e runtime diretamente ao registry externo.

## Upstreams suportados (resumo)

### O que é um upstream?

No contexto do Artifact Cache, **upstream** é o registry de origem de onde o ACR vai buscar a imagem quando ela não estiver em cache. É o registry "de fora" — pode ser Docker Hub, GHCR, Quay ou até outro ACR.

Quando você configura uma cache rule, você define:

- **source-repo**: o caminho no upstream (ex.: \`docker.io/library/nginx\`)
- **target-repo**: o caminho dentro do seu ACR onde o conteúdo ficará espelhado (ex.: \`mirror/library/nginx\`)

Na prática, o upstream só é acessado no primeiro pull de uma tag. Depois, o ACR serve o conteúdo localmente. Se o upstream ficar indisponível, imagens já em cache continuam acessíveis — esse é o ganho de resiliência do padrão.

De acordo com a documentação oficial, o Artifact Cache suporta vários registries upstream, com diferenças de autenticação por fonte. Alguns exemplos:

- Docker Hub (somente autenticado)
- Azure Container Registry (somente autenticado)
- GHCR (autenticado e não autenticado)
- Quay (autenticado e não autenticado)
- registry.k8s.io (CLI)
- Microsoft Artifact Registry (não autenticado)

### Exemplo com Docker Hub como upstream

Um padrão comum é cachear imagens oficiais usadas como base de aplicações:

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

## Limites e comportamento que você precisa saber

Esses pontos costumam gerar dúvida em troubleshooting:

1. O cache **não é prefetch automático de novas tags**. A tag só entra quando alguém puxa.
2. Limite de **até 1.000 cache rules** por registry.
3. Regras **não podem sobrepor** namespace/caminho.
4. O primeiro pull pode sofrer latência maior; os seguintes tendem a ser mais estáveis.
5. Em cenários com upstream privado, o upstream exige autenticação.

## Matriz de decisão rápida

| Cenário | Recomendação |
|---|---|
| Docker Hub público com limite de pull | Artifact Cache + credential set |
| Promoção entre ambientes com registries distintos | Artifact Cache + regra por repositório |
| Necessidade de menor blast radius de secret | Preferir credenciais com escopo mínimo e rotação |
| Upstream em rede restrita | Validar Trusted Services e ACLs no source |
| Cross-tenant | Planejar autenticação explícita por credencial |

![Matriz de decisão para uso do Artifact Cache no ACR](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/acr-cache/3.png)

## Troubleshooting objetivo

### Erro de autorização no cache rule

- Confirme se a identidade foi anexada ao ACR downstream.
- Confirme o role assignment no upstream com escopo correto.
- Verifique se a autenticação configurada na cache rule está correta.

### Primeiro pull funciona, mas desempenho não melhora

- Lembre que a cópia é assíncrona.
- Aguarde alguns instantes e repita pull para validar efeito de cache.
- Confira eventos/logs e permissão de leitura no upstream.

### Regra não cria por conflito

- Regras de cache não podem se sobrepor.
- Revise namespace de \`target-repo\` e caminhos de \`source-repo\`.

### Ambientes com rede restrita

- Verifique regras de firewall/private endpoint do upstream.
- Quando aplicável, habilite Trusted Services no source.

## Boas práticas para ambiente real

1. Padronize naming de cache rule por domínio/time/produto.
2. Separe namespace de cache por ambiente (ex.: \`promoted/\`, \`quarantine/\`).
3. Use tags imutáveis para promoção crítica (ou controle rigoroso de retag).
4. Evite escopo amplo de permissão quando ABAC estiver habilitado.
5. Adicione validação em pipeline para garantir que a regra de cache existe antes do deploy.
6. Monitore latência de pull e falhas de autenticação como indicadores de saúde.

## Exemplo de fluxo de promoção com governança

1. Build publica imagem em \`devregistry.azurecr.io/team-a/api:1.4.0\`.
2. Pipeline de qualidade executa scan e testes.
3. Aprovado, o pipeline dispara pull no destino:

\`\`\`bash
docker pull prodregistry.azurecr.io/promoted/team-a/api:1.4.0
\`\`\`

4. Esse pull alimenta o cache no prod.
5. Clusters de produção consomem do ACR de produção.

Esse padrão simplifica governança e reduz scripts customizados de import, sem abrir mão de rastreabilidade.


![Fluxo de promoção de imagens entre ambientes com Artifact Cache](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/acr-cache/2.png)

## Boas práticas

1. Mantenha imagens base oficiais e versionadas (evite depender sempre de \`latest\`).
2. Use tags imutáveis para promover release entre ambientes.
3. Reduza pulls diretos em registry público durante janela crítica de deploy.
4. Centralize auditoria de consumo de imagem no registry corporativo.

## Conclusão

O Azure Container Registry Artifact Cache não é apenas um recurso de conveniência. Em plataformas com muitos deploys e múltiplos ambientes, ele vira uma camada de resiliência operacional.

Combinando:

- pull-through cache
- identidade gerenciada
- RBAC/ABAC bem definido
- segmentação de namespace por ambiente

Você constrói uma estratégia mais segura, previsível e escalável para distribuição de imagens.

Para quem já está nessa pegada de Docker + Kubernetes + Azure, o Artifact Cache é um passo natural para maturidade de supply chain de containers.

## Referências

- [Microsoft Learn: Optimize image pulls with artifact cache in Azure Container Registry](https://learn.microsoft.com/azure/container-registry/artifact-cache-overview)
- [Azure CLI: az acr cache](https://learn.microsoft.com/cli/azure/acr/cache)
- [Docker Docs: Docker Hub usage and limits](https://docs.docker.com/docker-hub/usage/)
- [Docker Docs: docker pull reference](https://docs.docker.com/reference/cli/docker/image/pull/)
`,
  date: "2026-05-31",
  category: "Artigos",
  readTime: "6 min de leitura",
};
