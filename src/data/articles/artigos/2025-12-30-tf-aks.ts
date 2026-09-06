import type { Article } from '../types';

export const article: Article = {
  slug: "aks-spot-terraform-economia-custos-taints",
  title: "AKS Spot & Terraform: Economia de Custos e o Guia Crítico de Taints",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2025-12-30-tf-aks/0.png",
  excerpt: "Como economizar até 90% no AKS com Spot Node Pools via Terraform: taints, tolerations e configurações críticas para evitar interrupções inesperadas.",
  content: `
# AKS Spot & Terraform: Economia de Custos e o Guia Crítico de Taints

![Capa do artigo sobre AKS Spot Node Pools com Terraform](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2025-12-30-tf-aks/0.png)

No ecossistema de nuvem, a eficiência financeira é tão importante quanto a eficiência técnica. [O uso de Azure Spot Node Pools no AKS permite economizar até 90% em comparação com instâncias regulares](https://azure.microsoft.com/pt-br/products/virtual-machines/spot/). Contudo, essa economia exige uma configuração rigorosa de Taints para evitar que sua aplicação sofra interrupções inesperadas.

## 1. O que são Spot Node Pools?

[Instâncias Spot](https://learn.microsoft.com/azure/virtual-machines/spot-vms) utilizam a capacidade ociosa do Azure. Quando o Azure precisa dessa capacidade de volta, ele interrompe as instâncias com um aviso prévio de apenas 30 segundos.

### Características Principais

- **Efemeridade**: Os nós podem ser removidos a qualquer momento.
- **Custo**: Drasticamente reduzido.
- **Casos de Uso**: Processamento em lote, ambientes de teste, CI/CD, cargas de trabalho stateless resilientes, ambientes de desenvolvimento.
- **Limitação**: Não podem ser o pool de sistema (System Node Pool) padrão do cluster.

> **Documentação Oficial**: Para mais detalhes sobre a implementação de [Spot Node Pools no AKS](https://learn.microsoft.com/pt-br/azure/aks/spot-node-pool), consulte a documentação completa da Microsoft.

## 2. O Conceito Vital: Taints e Tolerations

Um **[Taint](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)** é um atributo aplicado a um nó que "repele" pods. Para que um pod seja agendado em um nó com Taint, ele deve possuir uma **Toleration** (tolerância) correspondente.

No contexto de instâncias Spot, o Taint é a sua principal ferramenta de segurança para garantir que apenas pods preparados para interrupções sejam alocados nesses nós.

### Efeitos de Taint no AKS

| Efeito | Descrição |
|--------|-----------|
| **NoSchedule** | O Kubernetes não agendará novos pods no nó se eles não tiverem a tolerância. |
| **NoExecute** | Além de não agendar novos, remove pods existentes que não toleram o nó. |
| **PreferNoSchedule** | O sistema tenta evitar o agendamento, mas pode colocar o pod lá se não houver alternativa. |

## 3. Implementação com Terraform

Para criar um pool de nós Spot com as proteções adequadas, utilizamos o recurso [azurerm_kubernetes_cluster_node_pool](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_node_pool). O exemplo abaixo demonstra a configuração ideal:

\`\`\`terraform
resource "azurerm_kubernetes_cluster_node_pool" "spot" {
  name                  = "spotpool01"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = "Standard_DS2_v2"
  
  # Ativação do modo Spot
  priority              = "Spot"
  eviction_policy       = "Delete" # Deleta a VM após o despejo
  spot_max_price        = -1       # Paga até o preço de uma instância regular

  # Configuração do Taint (Crítico!)
  node_taints = [
    "kubernetes.azure.com/scalesetpriority=spot:NoSchedule"
  ]

  # Labels para seleção de nós via Affinity
  node_labels = {
    "kubernetes.azure.com/scalesetpriority" = "spot"
    "node-type"                             = "preemptible"
  }

  # Autoscaling é altamente recomendado para Spot
  enable_auto_scaling = true
  min_count           = 1
  max_count           = 5
}
\`\`\`

**⚠️ Atenção no Taint**: O AKS aplica por padrão o label \`kubernetes.azure.com/scalesetpriority=spot\`. Ao definir \`node_taints\` manualmente no Terraform, certifique-se de que ele reflete a estratégia de isolamento da sua carga de trabalho.

**Referência Terraform**: Para configurações adicionais do cluster AKS, consulte a documentação do recurso [azurerm_kubernetes_cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster).

## 4. Taints de Inicialização (Node Initialization Taints)

Uma funcionalidade avançada mencionada na [documentação oficial do AKS](https://learn.microsoft.com/azure/aks/use-node-taints) é o **Node Initialization Taint**. Eles são usados para marcar nós no momento da inicialização, garantindo que o tráfego só chegue ao nó após a execução de scripts de configuração ou instalação de agentes de segurança (como o Prisma Cloud ou Cilium).

- **Uso**: Temporário, durante o boot do nó.
- **Terraform**: Pode ser configurado para garantir que o nó esteja "pronto" antes de receber qualquer carga.

![Diagrama de taints de inicialização em nós Spot do AKS](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2025-12-30-tf-aks/1.png)

## 5. Agendando Pods no Pool Spot

Para que sua aplicação utilize os nós criados, você deve configurar o manifesto do Kubernetes com a Toleration correta. Caso contrário, o scheduler ignorará o pool Spot e sua aplicação não rodará (ou rodará no pool regular mais caro).

### Exemplo de Manifesto (YAML)

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-batch-process
spec:
  template:
    spec:
      containers:
      - name: worker
        image: my-repo/worker:latest
      
      # 1. Permite entrar no nó Spot
      tolerations:
      - key: "kubernetes.azure.com/scalesetpriority"
        operator: "Equal"
        value: "spot"
        effect: "NoSchedule"
      
      # 2. Força a preferência pelo nó Spot
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: "kubernetes.azure.com/scalesetpriority"
                operator: In
                values:
                - "spot"
\`\`\`

## 6. Checklist de Atenção

Ao utilizar Terraform para gerenciar AKS Spot, observe estes pontos críticos:

- **Eviction Policy**: Use \`Delete\` para evitar custos de disco orfãos e problemas de cota de vCPU no Azure.
- **[Cluster Autoscaler](https://learn.microsoft.com/azure/aks/cluster-autoscaler)**: Sem ele, se todos os nós Spot forem removidos, o pool pode ficar com 0 nós permanentemente até uma intervenção manual.
- **Upgrade**: Pools Spot não suportam surge upgrade da mesma forma que pools regulares. O nó é simplesmente substituído.
- **SLA**: Lembre-se que instâncias Spot não possuem SLA de disponibilidade.

## 7. FinOps: A Importância da Gestão Financeira em Nuvem

Quando falamos de otimização de custos no Azure, especialmente em ambientes enterprise e de larga escala, **FinOps** (Financial Operations) se torna algo vital. Em infraestruturas complexas, os custos podem escalar rapidamente, tornando essencial uma abordagem estruturada para monitoramento, análise e otimização contínua de gastos.

FinOps não é apenas sobre reduzir custos, mas sim sobre maximizar o valor do investimento em nuvem. Isso envolve:

- **Visibilidade de Custos**: Entender onde e como os recursos estão sendo consumidos
- **Otimização Contínua**: Identificar oportunidades de economia, como o uso de Spot Instances
- **Cultura de Responsabilidade**: Engajar equipes de engenharia, operações e finanças na gestão de custos
- **Decisões Baseadas em Dados**: Usar métricas para tomar decisões informadas sobre arquitetura e recursos

A utilização de Spot Node Pools, como demonstrado neste artigo, é um exemplo prático de como FinOps pode gerar economias significativas (até 90%) sem comprometer a qualidade das aplicações resilientes.

**Aprofunde-se em FinOps**: Para entender melhor como construir uma base sólida em Cloud Native, incluindo práticas de FinOps, DevOps e Sustentabilidade, confira o artigo completo: [Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem](https://www.orafaelferreira.com/artigos/antes-cloud-native-fundacao-solida)

## Conclusão
O uso de AKS Spot via Terraform é uma estratégia brilhante para reduzir a fatura do Azure, mas exige um entendimento profundo do agendador do Kubernetes. Os Taints são sua barreira de proteção: eles garantem que sua aplicação crítica não seja agendada por engano em um nó que pode desaparecer em 30 segundos.
`,
  date: "2025-12-30",
  category: "Artigos",
  readTime: "8 min de leitura"
};
