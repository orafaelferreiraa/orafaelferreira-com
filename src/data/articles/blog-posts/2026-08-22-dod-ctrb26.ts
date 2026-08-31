import { Article } from '../types';

export const article: Article = {
  slug: "dod-ctrb26",
  title: "Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU",
  excerpt: "No DevOpsDays Curitiba 2026, ao lado de Jéssica Mello, contei como usei IA generativa para criar meu portfólio do zero, e como Terraform, GitHub Actions e boas práticas de DevOps garantiram que o deploy em produção, na Azure, fosse meu.",
  content: `
# DevOpsDays Curitiba 2026

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/1.png)


No dia **22 de agosto de 2026**, ao lado de [**Jéssica Mello**](https://www.linkedin.com/in/jessica-tmello/) (LowOps Consultoria), palestrei no [**DevOpsDays Curitiba**](https://devopsdays.org/events/2026-curitiba/welcome/), um dos eventos mais tradicionais da comunidade DevOps no Brasil, realizado no **Auditório Eny Caldeira do Campus Rebouças da UFPR**.

## Agenda

**Sessão:** Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/00.png)

Um estudo de caso sobre como usei IA generativa para criar meu portfólio pessoal do zero, com Terraform, GitHub Actions e boas práticas de DevOps garantiram que o deploy em produção, fosse feito com controle humano.

## A Jornada: Do Prompt ao Deploy

### O Problema

Meu portfólio pessoal (orafaelferreira.com) estava desatualizado. Eu precisava de um site moderno, minimalista e rápido, mas sem tempo para desenhar e codar tudo do zero.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/1.jpg)

### Tudo Começou com um Prompt

Estruturei um prompt detalhado, seções para Home, Sobre, Blog, Palestras, Mentoria e Contato, guidelines de estilo (tema escuro, tipografia moderna, ícones lineares) e requisitos técnicos (SEO, performance, Markdown), e usei o [**Lovable**](https://lovable.dev/) para gerar **100% via IA generativa** a primeira versão.

O resultado: um site one-page, com design moderno e performance ótima. Só que sair de uma one-page para um blog completo era o próximo desafio.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/2.jpg)

### Quando a "Vibe" Encontra a Produção

A modularização começou com refinamento contínuo, via prompts refinados e edição manual estratégica, transformando o one-page em páginas de fato (Home, Sobre, Blog, Palestras, Recomendações).

Mas dois problemas clássicos apareceram: **vendor lock-in** (dependência total da plataforma que gerou o código) e **custos de hospedagem**.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/3.jpg)

### Assumindo o Controle: Do Prompt ao Repositório

A solução: exportar o código do Lovable, versionar no [**GitHub**](https://github.com/orafaelferreiraa/orafaelferreira-com), refatorar com [**GitHub Copilot**](https://github.com/features/copilot) e adotar **GitFlow** e versionamento profissional.

\`git commit -m 'taking back control'\`

### Hospedagem e Migração para Azure

Com o código sob controle, migrei a hospedagem para a **Microsoft Azure**: escrevo o código → GitHub guarda e testa (CI/CD) → publica no Azure → o domínio (www.orafaelferreira.com) responde. Isso envolveu migração de conteúdo (posts, palestras, projetos), adaptação estratégica de layout e configuração de DNS com downtime mínimo.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/4.jpg)

### Infraestrutura como Código com Terraform

Toda a infraestrutura é provisionada 100% via código com [**Terraform**](https://www.terraform.io/): criação do Azure Static Web App, configuração automatizada de DNS e domínio, e execução automatizada via GitHub Actions, garantindo consistência e replicabilidade, no lugar do clássico ClickOps manual e propenso a erros.

A arquitetura final: um Resource Group (\`rg-site\`) com Azure Blob Storage guardando o state do Terraform, um Azure Static Web App (free tier, \`eastus2\`) e um domínio customizado (\`www.orafaelferreira.com\`) com TLS automático e validação DNS via TXT record.

### O Motor de Entrega: GitHub Actions

O pipeline de CI/CD roda em **push to main**: build → test → deploy to Azure, com autenticação via Service Principal (secrets nunca hardcoded). Zero intervenção manual, 100% automatizado, incluindo validação de infraestrutura (\`tflint\`, \`trivy\`, \`checkov\`) antes de qualquer \`terraform apply\`.

### A Base do Frontend Moderno

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/5.jpg)

No frontend: **TypeScript**, **React**, **Vite**, **TailwindCSS** e **shadcn/ui**, com arquitetura orientada a componentes, cobertura completa de testes (unit com Vitest, componentes com React Testing Library, E2E com Playwright), suporte a i18n (PT-BR/EN) e foco em acessibilidade e SEO.

### GEO: A Evolução da Busca

Também trouxe um recorte sobre **Generative Engine Optimization (GEO)**, a evolução do SEO tradicional (palavras-chave, cliques, backlinks) para um mundo onde o foco está em intenção e contexto, citações por LLMs e dados estruturados e semânticos.

## Lições Aprendidas

1. **Um prompt bem estruturado vale mais que 100 tentativas aleatórias.**
2. **Unir IA, automação e cloud não é o futuro, é o presente**, mas exige profissionais em "T": generalistas na velocidade (vibe coding, prototipagem rápida) e especialistas em profundidade (DevOps, Terraform, Azure, Security).
3. **UX é tão importante quanto o produto.**
4. A inteligência artificial acelera exponencialmente, mas o poder humano de decisão, a criatividade e o objetivo continuam sendo intangíveis.

> "A IA é o Acelerador. Você é o Piloto." A IA não vai roubar seu emprego, ela vai impulsionar quem sabe usá-la.

E um recado final, direto: você não é pago pra escrever código, você é pago pra resolver problemas. Se você não está gostando do seu trabalho atual, ou você não está usando a IA do jeito certo, ou você está no emprego errado.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/6.jpg)

## Slides da Apresentação

<i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:** [Vibe Coding com DevOps: usei IA pra criar meu site no Azure, mas quem fez o deploy fui EU](https://stoblobcertificados2.blob.core.windows.net/palestras/Site.IA-DOD-CRTB.pdf)

## Repositórios

- [Repositório do Site](https://github.com/orafaelferreiraa/orafaelferreira-com), código-fonte, Terraform e pipeline completa.

Obrigado ao DevOpsDays Curitiba pela oportunidade e a todos que estiveram na sessão!
`,
  date: "2026-08-22",
  category: "Palestras",
  readTime: "7 min de leitura",
  image: "https://stoblobcertificados2.blob.core.windows.net/imagens-blog/posts/2026/dod-ctrb/00.png",
};
