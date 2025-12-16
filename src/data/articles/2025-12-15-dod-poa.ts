import { Article } from './types';

export const article: Article = {
  slug: "devopsdays-poa-2025",
  title: "Segurança em Camadas e Open Source no DevOpsDays POA 2025",
  excerpt: "No dia 29 de novembro de 2025, participei do DevOpsDays Porto Alegre — o maior encontro da cultura DevOps do sul do país — levando uma talk sobre Defesa em Profundidade e ferramentas Open Source para proteger ambientes Cloud Native.",
  content: `
# DevOpsDays Porto Alegre 2025

No dia **29 de novembro de 2025**, estive presente no [**DevOpsDays Porto Alegre**](https://devopsdays.org/events/2025-porto-alegre/welcome/), realizado no histórico **Salão Piratini do Hotel Continental, em Porto Alegre - RS**.
O evento reuniu a comunidade técnica do sul do país para um dia intenso de **Cultura DevOps, SRE, automação e muita troca de experiências**.

O DevOpsDays é conhecido mundialmente como a "Copa do Mundo" para quem ama infraestrutura ágil, e a edição de POA manteve a tradição: conteúdo de altíssimo nível e o famoso formato de *Open Spaces* para desconferências.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/01.png)

## Minha palestra

### Como aplicar Segurança em Camadas na sua arquitetura Cloud Native com Open Source

Fui convidado para apresentar a palestra **"Como aplicar Segurança em Camadas na sua arquitetura Cloud Native com Open Source"**, onde desmistifiquei a ideia de que segurança é apenas borda ou firewall.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/02.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/03.jpg)

Durante a sessão, exploramos a estratégia de **Defesa em Profundidade (Defense in Depth)**, saindo da teoria para a prática com ferramentas do ecossistema CNCF:

- **Fundação e Segurança Física:** Conformidade automatizada com **OpenSCAP** e benchmarks CIS.
- **Identidade como Perímetro (Zero Trust):** Acesso seguro sem VPNs tradicionais usando **HashiCorp Boundary** e gestão via **Keycloak**.
- **Rede e Runtime:** O poder do **eBPF** com **Cilium** para observabilidade e **Falco** para detecção de ameaças em tempo real.
- **Segurança de Aplicação:** Proteção de APIs com **Kong** e gestão de segredos com **Vault**.
- **Supply Chain:** Scans de vulnerabilidade com **Trivy** e assinatura digital com **Cosign**.

A mensagem principal foi clara: a defesa deve ser contínua e integrada em cada camada: **Cloud → Cluster → Container → Código**.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/04.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/05.jpg)

## Destaques do Evento

A programação técnica foi excelente, especialmente a parte da tarde! Após minha apresentação, tive a oportunidade de acompanhar grandes colegas da comunidade que trouxeram temas extremamente relevantes para o nosso dia a dia:

- **Daniel Rodrigues** falando sobre *Chaos Mesh: Engenharia do caos para Kubernetes*, explorando como injetar falhas de forma controlada.
- **João Brito** com a palestra *As quatro dimensões de segurança em Kubernetes*, um excelente complemento ao meu tema.
- **Vinicius Campitelli** sobre *Criando esteiras de CI/CD performáticas e seguras*, um tema vital para a cultura DevOps.
- **Cristiano Diedrich** abordando o *DevFinOps - Além das tags*, mostrando a evolução da mentalidade de custos e eficiência.
- O tradicional **Coffee Break** (16:15), um momento perfeito para recarregar as energias e fazer um networking de qualidade.

Além das palestras, o formato contou com *Open Spaces* e *Ignite Talks*, permitindo discussões orgânicas sobre os desafios reais das operações, algo que só um evento comunitário proporciona.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/06.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/07.jpg)

## Networking e Comunidade

Como **DevOps Institute Ambassador** e **Alura Star**, esses eventos são momentos preciosos.
É inspirador ver tanta gente nova interessada em aprender e tantos profissionais experientes dispostos a compartilhar. O networking em Porto Alegre é sempre diferenciado, com conversas profundas que vão desde arquitetura até carreira.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/08.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/09.jpg)

Participar do **DevOpsDays POA 2025** reforçou minha crença de que segurança não é um produto que você compra, mas um processo que você constrói — preferencialmente com o apoio da comunidade Open Source.

> **Segurança começa na fundação.**
> Não existe "bala de prata", existe defesa em camadas.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dodpoa25/Certificate.png)

- <i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:** [Defesa em Camadas com Open Source](https://stoblobcertificados011.blob.core.windows.net/palestras/dod-poa25.pdf)
`,
  date: "2025-12-02",
  category: "Registro Eventos Presenciais",
  readTime: "3 min de leitura",
  mediumUrl: ""
};