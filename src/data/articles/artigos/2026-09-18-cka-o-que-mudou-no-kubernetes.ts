import type { Article } from '../types';

export const article: Article = {
  slug: "cka-o-que-mudou-no-kubernetes",
  title: "CKA: 9 meses de Kubernetes que a minha prova não cobriu",
  excerpt:
    "Certifiquei na CKA sob o currículo v1.34. Nove meses e três releases depois, o que mudou no Kubernetes — e o que o currículo do exame não registrou.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/cka-o-que-mudou-no-kubernetes/capa.png",
  content: `

![Linha do tempo do Kubernetes entre as versões 1.34 e 1.37, marcando o ponto da certificação CKA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/cka-o-que-mudou-no-kubernetes/capa.png)

Passei na **CKA (Certified Kubernetes Administrator)** em **23/12/2025**. Contei como foi a preparação em [Como foi minha jornada para a certificação CKA](/artigos/jornada-certificacao-cka) — este artigo é o capítulo seguinte: o que aconteceu com o Kubernetes **depois** que eu certifiquei.

A pergunta que me fiz foi simples: quanto do que eu estudei continua sendo o estado da arte? Fui atrás da resposta versão por versão, e o resultado é mais interessante do que eu esperava — porque o **currículo do exame não mudou uma vírgula** no período, mas o ecossistema em volta dele mudou bastante.

## O que estava valendo no dia da prova

A CKA não segue o release do Kubernetes automaticamente. A CNCF publica uma versão nova do documento de currículo e só a partir dali o ambiente de prova migra. O commit que trocou \`v1.34\` por \`v1.35\` no repositório [cncf/curriculum](https://github.com/cncf/curriculum) só aconteceu em **03/03/2026** — mais de dois meses depois da minha prova.

Ou seja: a v1.35 do Kubernetes saiu em 17/12/2025, seis dias antes de eu sentar para a prova, e ainda assim **o exame inteiro rodou sobre o currículo v1.34**. Não foi sorte de grace period, foi o funcionamento normal do processo.

| Item | Situação |
|---|---|
| Currículo vigente na prova | v1.34 |
| Certificação emitida | 23/12/2025 |
| Válida até | 23/12/2027 |
| Releases do Core desde então | 3 (v1.35, v1.36, v1.37) |
| Currículo vigente hoje | v1.35 — idêntico ao v1.34 |

## Três releases depois: 1.35, 1.36 e 1.37

### v1.35 "Timbernetes" — 17/12/2025

60 enhancements (17 stable, 19 beta, 22 alpha). O destaque prático:

- **In-place Pod resource updates** chega a GA — ajustar CPU e memória de um Pod **sem recriá-lo**. Quem já teve que reiniciar um StatefulSet inteiro para subir o limite de memória de um container sabe o tamanho disso.
- \`Job.spec.managedBy\` e supplemental groups de granularidade fina, ambos GA.
- Diretório \`drop-in\` para configuração modular do kubelet, GA.
- Em beta: certificados de identidade nativos por Pod, reconciliação de rotas via watch no Cloud Controller Manager, scheduling sensível à carga do workload, tolerations com operadores numéricos e node affinity mutável em PV.

### v1.36 "Haru" — 22/04/2026

70 enhancements (18 stable, 25 beta, 25 alpha) — o maior salto do período.

- **User Namespaces** e **Mutating Admission Policies** chegam a GA.
- Também GA: autorização granular da API HTTPS do kubelet, SELinux labeling em mount-time, Declarative Validation e Volume Group Snapshots.
- Em beta: toda a família nova de DRA (Partitionable Devices, Consumable Capacity, Device Taints/Tolerations), Gang Scheduling API, Memory QoS via cgroup v2 e resize vertical in-place.
- **Removidos de vez**: o plugin de volume \`gitRepo\` (avisado desde a 1.11), o suporte a flex-volume no kubeadm e o driver in-tree do Portworx.

### v1.37 "Garhwal" — 26/08/2026

67 enhancements (16 stable, 23 beta, 27 alpha, 1 remoção). Essa saiu **depois** de eu começar este levantamento, então vale o registro do que de fato entrou — e não do que o sneak peek prometia.

- **KYAML** estável na saída do \`kubectl\`: \`kubectl get -o kyaml\` sai do feature gate e passa a vir ligado por padrão em todo comando que aceita \`--output\`. Todo arquivo KYAML continua sendo YAML válido, então nada na pipeline precisa mudar — o ganho é não depender mais de indentação sensível.
- **Device taints e tolerations do DRA** chegam a stable, com o objeto \`DeviceTaintRule\`. Falo disso em detalhe mais abaixo.
- Também GA: **Metrics API**, **Storage Version Migration** (ligado por padrão) e **Pod Certificates + ClusterTrustBundles**.
- Em beta: pod-level resource managers (recursos compartilhados entre containers de um Pod — que o sneak peek anunciava como GA e acabou ficando em beta), Memory QoS, native histograms, kubelet rootless (\`KubeletInUserNamespace\`) e **HPA com scale-to-zero**.

**Vale a atenção:** começou formalmente a fase de saída do modo **IPVS** do kube-proxy. Ainda não é urgente — o plano público é desabilitar por padrão na 1.40 e remover de vez na 1.43 — mas o relógio começou a contar.

![Comparativo entre um webhook mutador externo e uma MutatingAdmissionPolicy avaliada em CEL dentro do API server](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/cka-o-que-mudou-no-kubernetes/1.png)

## Traduzindo: Mutating Admission Policies

Se você quer alterar um objeto automaticamente no momento em que ele é criado — injetar um sidecar, forçar um label, setar um default — a forma nativa até a v1.36 era escrever e hospedar um **webhook**: um serviço HTTP seu que o API server chama a cada request, com toda a complexidade de TLS, disponibilidade e latência que isso implica. Se o webhook cai, dependendo do \`failurePolicy\`, o cluster para de aceitar Pod.

A v1.36 transforma essa lógica de mutação em um **objeto Kubernetes declarado em CEL**, sem nenhum serviço próprio no ar:

\`\`\`yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicy
metadata:
  name: injeta-label-de-time
spec:
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["pods"]
  mutations:
    - patchType: ApplyConfiguration
      applyConfiguration:
        expression: >-
          Object{ metadata: Object.metadata{ labels: {"time": "plataforma"} } }
\`\`\`

É o mesmo raciocínio que a **ValidatingAdmissionPolicy** já tinha trazido para validação — isso é anterior à minha prova e cai no currículo — agora estendido para mutação. Na prática, onde hoje existe um webhook mutador em produção (injeção de sidecar de service mesh é o caso clássico), passa a existir uma alternativa nativa sem processo externo para manter no ar.

## Traduzindo: a família DRA

A **Dynamic Resource Allocation** já era GA na minha própria versão, a v1.34 — o mecanismo por trás de scheduling de GPU e TPU deixou de ser experimental exatamente ali. O que chegou depois foram as peças que faltavam para ela ser útil em produção de verdade.

O problema do modelo antigo de device plugin: ele trata dispositivos como **inteiros opacos**. O nó diz "tenho 2 GPUs disponíveis" e acabou. Não dava para pedir metade de uma GPU, nem dizer quais GPUs precisam estar conectadas entre si por NVLink, nem reagir quando uma delas apresenta falha.

- **Partitionable Devices** (beta na 1.36) permite fatiar um acelerador em pedaços menores que "a placa inteira".
- **Consumable Capacity** (beta na 1.36) modela capacidade que se consome, em vez de um contador de unidades.
- **Device Taints e Tolerations** (beta na 1.36, **stable na 1.37**) aplica em dispositivos individuais o mesmo padrão de \`taint\`/\`toleration\` que hoje só existe para nós. Um driver DRA pode marcar um device como tainted para que ele seja pulado no scheduling, e o admin pode aplicar o mesmo taint no cluster inteiro via \`DeviceTaintRule\`, sem reconfigurar driver nenhum. Pods que já usam o device podem ser despejados automaticamente, a menos que o \`ResourceClaim\` tolere o taint explicitamente.

O ganho operacional é direto: uma GPU com falha de hardware pode ser marcada \`NoSchedule\` **sem tirar o nó inteiro de circulação**.

## Networking: o fim do Ingress NGINX

De tudo que mudou no período, essa é a que mais pesa no domínio **Services & Networking** — 20% do peso do exame. E não porque o texto do currículo mudou, mas porque o controller que praticamente todo mundo usava para praticar Ingress **deixou de existir como projeto ativo**.

| Data | O que aconteceu |
|---|---|
| 12/11/2025 | SIG Network e o Security Response Committee anunciam a intenção de retirar o Ingress NGINX |
| 29/01/2026 | Comunicado oficial conjunto do Steering Committee e do Security Response Committee confirma o plano e o cronograma |
| 24/03/2026 | Retirada efetiva — o repositório \`kubernetes/ingress-nginx\` é arquivado, fica read-only e não recebe mais patch de segurança |

### O que foi retirado — e o que não foi

O projeto retirado é o \`kubernetes/ingress-nginx\`, mantido pela comunidade sob a SIG Network, que a estimativa oficial aponta como presente em cerca de metade de todos os clusters Kubernetes do mundo.

Duas confusões que vale desfazer:

- **Não é o mesmo projeto** que o NGINX Ingress Controller da F5 (\`nginxinc/kubernetes-ingress\`). Código diferente, mantenedor diferente, não afetado pela decisão.
- **A API \`Ingress\` continua existindo** no Kubernetes, sem plano de remoção. O que não existe mais é o controller de referência que a implementava.

O currículo da CKA nunca citou "ingress-nginx" pelo nome. Ele sempre pediu, em paralelo, "usar Ingress controllers e recursos Ingress" **e** "usar a Gateway API para gerenciar tráfego de Ingress" — desde antes da minha prova. O que muda na prática é que, se você monta um cluster de estudo hoje, a rota mais óbvia deixou de existir, e a **Gateway API virou a primeira opção**, não mais a alternativa.

### Gateway API na prática

Onde antes um único objeto \`Ingress\` concentrava regra de host, path e o nome da \`IngressClass\`, a Gateway API separa a coisa em papéis: quem administra a infraestrutura de entrada cria um \`Gateway\` (a porta de entrada, ligada a uma \`GatewayClass\` que aponta para o controller de fato); quem é dono da aplicação cria um \`HTTPRoute\` apontando para esse Gateway, sem precisar saber nada sobre o load balancer por trás.

\`\`\`yaml
# Antes: um Ingress só, misturando infraestrutura e regra de aplicação
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
spec:
  ingressClassName: nginx
  rules:
    - host: api.exemplo.com.br
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-v1
                port:
                  number: 80
\`\`\`

\`\`\`yaml
# Depois: Gateway (time de infra) e HTTPRoute (time de aplicação), separados
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api
spec:
  parentRefs:
    - name: gateway-publico
  hostnames:
    - "api.exemplo.com.br"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /v1
      backendRefs:
        - name: api-v1
          port: 80
\`\`\`

Essa migração eu já fiz na prática, com conversão automatizada e auditoria do que não dava para converter — está contada em [De NGINX Ingress para Envoy Gateway](/artigos/nginx-envoy-gateway). Aqui fica só o contexto de por que ela virou obrigatória.

![Tabela comparando os cinco domínios do currículo da CKA nas versões v1.34 e v1.35, com pesos idênticos](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/cka-o-que-mudou-no-kubernetes/2.png)

## O currículo da CKA não mudou uma linha

Baixei os dois PDFs oficiais do \`cncf/curriculum\` — o v1.34, vigente quando certifiquei, e o v1.35, vigente hoje — e comparei. São idênticos: mesmos cinco domínios, mesmos pesos, mesmas bullets, palavra por palavra. Só o número da versão no rodapé mudou.

Não era o que eu esperava encontrar, mas registrar "nada mudou" é mais útil do que inventar uma diferença que não existe.

| Domínio | Peso | Conteúdo em v1.34 e v1.35 |
|---|---|---|
| Troubleshooting | 30% | clusters, nodes, componentes, rede, uso de recursos |
| Cluster Architecture | 25% | kubeadm, HA control plane, RBAC, Helm/Kustomize, CNI/CSI/CRI, CRDs e operators |
| Services & Networking | 20% | NetworkPolicy, ClusterIP/NodePort/LoadBalancer, Gateway API e Ingress, CoreDNS |
| Workloads & Scheduling | 15% | deployments, ConfigMap/Secret, autoscaling, admission e scheduling |
| Storage | 10% | StorageClass, volumes, PV e PVC |

A última revisão de conteúdo de fato — não só de número de versão — foi em **fevereiro de 2025**, quando Helm, Kustomize, Gateway API, NetworkPolicy, CRDs e as interfaces de extensão (CNI, CSI, CRI) entraram no currículo. Isso é **anterior** à minha prova: eu já fui testado sobre tudo isso.

A conclusão incômoda é que a lacuna real não está no texto do currículo. Está no que mudou **por fora** dele.

## Comunidade e roadmap: o que ainda não virou currículo

Quatro movimentos do período que não caem em nenhuma bullet do exame, mas dizem para onde o Kubernetes está indo.

| Movimento | Data | Por que importa |
|---|---|---|
| Spotlight do WG Device Management | 24/06/2026 | O grupo por trás da DRA. A citação central é que o modelo antigo de device plugin "trata dispositivos como inteiros opacos". A família de extensões da 1.36 e 1.37 é onde isso vira utilizável com hardware real de IA |
| Formação do AI Gateway Working Group | 09/03/2026 | Novo WG para tráfego de IA sobre a Gateway API — políticas como rate limiting por token, e não por request, pensadas para o padrão de consumo de LLM. Ainda sem objeto estável no Core |
| Formação do Checkpoint/Restore WG | 21/01/2026 | Formaliza o trabalho de tirar snapshot de um container em execução e restaurá-lo depois. Casos citados: acelerar workloads de boot pesado (Java, inferência de LLM) e checkpoint periódico para fault-tolerance em jobs longos |
| Fim da replicação de assinatura de imagem | 05/06/2026 | O \`registry.k8s.io\` parou de copiar a assinatura cosign de cada imagem para as 22 regiões. O roteador \`archeio\` agora manda todo pedido de assinatura para um único upstream canônico. Supply chain, não currículo — mas é o tipo de detalhe que some do radar até quebrar algo |

![Mapa dos dois pontos que valem prática após a certificação: família DRA e migração para Gateway API](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/cka-o-que-mudou-no-kubernetes/3.png)

## O que eu realmente vou praticar

A CKA vale até **23/12/2027** e nada aqui invalida o certificado — recertificar não é necessário por causa de nenhuma dessas mudanças. Se o objetivo é continuar afiado, o levantamento aponta dois pontos, e só dois:

- **A família DRA**. Device management para GPU e cargas de IA não tem linha própria no currículo, mas é onde o projeto está concentrando esforço de verdade. Vale montar um cenário com \`DeviceTaintRule\` e entender o ciclo de \`ResourceClaim\`.
- **A migração definitiva de Ingress para Gateway API**. O currículo já cobria os dois desde antes da prova. O que mudou foi qual dos dois ainda existe como implementação de referência.

Todo o resto — troubleshooting, kubeadm, RBAC, NetworkPolicy, storage — continua exatamente como estava. O que é, no fundo, uma boa notícia sobre a estabilidade do que a certificação cobra.

## Referências

- [Kubernetes v1.35: Timbernetes](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/)
- [Kubernetes v1.36 released — InfoQ](https://www.infoq.com/news/2026/05/kubernetes-1-36-released/)
- [Kubernetes v1.37: Garhwal](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)
- [Kubernetes v1.37: DRA Updates](https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/)
- [Device Taints and Tolerations — documentação oficial](https://kubernetes.io/docs/concepts/resource-management/dynamic-resource-allocation/device-taints/)
- [Comunicado oficial de retirada do Ingress NGINX](https://kubernetes.io/blog/2026/01/29/ingress-nginx-statement/)
- [The end of an era: transitioning away from Ingress NGINX — Google Open Source Blog](https://opensource.googleblog.com/2026/02/the-end-of-an-era-transitioning-away-from-ingress-nginx.html)
- [Spotlight do WG Device Management](https://www.kubernetes.dev/blog/2026/06/24/wg-device-management-spotlight-2026/)
- [Anúncio do AI Gateway Working Group](https://kubernetes.io/blog/2026/03/09/announcing-ai-gateway-wg/)
- [Anúncio do Checkpoint/Restore Working Group](https://www.kubernetes.dev/blog/2026/01/21/introducing-checkpoint-restore-wg/)
- [cncf/curriculum — PDFs oficiais do currículo da CKA](https://github.com/cncf/curriculum)
`,
  date: "2026-09-18",
  category: "Artigos",
  readTime: "13 min de leitura",
  tags: ["Kubernetes", "Certificações", "DevOps"]
};
