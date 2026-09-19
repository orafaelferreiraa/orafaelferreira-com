import type { Article } from '../types';

export const article: Article = {
  slug: "dois-anos-de-docker",
  title: "Dois anos de Docker: o que mudou de 2024 para cá",
  excerpt:
    "De setembro de 2024 a setembro de 2026: do Engine 27 ao 29, a quebra de rede do 28.0, o recuo do Docker Hub nos limites de pull, Hardened Images, segurança e a chegada dos agentes.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/dois-anos-de-docker/capa.png",
  content: `

![Linha do tempo do Docker Engine entre as versões 27 e 29, de setembro de 2024 a setembro de 2026](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/dois-anos-de-docker/capa.png)

Entre setembro de 2024 e setembro de 2026 o [Docker Engine](https://docs.docker.com/engine/) saiu da série 27 e chegou na 29.8.1. No caminho teve um release que derrubou acesso a container em produção, uma troca do armazenamento de imagem por padrão, a remoção de um subsistema inteiro de assinatura e a depreciação do cgroup v1.

Fora do Engine, o período teve um anúncio de cobrança no [Docker Hub](https://docs.docker.com/docker-hub/) que foi revertido publicamente, um catálogo de imagens endurecidas que começou pago e virou open source, e uma linha de produto inteira voltada a agentes de IA.

Este artigo é o levantamento do que mudou, com a fonte oficial de cada ponto. Não é guia de migração, é mapa: o que aconteceu, quando, e o que morde na prática.

| Item | Situação |
|---|---|
| Janela coberta | setembro de 2024 a setembro de 2026 |
| Engine no início da janela | 27.2.1 |
| Engine hoje | 29.8.1 |
| Séries major no período | 3 (27, 28 e 29) |

## O que sobrou de 2024: a série 27

O fim da linha 27 foi de ajuste fino, quase todo em rede. As notas completas estão nas [release notes do Engine 27](https://docs.docker.com/engine/release-notes/27/).

- **27.2.1 (09/09/2024):** atualização do [runc](https://github.com/opencontainers/runc) para a v1.1.14, corrigindo a CVE-2024-45310. Corrigiu também o \`docker login\` gravando credencial sob a chave errada.
- **27.3.0 (19/09/2024):** chega a flag \`--feature\` no daemon, que passa a ser o mecanismo padrão de ligar e desligar comportamento novo sem esperar release major.
- **27.4.0 (09/12/2024):** portas publicadas passam a ser acessíveis entre bridge networks diferentes quando o \`br_netfilter\` está carregado e o userland-proxy está desligado. Detecção de endereço duplicado (DAD) de IPv6 foi desabilitada no bridge.
- **27.4.1 (18/12/2024):** limpeza da chain \`DOCKER FILTER\` e correção de carregamento de módulo de kernel em Docker in Docker.
- **27.5.1 (22/01/2025):** aparece o \`DOCKER_IGNORE_BR_NETFILTER_ERROR\`, sintoma de que o terreno de rede já estava sendo preparado para o que viria em seguida.

## Engine 28.0.0, o release que quebrou rede

Publicado em **19/02/2025**, é o release mais importante da janela e o que mais gerou chamado de suporte.

Até o 27.x, em Linux com iptables, qualquer host com rota até a máquina do Docker conseguia falar direto com o IP interno de um container, mesmo em porta que nunca foi publicada. Bastava saber o endereço na rede bridge, tipicamente algo em \`172.17.0.0/16\`. Na prática, subir um banco com \`docker run\` sem \`-p\` não deixava ele isolado da rede local, deixava ele apenas sem NAT.

O 28.0.0 fecha isso. Tráfego inbound não solicitado para o IP do container passa a ser descartado na chain \`DOCKER\`, salvo se a porta foi publicada com \`-p\` ou \`--publish\`. O anúncio oficial está em [Hardening Container Networking by Default](https://www.docker.com/blog/docker-engine-28-hardening-container-networking-by-default/).

Três detalhes que pegam gente de surpresa:

- Vale só para **Linux com iptables**. Docker Desktop não é afetado.
- Passa a exigir os módulos de kernel de \`ipset\` (\`ip_set\`, \`ip_set_hash_net\` e \`netfilter_xt_set\`). Em host enxuto ou kernel customizado, o daemon reclama na subida.
- O binário \`docker-proxy\` mudou e não é compatível com \`dockerd\` antigo, então atualizar os pacotes pela metade não funciona. O \`rootlesskit-docker-proxy\` foi removido.

![Comparativo do acesso a uma porta não publicada antes e depois do endurecimento de rede do Docker Engine 28.0](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/dois-anos-de-docker/1.png)

### As saídas de emergência

Se alguma coisa no ambiente dependia do comportamento antigo, existem escapes documentados. Em ordem, do mais cirúrgico para o mais amplo:

| Opção | Escopo | Efeito |
|---|---|---|
| \`com.docker.network.bridge.trusted_host_interfaces\` | por rede | libera acesso direto vindo de interfaces específicas do host |
| \`com.docker.network.bridge.gateway_mode_ipv4\` ou \`_ipv6\` com valor \`nat-unprotected\` | por rede | devolve o comportamento antigo naquela rede |
| \`allow-direct-routing\` | daemon inteiro | libera acesso roteado direto em tudo |

\`\`\`json
{
  "allow-direct-routing": true
}
\`\`\`

A recomendação prática é não começar pelo \`allow-direct-routing\`, porque ele desfaz o ganho de segurança do release inteiro. Se só um host de monitoração precisa alcançar o container, \`trusted_host_interfaces\` resolve com escopo bem menor.

O 28.0 também trouxe o modo \`isolated\` para redes \`internal\`, o \`gw-priority\`, a definição de nome de interface do container via \`com.docker.network.endpoint.ifname\`, a flag \`--ipv4\` no \`docker network create\` e IPv6 sem precisar de \`fixed-cidr-v6\`.

### O que o 28.0 removeu

- O driver de log \`logentries\`.
- Plugins externos de graph-driver.
- A flag \`--api-cors-header\`.
- A flag \`--time\` em \`docker stop\` e \`docker restart\`, que virou \`--timeout\`.
- Suporte a imagens no schema 1 legado. A variável \`DOCKER_ENABLE_DEPRECATED_PULL_SCHEMA_1_IMAGE\` deixou de funcionar.

## A série 28 depois do 28.0

As [release notes do Engine 28](https://docs.docker.com/engine/release-notes/28/) trazem o resto da linha:

- **28.1.0 (17/04/2025):** \`docker bake\` vira comando de topo, como alias de \`docker buildx bake\`. Entra o \`--use-api-socket\` em modo experimental.
- **28.2.0 (28/05/2025):** mudança de default silenciosa e relevante, o **CDI (Container Device Interface) passa a vir habilitado**. Bind mount com caminho relativo passa a funcionar.
- **28.3.0 (24/06/2025):** suporte a GPU AMD e uso do \`DOCKER_AUTH_CONFIG\` como credential store.
- **28.3.3 (29/07/2025):** corrige a **CVE-2025-54388**, em que um reload do firewalld reabria portas publicadas. É o contraponto irônico do 28.0: o release que fechou a rede tinha um caminho para reabrir sozinho.
- **28.4.0 (03/09/2025):** \`GODEBUG\` configurável via docker context.
- **28.5.0 (02/10/2025):** anúncio da depreciação do Raspberry Pi OS 32 bits após a série 28.

## Engine 29.0.0, a troca de defaults

Publicado em **10/11/2025**, o 29.0.0 é menos barulhento que o 28.0 mas mexe em mais coisa de uma vez. As [release notes do Engine 29](https://docs.docker.com/engine/release-notes/29/) listam tudo.

**Mudanças de comportamento padrão:**

- O **containerd image store passa a ser o padrão em instalação nova**.
- \`docker image ls\` ganha uma visão nova, em árvore colapsada, e **deixa de mostrar imagem sem tag** a menos que você passe \`--all\`.
- O backend experimental de firewall em nftables fica disponível via \`firewall-backend: nftables\`. Vale reforçar, porque circula informação errada sobre isso: **nftables não chegou no 28.x**, toda a série 28 é iptables.

**Quebras:**

- **cgroup v1 depreciado.** O suporte segue até maio de 2029, então não é urgência, mas é o aviso formal.
- **Docker Content Trust removido do CLI.** A Docker publicou depois um [guia de aposentadoria e migração](https://www.docker.com/blog/docker-content-trust-retirement-and-migration-guidance/) em 16/06/2026.
- O daemon passa a exigir API v1.44 ou superior, ou seja, cliente de Docker v25.0 para cima.
- As chains \`DOCKER-ISOLATION-STAGE-1\` e \`DOCKER-ISOLATION-STAGE-2\` do iptables foram removidas. Se você tem automação que escreve regra apoiada nesses nomes, ela quebra em silêncio.
- O módulo Go \`github.com/docker/docker\` foi depreciado em favor de \`github.com/moby/moby/client\` e \`github.com/moby/moby/api\`.
- Pacotes Debian armhf passam a mirar ARMv7 e os pacotes de Raspbian 32 bits foram descontinuados.

**Novidades:** \`docker image load\` e \`save\` com múltiplas plataformas via \`--platform\`, \`--runtime\` no Windows, campo \`Health\` em \`GET /containers/json\` e a entitlement \`device\` no builder.

## Traduzindo: o containerd image store como padrão

Historicamente o Docker guardava imagem num store próprio, baseado em graph drivers como o overlay2. O [containerd image store](https://docs.docker.com/engine/storage/containerd/) substitui essa camada pelo mesmo mecanismo que o containerd já usa, e ser padrão a partir do 29.0 muda três coisas no dia a dia.

**Uma imagem, várias plataformas, de verdade.** No store antigo, a máquina guardava só a variante da arquitetura local. Com o containerd store, a mesma tag mantém os manifestos das várias plataformas, o que faz \`docker image save --platform\` e build multi-arquitetura local funcionarem sem malabarismo.

**Attestations e proveniência viram cidadão de primeira classe.** O 29.6.0 (18/06/2026) inclusive adicionou o endpoint \`GET /images/{name}/attestations\`, que devolve as declarações in-toto da imagem.

**Scripts que liam o store antigo quebram.** Qualquer automação que inspecionava diretório de graph driver, ou que contava com \`docker image ls\` listando imagem sem tag por padrão, precisa ser revista. Essa combinação é a que mais aparece: o comando não falha, ele só devolve menos linha do que antes, e o script segue adiante achando que não tem imagem órfã para limpar.

A migração não é automática em host que já existia. Instalação nova nasce com o store novo, host antigo continua no store anterior até a troca ser feita de forma explícita, o que é bom, porque a troca não preserva as imagens já baixadas.

![Diagrama do containerd image store virando o padrão do Docker Engine 29](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/dois-anos-de-docker/2.png)

## Traduzindo: cgroup v1 depreciado e o rootless novo

Duas mudanças que valem checagem antes de subir para o 29.

**cgroup v1.** É o mecanismo do kernel Linux que limita e contabiliza CPU, memória e IO de cada container. A v2 unificou a hierarquia e é o padrão em distribuição moderna há anos, mas host antigo, e principalmente kernel customizado ou imagem de node gerenciada mais conservadora, ainda pode estar em v1. O 29.0 depreciou a v1 com suporte até maio de 2029. Checar é uma linha:

\`\`\`bash
stat -fc %T /sys/fs/cgroup/
# cgroup2fs  = v2, tudo certo
# tmpfs      = v1, entra na fila de migração
\`\`\`

**Rootless com driver novo.** No 29.5.0 (14/05/2026) o \`gvisor-tap-vsock\` virou o driver de rede padrão do modo rootless, no lugar do slirp4netns. É breaking change para quem roda [Docker rootless](https://docs.docker.com/engine/security/rootless/) com ajuste fino de rede, porque características de performance e comportamento de port forwarding mudam. O mesmo release passou a habilitar time namespace privado por padrão nos kernels que suportam.

## A série 29 ao longo de 2026

- **29.2.0 (26/01/2026):** suporte experimental a NRI (Node Resource Interface) e campo \`Identity\` no inspect.
- **29.3.0 (05/03/2026):** a versão mínima de API volta de v1.44 para **v1.40**, recuando parcialmente a quebra do 29.0. Entra o \`bind-create-src\` no \`--mount\`.
- **29.3.1 (25/03/2026):** corrige a CVE-2026-34040, bypass de autorização em plugin AuthZ, mais três CVEs de BuildKit.
- **29.4.2 (01/05/2026):** o perfil seccomp padrão passa a bloquear sockets \`AF_ALG\` e a syscall \`socketcall(2)\`. O efeito colateral foi conhecido e documentado: **quebra programa 32 bits e imagem i386**, com workaround via perfil seccomp v0.2.1.
- **29.5.0 (14/05/2026):** driver rootless novo e time namespace privado, já citados.
- **29.5.1 (18/05/2026):** trio de correções no \`docker cp\`, incluindo duas TOCTOU que permitiam criar arquivo arbitrário e redirecionar bind mount para caminho arbitrário do host.
- **29.6.0 (18/06/2026):** endpoint de attestations e correção do \`COPY --chmod\` sendo filtrado pelo umask do daemon.
- **29.7.0 (30/07/2026):** \`mount type=image\` deixa de ser experimental, entra o \`embedded-containerd\` experimental rodando containerd dentro do processo do daemon, e o \`default-stop-timeout\`.
- **29.8.0 (03/09/2026):** flag \`--umask\` no \`docker run\` e \`create\`, templates de perfil AppArmor configuráveis no daemon.
- **29.8.1 (15/09/2026):** versão corrente na data deste artigo.

## Docker Hub: o anúncio que foi revertido

Essa é a parte do período com mais informação errada circulando, então vale reconstituir a linha do tempo com calma.

No fim de 2024 a Docker anunciou uma revisão de planos que incluía **cobrança por consumo**, tanto de pull quanto de storage, com limites de pull por hora previstos para 1 de março de 2025. O anúncio está em [Announcing Upgraded Docker Plans](https://www.docker.com/blog/november-2024-updated-plans-announcement/), e os planos novos entraram à venda em 10/12/2024.

Em **21/02/2025**, poucos dias antes da data prevista, a empresa voltou atrás em [Revisiting Docker Hub Policies](https://www.docker.com/blog/revisiting-docker-hub-policies-prioritizing-developer-experience/):

- a cobrança por consumo de pull foi **cancelada de vez**;
- a cobrança por storage foi adiada por tempo indeterminado;
- o aumento de rate limit previsto **não foi aplicado**;
- a Docker se comprometeu a anunciar qualquer mudança futura com seis meses de antecedência.

Ou seja, os números de "10 pulls por hora para anônimo" e "40 por hora para conta Personal" que ainda aparecem em post de blog e em thread de fórum são de **um plano que nunca entrou em vigor**. Citar eles hoje é citar documento revogado.

Os limites que valem de fato, segundo a [documentação oficial de uso do Docker Hub](https://docs.docker.com/docker-hub/usage/pulls/), são contados numa janela de **seis horas**, não por hora:

| Conta | Limite de pull |
|---|---|
| Anônimo | 100 a cada 6 horas, por endereço IPv4 ou sub-rede IPv6 /64 |
| Personal autenticado | 200 a cada 6 horas |
| Pro, Team e Business | sem limite |

O detalhe do IPv4 compartilhado é o que costuma doer. Um cluster inteiro atrás de um NAT, ou um runner de CI numa faixa compartilhada, consome a cota como se fosse um único usuário. É exatamente o cenário que motiva colocar um cache de registry na frente do Hub, assunto que já tratei em [ACR Artifact Cache](/artigos/azure-container-registry-artifact-cache).

![Linha do tempo do anúncio de cobrança por pull no Docker Hub e do recuo em fevereiro de 2025](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/dois-anos-de-docker/3.png)

## Planos: o reajuste do fim de 2024

O que de fato mudou de preço na janela foi a tabela de planos, em 10/12/2024:

| Plano | Antes | Depois |
|---|---|---|
| Personal | gratuito | gratuito |
| Pro | 5 dólares/mês | 9 dólares/mês |
| Team | 9 dólares/usuário/mês | 15 dólares/usuário/mês |
| Business | 24 dólares/usuário/mês | 24 dólares/usuário/mês |

A contrapartida foi deixar de vender Docker Build Cloud e Testcontainers Cloud como licença por assento separada, passando a incluí-los nos planos pagos, com Docker Scout ilimitado em Team e Business.

## Imagens endurecidas: DHI, o fim da Minimus e o ELS

Em **19/05/2025** a Docker lançou as [Docker Hardened Images](https://www.docker.com/blog/introducing-docker-hardened-images/), um catálogo curado de imagens mínimas, sem shell e sem package manager, rodando como usuário não root, com base Alpine ou Debian. O argumento de venda era redução de superfície de ataque na casa de 95%. O modelo, no lançamento, era pago.

Em **17/12/2025** o modelo virou: mais de mil imagens passaram a ser [gratuitas e open source sob Apache 2.0](https://www.docker.com/press-release/docker-makes-hardened-images-free-open-and-transparent-for-everyone/), com SBOM completo, dado de CVE transparente e proveniência SLSA Build Level 3. O pago ficou restrito ao DHI Enterprise, com SLA de remediação de CVE crítico em menos de sete dias, imagens FIPS e STIG e customização.

Em **2026** o catálogo seguiu crescendo: [Hardened System Packages](https://www.docker.com/blog/announcing-docker-hardened-system-packages/) em 03/03/2026 e, no [balanço de um ano](https://www.docker.com/blog/why-we-chose-the-harder-path-docker-hardened-images-one-year-later/) publicado em 14/04/2026, 500 mil pulls por dia e mais de 2 mil imagens.

**O fim da Minimus.** Em 25/08/2026 a Docker publicou um [guia de migração da Minimus para o DHI](https://www.docker.com/blog/moving-from-minimus-to-docker-hardened-images/). Vale ser preciso aqui, porque é fácil ler errado: **não houve aquisição**. A Minimus encerrou operações e o registry dela sai do ar em **22/10/2026**. Imagem já baixada continua rodando, mas sem receber patch de CVE. Quem dependia daquelas bases precisa trocar a linha \`FROM\` antes dessa data.

**ELS (Extended Lifecycle Support).** É o add-on pago do DHI para software que já passou do fim de vida upstream, com patch por até cinco anos após o EOL, SLA de 14 dias para CVE crítica ou alta, imagens buildadas do fonte e assinadas, com SBOM, VEX e SLSA Build Level 3. O exemplo que a Docker usou para explicar o produto foi o [fim de vida do MinIO](https://www.docker.com/blog/minio-end-of-life-how-to-stay-patched-and-audit-ready-with-docker-els/), em 24/08/2026.

Se o assunto é reduzir imagem sem comprar catálogo, a abordagem de imagem mínima construída na mão está em [Imagens de contêiners Python no Kubernetes com Distroless](/artigos/docker-python-distroless-kubernetes).

## Build e Compose

**Docker Bake virou GA** em 05/02/2025, junto com o Docker Desktop 4.38. O [anúncio oficial](https://www.docker.com/blog/ga-launch-docker-bake/) descreve o que ele resolve: orquestração declarativa de build em HCL, YAML ou JSON, com paralelização e deduplicação de transferência de contexto. Em 28.1 ele deixou de ser subcomando do buildx e virou \`docker bake\` direto.

**Compose entrou na era dos agentes** em 10/07/2025. O [anúncio](https://www.docker.com/blog/build-ai-agents-with-docker-compose/) mostra modelos abertos, agentes e ferramentas MCP declarados no mesmo \`compose.yaml\` e subindo com um \`docker compose up\`, integrando Model Runner, MCP Gateway e Offload. A documentação está no [guia de agentic AI](https://docs.docker.com/guides/agentic-ai/). Veio junto deploy direto para Google Cloud Run via \`gcloud run compose up\`.

Vale uma ressalva de precisão: o \`docker compose watch\`, da seção \`develop\`, não teve anúncio de GA nessa janela. Ele amadureceu no período, mas já existia antes.

## Segurança do período

Além dos CVEs já citados por release, quatro eventos merecem registro.

**O trio de escape do runc (novembro de 2025).** Corrigido no Engine 28.5.2, em 05/11/2025, e no runc 1.2.8 e 1.3.3. São três falhas que juntas permitem escapar do container: CVE-2025-31133 (condição de corrida em \`maskedPaths\`), CVE-2025-52565 (\`/dev/console\` via symlink) e CVE-2025-52881 (escritas redirecionadas para \`/proc\`). É o item mais grave da janela em severidade.

**A CVE-2025-54388 (julho de 2025).** Um reload do firewalld reabria portas publicadas que o 28.0 tinha fechado. Bom lembrete de que endurecimento de default só vale se sobreviver ao ciclo de vida do host.

**O comprometimento da supply chain do Trivy (março de 2026).** Entre 19 e 23/03/2026 o CI/CD da Aqua foi invadido e as imagens \`aquasec/trivy\` nas tags \`0.69.4\`, \`0.69.5\`, \`0.69.6\` e \`latest\` foram publicadas no Docker Hub com um infostealer que roubava \`~/.docker/config.json\`, credenciais de AWS, GCP e Azure, chaves SSH e token de Kubernetes. A última tag limpa é a \`0.69.3\`. A Docker publicou [o que usuários do Hub precisavam saber](https://www.docker.com/blog/trivy-supply-chain-compromise-what-docker-hub-users-should-know/) e confirmou que a infraestrutura dela e o DHI não foram comprometidos. A ironia é difícil de ignorar: a ferramenta de escanear vulnerabilidade virou o vetor.

**A redução de escopo do NVD (maio de 2026).** O NIST estreitou o que entra no National Vulnerability Database, o que afeta qualquer programa de scanning que trata o NVD como fonte única. A Docker escreveu sobre [o que reavaliar](https://www.docker.com/blog/nist-narrows-the-nvd-what-container-security-programs-should-reassess/) em 13/05/2026.

## A virada para agentes

Boa parte do investimento da Docker nos últimos dois anos foi para IA. Em ordem:

- **Model Runner** ficou [GA em 18/09/2025](https://www.docker.com/blog/announcing-docker-model-runner-ga/). Roda LLM local, puxa modelo do Docker Hub em formato OCI ou do HuggingFace em GGUF, expõe **API compatível com a da OpenAI** e usa GPU em macOS com Apple Silicon, Windows com NVIDIA ou Qualcomm e Linux. É construído sobre o llama.cpp e é open source. Em 26/02/2026 ganhou vLLM no Apple Silicon.
- **MCP Catalog e MCP Toolkit** foram anunciados em 22/04/2025 e ficaram [disponíveis em beta em 05/05/2025](https://www.docker.com/blog/announcing-docker-mcp-catalog-and-toolkit-beta/), com mais de 100 servidores MCP conteinerizados no Hub e gestão de credenciais com isolamento por container.
- **MCP Gateway** saiu em 09/07/2025 como [projeto open source](https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/), disponível em [github.com/docker/mcp-gateway](https://github.com/docker/mcp-gateway). É um ponto único de enforcement entre agente e servidores MCP, com \`--verify-signatures\`, \`--log-calls\` e \`--block-secrets\`. Se MCP com Docker é o assunto, escrevi sobre o uso prático em [MCP Server com Docker e Terraform](/artigos/terraform-mcp-server-docker).
- **cagent** é o runtime de agentes declarado em YAML, distribuível como artefato OCI pelo Docker Hub, [apresentado em 2025](https://www.docker.com/blog/cagent-build-and-distribute-ai-agents-and-workflows/) e depois integrado ao Docker Desktop, com suporte a Agent Client Protocol.
- **Docker Offload** entrou em beta em 10/07/2025 e ficou [GA em 02/04/2026](https://www.docker.com/blog/docker-offload-now-generally-available/), como add-on de Docker Business. Manda build e execução para infraestrutura na nuvem da Docker, com GPU opcional.
- **Gordon**, o agente de IA integrado ao fluxo de container, ficou [GA em 19/05/2026](https://www.docker.com/blog/meet-gordon-dockers-ai-agent-for-your-entire-container-workflow/), gratuito em qualquer conta, com um tier Gordon Plus a 20 dólares por mês.
- **Docker Sandboxes** é o movimento mais recente, anunciado em 30/01/2026 e detalhado em [Run Agents in YOLO Mode, Safely](https://www.docker.com/blog/docker-sandboxes-run-agents-in-yolo-mode-safely/) em 31/03/2026. Roda agente de código em **microVM**, cada sandbox com daemon Docker, filesystem e rede próprios, via CLI \`sbx\`. A [documentação](https://docs.docker.com/ai/sandboxes/) diz que o CLI é gratuito inclusive para uso comercial, e que só os recursos de governança organizacional exigem assinatura. Em 16/04/2026 a Docker explicou [por que microVM e não container](https://www.docker.com/blog/why-microvms-the-architecture-behind-docker-sandboxes/): o VMM é proprietário justamente para funcionar em macOS e Windows.

O fio comum é o mesmo que já discuti em [Loop Engineering na prática](/artigos/loop-engineering-na-pratica): a pergunta deixou de ser se o agente escreve código e passou a ser onde ele executa, com qual credencial e sob qual limite.

## De relance

- **Docker VMM** entrou em [public beta em 12/08/2026](https://www.docker.com/blog/docker-vmm-public-beta-a-complete-overhaul-built-for-performance/), reescrito para performance.
- **Verified Publisher** virou self-serve em 20/08/2026.
- **OIDC para GitHub Actions** em organizações Docker saiu em 31/07/2026, o que elimina secret de longa duração no pipeline.
- **Docker Desktop** passou por 4.40 (Model Runner), 4.43 (MCP Catalog remodelado e Compose Bridge, que gera configuração de Kubernetes) e 4.50 (ferramentas de debug gratuitas).
- **Não há anúncio oficial** de mudança de preço ou de limite do Docker Hub em 2026. O que circula em site de terceiros sobre "allowance com overage" não tem fonte primária, então não tratei como fato.

## O que eu tiro disso

Olhando os dois anos inteiros, três coisas entram na minha lista de atenção.

**A primeira é o 28.0.** É a única mudança do período que quebra ambiente em produção de forma silenciosa e difícil de diagnosticar, porque o sintoma aparece longe da causa: alguém perde acesso a um serviço que "sempre funcionou" e ninguém associa a um upgrade de Engine. Vale saber que os escapes existem e, mais importante, resistir a usar o \`allow-direct-routing\` como primeiro reflexo.

**A segunda é o 29 como pacote.** containerd image store por padrão, cgroup v1 depreciado, Content Trust removido e chains de iptables renomeadas são quatro coisas independentes que chegam no mesmo release. Nenhuma é urgente sozinha, e é justamente por isso que elas acumulam até virar um upgrade grande e arriscado lá na frente.

**A terceira é a virada de eixo do produto.** Em dois anos a Docker foi de "empresa de container" para "empresa de container e de infraestrutura para agente". Sandboxes, Offload, Gordon e cagent não são feature isolada, é uma aposta de portfólio. Para quem trabalha com plataforma, a pergunta prática é se isso vira dependência nova ou se fica como opção, e a resposta ainda não está dada.

O resto, imagem, build, Compose e registry, continua sendo o mesmo Docker de sempre, o que é uma boa notícia sobre a estabilidade da base.

## Referências

- [Docker Engine release notes 27](https://docs.docker.com/engine/release-notes/27/)
- [Docker Engine release notes 28](https://docs.docker.com/engine/release-notes/28/)
- [Docker Engine release notes 29](https://docs.docker.com/engine/release-notes/29/)
- [Hardening Container Networking by Default](https://www.docker.com/blog/docker-engine-28-hardening-container-networking-by-default/)
- [Docker Hub: uso e limites de pull](https://docs.docker.com/docker-hub/usage/pulls/)
- [Revisiting Docker Hub Policies](https://www.docker.com/blog/revisiting-docker-hub-policies-prioritizing-developer-experience/)
- [Announcing Upgraded Docker Plans](https://www.docker.com/blog/november-2024-updated-plans-announcement/)
- [Introducing Docker Hardened Images](https://www.docker.com/blog/introducing-docker-hardened-images/)
- [Docker Hardened Images grátis e open source](https://www.docker.com/press-release/docker-makes-hardened-images-free-open-and-transparent-for-everyone/)
- [Migração da Minimus para Docker Hardened Images](https://www.docker.com/blog/moving-from-minimus-to-docker-hardened-images/)
- [Docker ELS e o fim de vida do MinIO](https://www.docker.com/blog/minio-end-of-life-how-to-stay-patched-and-audit-ready-with-docker-els/)
- [GA do Docker Bake](https://www.docker.com/blog/ga-launch-docker-bake/)
- [Build AI Agents with Docker Compose](https://www.docker.com/blog/build-ai-agents-with-docker-compose/)
- [GA do Docker Model Runner](https://www.docker.com/blog/announcing-docker-model-runner-ga/)
- [Docker MCP Catalog e Toolkit](https://www.docker.com/blog/announcing-docker-mcp-catalog-and-toolkit-beta/)
- [Docker MCP Gateway](https://www.docker.com/blog/docker-mcp-gateway-secure-infrastructure-for-agentic-ai/)
- [GA do Docker Offload](https://www.docker.com/blog/docker-offload-now-generally-available/)
- [Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)
- [Comprometimento da supply chain do Trivy](https://www.docker.com/blog/trivy-supply-chain-compromise-what-docker-hub-users-should-know/)
- [Aposentadoria do Docker Content Trust](https://www.docker.com/blog/docker-content-trust-retirement-and-migration-guidance/)
- [runc releases e advisories](https://github.com/opencontainers/runc/releases)
`,
  date: "2026-09-19",
  category: "Artigos",
  readTime: "18 min de leitura",
  tags: ["DevOps"]
};
