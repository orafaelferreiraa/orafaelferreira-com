import type { Article } from '../types';

export const article: Article = {
  slug: "sql-saturday-joinville-2026",
  title: "Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU - SQL Saturday Joinville 2026",
  excerpt:
    "Relato da palestra Vibe Coding com DevOps no SQL Saturday Joinville 2026: como usei IA para criar meu site sem abrir mão de pipeline, governança e ownership.",
  content: `

![Banner do SQL Saturday Joinville 2026 na Univille](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/00.jpeg)

No dia **11 de abril de 2026**, participei como palestrante no **[SQL Saturday Joinville 2026](https://sqlsaturday.com/2026-04-11-sqlsaturday1139/)**, realizado na **Univille**, em Joinville/SC, organizado pela comunidade **[Comunidado](https://comunidado.com.br/)**

![Entrada do SQL Saturday Joinville 2026](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/03.jpg)

O SQL Saturday é um dos eventos mais tradicionais da comunidade de dados, reunindo profissionais de SQL Server, Azure, analytics e Inteligência Artificial para compartilhar experiências reais de mercado.

## Cronograma do evento

### Centro de Convenções

| Horário | Palestrante | Sessão |
|--------|-------------|--------|
| 08:30 - 09:00 | - | Keynote - Palestra Inicial |
| 09:00 - 09:50 | Fabiano Amorim | Hackeando MSSQL na nuvem. Todas elas. Como me tornei sysadmin no Azure, AWS, GCP e Alibaba. |
| 09:50 - 10:40 | Rodrigo Ribeiro | Microsoft SQL and AMD in the era of AI (IA no SQL Server: Embeddings). |
| 10:40 - 11:10 | - | Coffee break |
| 11:10 - 12:00 | Gerson Viergutz | MCP no Power BI. |
| 12:00 - 13:30 | - | Almoço |

### Auditório da Reitoria

| Horário | Palestrante | Sessão |
|--------|-------------|--------|
| 13:30 - 14:20 | Sidney Cirqueira | Microsoft Fabric - What's new and What's next. |
| 14:20 - 15:10 | Alison Pezzott | Arquitetura de Dados Moderna com CI/CD no Microsoft Fabric e Power BI: separando responsabilidades entre Engenharia e Analytics. |
| 15:10 - 15:40 | - | Coffee break |
| 15:40 - 16:20 | Walter Silvestre Coan | Desenvolvendo agentes de IA com o Microsoft Agent Framework. |
| 16:20 - 17:10 | Nilton Ueda | A convergência entre Inteligência Artificial e Business Intelligence está transformando a maneira como as organizações criam, consomem e agem com base em insights de dados. |
| 17:10 - 17:30 | - | Encerramento |

### Anfiteatro I

| Horário | Palestrante | Sessão |
|--------|-------------|--------|
| 13:30 - 14:20 | Paulo dos Santos | Azure AI Foundry - Do protótipo à produção: IA com governança, segurança e escala. |
| 14:20 - 15:10 | William Lino Oliveira | Agentes de IA para bancos de dados: descobrir, recomendar e otimizar. |
| 15:10 - 15:40 | - | Coffee break |
| 15:40 - 16:20 | Lerina Mesquita | Arquitetura moderna sem governança: como evitar que seu Lakehouse vire um Data Swamp. |
| 16:20 - 17:10 | Arthur Ferreira Reis | Qualidade de dados no Databricks: Great Expectations, DQX e testes isolados. |
| 17:10 - 17:30 | - | Encerramento |

### Anfiteatro II

| Horário | Palestrante | Sessão |
|--------|-------------|--------|
| 13:30 - 14:20 | Rafael Ferreira & Jessica Mello | Vibe Coding com DevOps: usei IA para criar meu site, mas quem fez o deploy fui eu. |
| 14:20 - 15:10 | Laurindo Dunba | Demonstração prática (hands-on) sobre a plataforma Databricks e GitHub. |
| 15:10 - 15:40 | - | Coffee break |
| 15:40 - 16:20 | Rodrigo Gonçalves | Do ' OR 1=1 ao Shell: técnicas avançadas de SQLi e evasão para profissionais de dados. |
| 16:20 - 17:10 | - | Sessão em aberto |
| 17:10 - 17:30 | - | Encerramento |


## Minha palestra

Apresentei novamente com a [**Jéssica Mello**](https://www.linkedin.com/in/jessica-tmello/) a sessão:

**Vibe Coding com DevOps: usei IA para criar meu site, mas quem fez o deploy fui eu**.

![Rafael Ferreira palestrando sobre Vibe Coding com DevOps](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/04.jpg)
![Público acompanhando a palestra no SQL Saturday Joinville 2026](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/01.jpg)

A ideia foi mostrar como acelerar construção com IA sem abrir mão de fundamentos de engenharia, pipeline, governança e ownership técnico no deploy.

Falamos sobre:

- produtividade com IA aplicada ao desenvolvimento
- limites e riscos de gerar código sem processo
- importância de CI/CD e validações automáticas
- responsabilidade técnica no momento de publicar em produção

![Slide sobre pipeline e governança no deploy com IA](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/07.jpg)
![Rafael Ferreira explicando ownership técnico no deploy](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/05.jpg)
![Rafael Ferreira interagindo com o público no SQL Saturday](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/02.jpg)
![Palestrantes reunidos no SQL Saturday Joinville 2026](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/08.jpg)
![Encerramento do SQL Saturday Joinville 2026 na Univille](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday26/final.jpg)

Participar do SQL Saturday Joinville 2026 como palestrante foi uma experiência excelente. O evento apenas reforça a força da comunidade técnica em Santa Catarina e como dados + IA + cloud estão cada vez mais conectados na prática.

Se você trabalha com dados, engenharia, analytics ou arquitetura em nuvem, esse é o tipo de evento que acelera aprendizado e eleva a qualidade das decisões no trabalho real.

[LinkedIn Post Divulgação evento](https://www.linkedin.com/posts/orafaelferreiraa_tem-muita-gente-falando-de-ia-criando-c%C3%B3digo-activity-7441808604246073344-ukc7?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAiBr9cBknrEzJyFEqCS03tes6G6R1yclRw)

## Slides

Os slides estão disponíveis aqui:

- <i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:**  
[Vibe Coding com DevOps: usei IA pra criar meu site, mas quem fez o deploy fui EU](https://stoblobcertificados011.blob.core.windows.net/palestras/SemServidorPlatform_Engineering.pdf)

## Repositórios da apresentação

- **Repositório do Site:**  
[](https://github.com/orafaelferreiraa/orafaelferreira-com)

`,
  date: "2026-04-20",
  category: "Palestras",
  readTime: "6-8 min de leitura",
};
