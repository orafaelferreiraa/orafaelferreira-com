import { Article } from '../types';

export const article: Article = {
  slug: "github-copilot-vscode-agents-debug-profile-test",
  title: "GitHub Copilot in VSCode: Agents That Debug, Profile, and Test",
  excerpt:
    "No Microsoft Build //localhost: Florianópolis, mostrei como agentes do GitHub Copilot podem acelerar debugging, profiling e testes dentro do Visual Studio Code.",
  content: `

No [**Microsoft Build //localhost: Florianópolis**](https://developer.microsoft.com/pt-br/reactor/events/27206/), a minha talk conectou uma ideia simples com impacto direto no dia a dia: agentes de IA não servem só para escrever código, eles também podem ajudar a investigar, medir e validar software com mais contexto.

O evento reuniu pessoas interessadas em IA, cloud, DevOps e desenvolvimento moderno. A proposta da palestra foi mostrar, na prática, como o **GitHub Copilot no VSCode** pode atuar como um parceiro de trabalho quando o fluxo exige análise, repetição e rapidez.

Evento organizado por mim e **[Vinicius Deschamps](https://www.linkedin.com/in/viniciusdeschamps/)**, representando a comunidade [**Azure User Groups Brasil**](https://azureusergroupsbrasil.com.br/), com o objetivo de aproximar a comunidade de cenários reais de uso do **GitHub Copilot** no dia a dia de quem constrói software.


Agentes bem configurados encurtam esse ciclo sem substituir a habilidade crítica do desenvolvedor. Eles ajudam a chegar mais rápido no ponto certo da investigação.

Na prática, o maior ganho aparece quando o agente ajuda a organizar o problema.

Em vez de abrir dezenas de arquivos sem direção, a conversa pode começar com contexto, hipóteses e sinais observáveis. Isso ajuda a:

- identificar a parte mais provável do bug
- sugerir arquivos e símbolos relacionados
- resumir o comportamento esperado versus o comportamento real

O resultado é menos tempo procurando e mais tempo corrigindo.

## Harness com agentes

Um agente pode ajudar a interpretar sinais de uso de CPU, latência, alocação e dependências, principalmente quando o problema está espalhado por mais de uma camada do sistema.

O ponto não é automatizar o diagnóstico inteiro. O ponto é chegar mais rápido nas perguntas certas:

- onde a aplicação passa mais tempo?
- qual etapa está repetindo trabalho desnecessário?
- qual caminho vale instrumentar primeiro?

## Testing com agentes

Testes são um dos melhores usos para esse tipo de fluxo. Agentes ajudam a transformar um cenário solto em um conjunto de casos reproduzíveis, o que facilita validar correções e evitar regressões. Isso vale especialmente quando o comportamento envolve dependências, interfaces ou estados difíceis de reproduzir manualmente.

A mensagem principal foi que agentes funcionam melhor quando entram no fluxo certo:

- com contexto
- com objetivo claro
- com validação humana no final

Quando isso acontece, o desenvolvedor ganha velocidade sem perder controle técnico.

Confira os conteúdos que tivemos no evento:

## From CLI to PR: Automating the Path to Merged Code  
🔹 [Vinicius Deschamps](https://www.linkedin.com/in/viniciusdeschamps/)

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/09.jpg)

Nesta demonstracao pratica, mostramos como utilizar GitHub Copilot CLI e agentes para automatizar desde o planejamento ate a revisao de Pull Requests, explorando gerenciamento de contexto, automacao e fluxos modernos de desenvolvimento.

## GitHub Copilot no Visual Studio: Agents That Debug, Profile and Test  
🔹 [Rafael Ferreira](https://www.linkedin.com/in/orafaelferreiraa/)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/03.jpg)

Nesta sessão, exploramos como os agentes do GitHub Copilot podem ajudar a investigar problemas, identificar gargalos de performance, analisar infraestrutura como codigo, entender comportamentos complexos de aplicacoes e acelerar troubleshooting em ambientes reais.

Menos tempo procurando a causa do problema.  
Mais tempo resolvendo o problema.

## From Zero to Deployed on Azure with AI Agents  
🔹 [Claudio Raposo](https://www.linkedin.com/in/claudioraposo/)
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/07.jpg)

Um laboratorio pratico para quem quer colocar a mao na massa. Partindo de um terminal vazio, os participantes construiram e publicaram uma aplicacao no Azure utilizando GitHub Copilot CLI e agentes de IA para provisionamento de recursos, desenvolvimento, debugging e deployment.

## Slides

- [Build 2026 - GitHub Copilot in VSCode](https://stoblobcertificados011.blob.core.windows.net/palestras/build26.pdf)

- [LinkedIn Post Divulgação evento](https://www.linkedin.com/posts/orafaelferreiraa_microsoftbuild-githubcopilot-azure-activity-7473336231129522176-33Lc?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAiBr9cBknrEzJyFEqCS03tes6G6R1yclRw)

## Conecte-se com a comunidade

Se você quiser acompanhar os próximos encontros e participar da comunidade:

- [Site oficial](https://azureusergroupsbrasil.com.br/)
- [Linktree](https://linktr.ee/azureusergroupsbrasil)
- [Grupo no WhatsApp](https://chat.whatsapp.com/HSpFnNyo9ZLD4RJrvEcrrl)
- [YouTube](https://www.youtube.com/@azureusergroupsbrasil?sub_confirmation=1)
- [LinkedIn](https://www.linkedin.com/company/azureusergroupsbrasil)
- [Meetup](https://www.meetup.com/azureusergroupsbrasil)


  `,
  date: "2026-06-20",
  category: "Palestras",
  readTime: "4 min de leitura",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/01.png",
  tags: ["IA", "DevOps", "GitHub Copilot", "VSCode"]
};
