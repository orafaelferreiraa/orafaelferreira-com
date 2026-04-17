import { Article } from './types';

export const article: Article = {
  slug: "codecon-15-florianopolis",
  title: "Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU - Meetup Codecon #15",
  excerpt: "No dia 25 de fevereiro de 2026 rolou o Codecon #15 em Florianópolis. Uma noite de comunidade forte, papo direto sobre IA no mundo real e um case completo de como um site nasceu de um prompt e foi parar em produção com DevOps de verdade.",
  content: `

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/00.jpeg)

No dia **25 de fevereiro de 2026**, rolou o [**Codecon Meetup #15**](https://eventos.codecon.dev/eventos/floripa-meetup-codecon-15) em Florianópolis. O encontro aconteceu no **Impact Hub Bewiki**, no centro da cidade, um espaço de coworking focado em inovação e conexões entre profissionais de tecnologia.

Foram cerca de 3 horas de troca técnica, networking e conversas sobre como a IA e o ensino estão mudando a forma de construir software.

Abri a noite junto com a [**Jéssica Mello**](https://www.linkedin.com/in/jessica-tmello/) com a talk:
**Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU**

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/02.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/06.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/03.jpg)


A proposta foi mostrar um case real: a construção do meu site pessoal usando **IA generativa + engenharia de software + DevOps**.

A história começou com um prompt simples, pedindo um site profissional, moderno e responsivo. A primeira versão saiu toda com IA e virou um one-page rápido de colocar no ar, mas aquilo era só o começo.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/01.jpg)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/05.jpg)


## Do prompt ao código

Depois da primeira versão gerada por IA, o próximo passo foi assumir o controle do projeto. O site saiu da ferramenta de geração e foi para um repositório com versionamento profissional, refatoração e organização de código.

Foi ali que o projeto deixou de ser só um experimento de IA e virou um produto de verdade: separação em múltiplas páginas, melhorias de UX, ajustes de SEO e evolução contínua.

A IA ajudou muito a acelerar, mas engenharia ainda manda no resultado final.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/04.jpg)

## Colocando em produção

Toda a infraestrutura foi provisionada usando **Infrastructure as Code (Terraform)**, garantindo imutabilidade e consistência. O deploy ficou totalmente automatizado com pipeline CI/CD.

Push no repositório, testes rodando, deploy automático. No ClickOps.

Também falamos sobre o lado que pouca gente comenta quando o assunto é IA. Dependência de plataforma, custos e vendor lock-in são alguns riscos. IA acelera muito, mas em produção exige controle. Essa foi uma das mensagens centrais da talk.

Mas uma coisa continua igual: deploy ainda é responsabilidade do engenheiro.
E ainda bem.

## Tecnologia como ponte

Na sequência, a **[Maiza Louise](https://www.linkedin.com/in/maizalouise/)** trouxe a talk: **Tecnologia como ponte para educação de qualidade**
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/09.jpg)

Uma visão bem diferente e complementar, mostrando como tecnologia pode gerar impacto real fora do mundo corporativo. Esse tipo de assunto deixa o meetup muito mais rico.

## Fechamento

Eu e a Maisa estavamos representando a Alura, que estava presente apoiando o evento. Tivemos um sorteio de um ano de licença da plataforma. 
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/10.jpg)

E essa é a foto com o ganhador:
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/%2315codecon/11.jpg)

## Slides

Os slides estão disponíveis aqui:

- <i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:**  
[Vibe Coding com DevOps – Codecon #15](https://stoblobcertificados011.blob.core.windows.net/palestras/codecon15.pdf)

`,
  date: "2026-02-27",
  category: "Registro Eventos Presenciais",
  readTime: "4 min de leitura"
};