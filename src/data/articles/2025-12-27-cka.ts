import { Article } from './types';

export const article: Article = {
  slug: "jornada-certificacao-cka",
  title: "Como foi minha jornada para a certificação CKA",
  excerpt: "Três meses de estudo focado, labs diários na KodeKloud, simulados e checklists que usei para conquistar a certificação CKA.",
  content: `# Como foi minha jornada para a certificação CKA


Há 3 meses decidi tirar a certificação **[CKA (Certified Kubernetes Administrator)](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/)**. Para acelerar os estudos, segui a trilha da **KodeKloud**, que é referência absoluta no mercado. 

Minha base já contava com o conhecimento dos cursos do **[DevOpsPro](https://curso.devopspro.com.br/devops-pro/)** e da **[LinuxTips](https://linuxtips.io/)**, além da experiência prática que tenho no trabalho. No entanto, para a prova, eu precisava de velocidade e precisão. 

Utilizei exaustivamente o curso **[Ultimate Certified Kubernetes Administrator (CKA) Mock Exam Series](https://learn.kodekloud.com/user/courses/ultimate-certified-kubernetes-administrator-cka-mock-exam-series)**. Os exercícios reproduzem a pressão do exame real e me ajudaram a automatizar a resolução de problemas complexos em cenários de cluster real. Documentei abaixo o que funcionou para chegar pronto no dia da prova.

### Certificados dos Cursos de Preparação

**[Curso Certified Kubernetes Administrator (KodeKloud)](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/?couponCode=PMNVD2025)**

![Certificado do curso KodeKloud CKA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/cka/certificatecourse.png)

**[Udemy Labs - Certified Kubernetes Administrator with Practice Tests](https://learn.kodekloud.com/user/courses/udemy-labs-certified-kubernetes-administrator-with-practice-tests)**

![Certificado Udemy Labs CKA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/cka/certificatelabs.png)

**[Curso Ultimate CKA Mock Exam Series (KodeKloud)](https://learn.kodekloud.com/user/courses/ultimate-certified-kubernetes-administrator-cka-mock-exam-series)**

![Certificado Mock Exam Series](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/cka/certificateUltimatelab.png)

### 🏆 Resultado da Prova CKA

> **Exam Results**
> - **Status:** Pass ✅
> - **Your Score:** 75%
> - **Score Needed:** 66%

![Resultado do exame CKA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/cka/results.png)

### 🎖️ Certificação Oficial

**Certified Kubernetes Administrator (Linux Foundation)**

![Certificado CKA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/cka/certificatecka.png)

# Topicos Abordados na Prova CKA 2025

## 1. Arquitetura do Cluster e Conceitos Core
A base de tudo é entender a separação entre o **Control Plane** e os **Worker Nodes**.

* **ETCD:** O banco de dados chave-valor que armazena todo o estado do cluster. Backup e restauração aqui são críticos.
* **Kube-API Server:** O único componente que fala com o ETCD. Tudo passa por ele.
* **Kube-Scheduler:** Decide em qual nó o seu Pod vai morar, baseando-se em recursos disponíveis.
* **Kubelet:** O agente que roda nos nós e garante que os containers estejam rodando conforme o esperado.
* **Kube-Proxy:** Gerencia as regras de rede (IPtables/IPVS) para permitir a comunicação.

## 2. Gerenciamento do Ciclo de Vida da Aplicação
Administrar aplicações envolve estratégias de atualização e resiliência:

* **Deployments:** Permitem atualizações automáticas (*Rolling Updates*) e reversões (*Rollbacks*).
* **ConfigMaps e Secrets:** Separam a configuração e dados sensíveis do código da imagem.
* **Escalonamento:** O uso de **HPA (Horizontal Pod Autoscaler)** e **VPA (Vertical Pod Autoscaler)** para ajustar a infraestrutura à demanda.

## 3. Agendamento e Escalabilidade Avançada
Não basta rodar o Pod; é preciso saber *onde* ele deve rodar:

* **Taints and Tolerations:** Impedem que Pods sejam colocados em nós específicos, a menos que tenham uma permissão explícita.
* **Node Affinity:** Atrai Pods para nós específicos.
* **Resource Quotas & Limits:** Essenciais para evitar que um único Pod utilize todos os recursos do nó.

## 4. Rede e Conectividade
A parte MAIS desafiadora do exame.

* **Serviços:** ClusterIP (interno), NodePort (exposição básica) e LoadBalancer (integração com nuvem).
* **Ingress vs. Gateway API:** Enquanto o Ingress é o padrão clássico, a **Gateway API** (foco nas atualizações de 2025) oferece um modelo mais expressivo.
* **Network Policies:** O firewall interno do K8s, fundamental para segurança *Zero Trust*.

## 5. Armazenamento (Storage)
A persistência de dados em um ambiente efêmero:

* **PV (Persistent Volume):** O recurso de armazenamento real no cluster.
* **PVC (Persistent Volume Claim):** O "ticket" ou pedido de um usuário por armazenamento.
* **Storage Classes:** Permitem o provisionamento automático e dinâmico de discos.

## 6. Segurança e Manutenção
Garantir a integridade e a atualização do cluster:

* **RBAC (Role-Based Access Control):** Definir **QUEM** pode fazer **O QUÊ** e em **QUAL** Namespace.
* **TLS Certificates:** O Kubernetes usa certificados para todas as comunicações. Saber expirar, renovar e aprovar CSRs é vital.
* **Upgrade do Cluster:** O processo de usar o \`kubeadm\` para atualizar o Control Plane e os Nodes de forma segura.

## 7. Resolução de Problemas (Troubleshooting)
No exame CKA, você passará a maior parte do tempo consertando coisas quebradas.

* **Logs e Describe:** \`kubectl logs\` e \`kubectl describe\` são seus melhores amigos.
* **Componentes de Sistema:** Se o cluster cair, verifique o status do serviço no SO com \`journalctl -u kubelet\`.

### Dica de ouro
Pratique exaustivamente os **Imperative Commands** (\`kubectl run\`, \`kubectl create\`) para ganhar tempo e evitar erros de sintaxe em arquivos YAML.

## Considerações sobre a Prova

A prova CKA 2025 é 100% prática e exige velocidade e precisão. Você terá **2 horas** para resolver entre **15 e 20 questões** em ambientes reais de cluster Kubernetes. Não existe múltipla escolha, apenas você, o terminal e a documentação oficial.

### Questões que Caíram

Durante a prova, encontrei questões que abordavam os seguintes tópicos:

**1. Instalação e Configuração de CNI**
- Instalar o **Calico v3.28.2** via tigera-operator
- Configurar CRDs e verificar NetworkPolicies funcionais

**2. Gestão de Armazenamento**
- Criar **PersistentVolumeClaims** e recuperar dados de volumes existentes
- Configurar **StorageClass** com \`volumeBindingMode: WaitForFirstConsumer\`
- Definir StorageClass padrão do cluster

**3. Troubleshooting de Cluster**
- Corrigir configurações de **kube-apiserver** após migração (etcd endpoints incorretos)
- Identificar componentes quebrados e reiniciar serviços
- Ajustar certificados e paths de arquivos após mudança de máquina

**4. Configuração de Recursos**
- Calcular e aplicar **resource requests** para Pods (dividindo recursos do nó igualmente)
- Configurar sidecard e containers com os mesmos valores de request

**5. Helm e Gerenciamento de Aplicações**
- Instalar **Argo CD** via Helm (versão 7.7.3) sem reinstalar CRDs
- Gerar templates Helm e salvar manifestos
- Usar \`--set crds.install=false\` para evitar conflitos

**6. Ingress e Gateway API**
- Criar recursos Ingress com TLS
- Migrar de Ingress para **Gateway API** (novidade 2025)
- Configurar HTTPRoute e Gateway com hostname específico

**7. Horizontal Pod Autoscaler (HPA)**
- Criar HPA com target de 50% CPU
- Configurar \`downscaleStabilizationWindow\` para 30 segundos
- Instalar e configurar metrics-server quando necessário

**8. Sidecar Containers**
- Adicionar container sidecar para streaming de logs
- Usar volumes compartilhados (\`emptyDir\`)
- Comando: \`tail -n+1 -f /var/log/app.log\`

**9. Services e Exposição**
- Reconfigurar Deployment para expor porta 80/tcp
- Criar Service tipo **NodePort** usando comandos imperativos
- Entender a diferença entre containerPort e Service port

**10. PriorityClass e Preemption**
- Criar PriorityClass com valor específico
- Fazer patch em Deployment existente para usar a nova priority
- Observar eviction de Pods de menor prioridade

**11. ConfigMaps e TLS**
- Atualizar ConfigMap para permitir **TLSv1.2** e **TLSv1.3** em NGINX
- Recriar Pods para aplicar mudanças de configuração
- Testar com \`curl --tls-max 1.2\` (deve falhar)

**12. Custom Resource Definitions (CRDs)**
- Listar CRDs do cert-manager
- Extrair documentação com \`kubectl explain\` (ex: \`certificate.spec.subject\`)
- Salvar outputs em arquivos específicos

**13. Preparação de Sistema (Container Runtime)**
- Instalar e configurar **cri-dockerd** via dpkg
- Configurar parâmetros sysctl para Kubernetes
- Habilitar e startar serviços do systemd

**14. Services com Cálculos de Recursos**
- Expor Deployment via NodePort
- Considerar overhead de 10% e limites adequados

### Distribuição de Pontos

As questões não valem o mesmo. Questões de troubleshooting e setup completo tendem a valer mais (8-12% cada), enquanto tarefas simples como criar um Service valem menos (2-4%). Por isso, é estratégico focar primeiro nas questões que você domina completamente.


## Recursos Recomendados para Preparação

Além do curso da KodeKloud, aqui estão alguns recursos que podem acelerar significativamente sua preparação:

### Repositórios no GitHub

- **[CKA-PREP-2025-v2](https://github.com/vj2201/CKA-PREP-2025-v2)**
- **[CKA2025](https://github.com/gkeskar/CKA2025)**

Esses repositórios contêm questões similares às que caem na prova e são excelentes para praticar cenários hands-on.


### Playlists no YouTube

- **[Playlist 1 — Kubernetes CKA Full Course](https://www.youtube.com/watch?v=kDZEiXHpEks&list=PLSsEvm2nF_8nGkhMyD1sq-DqjwQq8fAii)**
- **[Playlist 2 — CKA Crash Course](https://www.youtube.com/watch?v=-6QTAhprvTo&list=PLkDZsCgo3Isr4NB5cmyqG7OZwYEx5XOjM)**
- **[Playlist 3 — Kubernetes Administrator Series](https://www.youtube.com/watch?v=WFTVTi8JhKc&list=PLvZb3tGyqC1TOasSaN36haM5xlCxHQBlA)**

Assista às playlists enquanto pratica os labs. A combinação de teoria + prática é fundamental para fixar os conceitos.

## Conclusão
A combinação de prática diária, simulados fez toda a diferença. Se você está começando agora, foque em repetir os labs até que os comandos se tornem automáticos.
`,
  date: "2025-12-27",
  category: "Artigos",
  readTime: "9 min de leitura",
  mediumUrl: "",
  badges: [
    {
      name: "Certified Kubernetes Administrator (CKA)",
      provider: "The Linux Foundation",
      image: "https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png",
      link: "https://www.credly.com/badges/975ca65a-c51f-4c70-93d7-85972773c0fd/public_url"
    }
  ]
};