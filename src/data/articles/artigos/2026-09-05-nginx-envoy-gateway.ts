import { Article } from '../types';

export const article: Article = {
  slug: "nginx-envoy-gateway",
  title: "De NGINX Ingress para Envoy Gateway: a migração que a IA liderou",
  excerpt:
    "Como um controller próprio converte Ingress nginx em Gateway API sobre Envoy Gateway numa plataforma Kubernetes multi-tenant: o contrato de cobertura de annotations que veio antes do código, o degrau de teste que só um data plane de verdade resolve, e o header de OAuth que uma auditoria em fan-out achou antes da virada de tráfego.",
  image: "https://stoblobcertificados2.blob.core.windows.net/imagens-blog/2026/2026/nginx-envoy-gateway/capa.png",
  content: `
  
![Capa](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/2026/2026/nginx-envoy-gateway/capa.png)

Quase todo texto sobre trocar de ingress controller fala da arquitetura de destino: por que [Gateway API](https://gateway-api.sigs.k8s.io/), por que [Envoy](https://gateway.envoyproxy.io/), como fica o novo modelo de recursos. Esse aqui fala de outra coisa, menos explorada: **como a migração foi de fato executada**, com um agente de IA operando num loop estruturado em vez de uma pessoa dirigindo cada passo na mão.

## Resumo rápido

- Plataforma Kubernetes multi-tenant sob NDA. Nada de nome de empresa, cluster, tenant ou repositório. O que generaliza é o formato do problema.
- Existe um **controller próprio** que converte continuamente Ingress de classe \`nginx\` em \`HTTPRoute\`, \`GRPCRoute\` e \`TLSRoute\` ligados a um Envoy Gateway compartilhado.
- A decisão mais importante veio **antes do código**: para toda annotation nginx em uso, o time decidiu o que aconteceria com ela, convertida, redundante, sem efeito, ou marcada para trabalho manual, nunca deixada para trás em silêncio.
- Snippet de nginx é traduzido em regime **tudo ou nada**. Tradução parcial é modo de falha pior que tradução nenhuma.
- O achado que salvou o dia 1 não tem nada a ver com Envoy: dezenas de serviços montavam URL de redirect de OAuth a partir de um header não-padrão que **nunca existiu** naquele ambiente.
- O mecanismo do loop em si, hooks, skills, subagentes verificadores, escada de verificação, eu já detalhei em [Loop Engineering na prática](/artigos/loop-engineering-na-pratica). Aqui ele aparece em recap curto, e só desce ao detalhe onde a aplicação é específica desta migração.

## O problema da migração

O ambiente é uma plataforma Kubernetes multi-tenant sob NDA. O que interessa e generaliza para qualquer time fazendo essa migração é a forma do problema, não os nomes.

Existe um controller que converte, de forma contínua, Ingress de classe \`nginx\` em recursos de Gateway API ligados a um Envoy Gateway compartilhado. Ele envolve o projeto open source [kubernetes-sigs/ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway) e acrescenta quatro camadas em cima:

- **Rebind de \`parentRef\`**, para que a rota gerada aponte para o Gateway compartilhado certo em vez do que a conversão padrão inferiria.
- **Parsing de snippet nginx**, o config livre embutido em annotation.
- **Derivação de policy**, quando o comportamento não cabe na rota e precisa virar objeto de política no nível do Gateway. É a mesma ideia que eu defendi em [Platform Engineering e Policy-as-Code que aceleram times](/artigos/platform-engineering-policy-as-code), só que aqui a política não é escrita à mão, ela é derivada de uma annotation legada.
- **Cobertura total de annotation**, que é o assunto da próxima seção e a decisão mais importante do projeto inteiro.

Vale dizer o óbvio que às vezes se perde: a conversão não é um script que roda uma vez. É um controller em reconciliação, porque os times donos das aplicações continuam criando e editando Ingress nginx enquanto a migração acontece. Migração de verdade não tem freeze.

## O primeiro passo: um assessment da frota inteira

Antes de desenhar qualquer contrato, tinha uma pergunta mais básica: **o que a frota realmente usa?** Não a lista de annotations que a documentação do nginx descreve, a lista real, encontrada em produção, com toda variação que cada time introduziu ao longo do tempo.

Foi o primeiro passo do projeto, e não teve nada de manual nele. Um agente varreu todos os Ingress de todos os workloads da frota, um a um, e extraiu cada annotation encontrada, onde ela aparecia, em qual workload, em qual namespace. O resultado saiu num \`.csv\`, não num documento, porque o próximo passo era justamente decidir, entrada por entrada, para onde cada annotation ia na tradução para Gateway API.

Esse \`.csv\` é o que faz o contrato da próxima seção ser honesto. Sem ele, a lista de annotations a cobrir teria sido "as que a gente lembrou", montada de memória por quem já trabalhou com o ambiente. Com ele, é "as que existem de verdade", incluindo a annotation rara que um time usou uma vez, dois anos atrás, e que ninguém mais tinha em mente. É o mesmo problema, na escala do assessment inteiro, que o contrato resolve annotation por annotation: o que não é visto, desaparece calado.

## O contrato de cobertura: cinco categorias e nada fora delas

Antes de escrever qualquer código de conversão, a pergunta que precisava de resposta era: **o que acontece com uma annotation que o conversor não conhece?**

A resposta preguiçosa é ignorar e seguir. É também a resposta que faz a migração parecer um sucesso até alguém descobrir, três semanas depois, que o rate limit sumiu.

A saída foi fechar essa lacuna antes de escrever código: para toda annotation \`nginx.ingress.kubernetes.io/*\`, o time definiu de antemão qual das cinco categorias abaixo ela ocupa, **sempre uma, nunca zero**.

| Categoria | O que significa | Quem resolve |
|---|---|---|
| Convertida | Virou campo de um recurso real de Gateway API | O conversor |
| Coberta por policy | Não cabe na rota, virou objeto de política no Gateway | O conversor |
| Coberta por borda upstream | O comportamento já é entregue por uma camada antes do cluster | Ninguém, é redundância |
| No-op comprovável | Não faz nada naquele contexto, e dá para provar | Ninguém, com evidência |
| \`Unconvertible\` | Precisa mesmo de trabalho manual | Uma pessoa, avisada |

A quinta categoria é o que faz o contrato valer. **Sem uma categoria explícita para "isso não dá", tudo que não dá vira silêncio.** \`Unconvertible\` não é derrota, é o mecanismo que transforma um desconhecido em item de trabalho com nome.

O ganho prático de escrever isso antes: o agente não tem espaço para inventar uma quarta via. A instrução não é "converta o que der", é "coloque cada entrada numa categoria e não sobre nada". Objetivo verificável em vez de objetivo simpático.

![Diagrama em linhas neon azuis mostrando uma annotation de Ingress sendo classificada em exatamente um de cinco destinos: rota convertida, política no Gateway, borda upstream, item sem efeito e item que exige trabalho manual](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/2026/2026/nginx-envoy-gateway/1.png)

## Snippet é tudo ou nada

Snippet de nginx é o caso mais desagradável, porque não é uma annotation com valor conhecido, é um pedaço de configuração livre embutido numa string.

A regra que vale a pena copiar: **um snippet só é traduzido quando todos os diretivos dentro dele são reconhecidos.** Nunca nove décimos.

O motivo é o modo de falha, não a pureza. Um snippet traduzido pela metade **parece funcionar**, e continua parecendo funcionar até o dia em que o diretivo que ninguém portou se revela a checagem de autenticação. Um snippet não traduzido, marcado \`Unconvertible\`, é um problema visível numa lista. É a diferença entre uma pendência e uma armadilha.

A mesma lógica vale para regra de rewrite e qualquer coisa baseada em diretivo. **Tradução parcial é modo de falha pior que tradução nenhuma**, porque destrói o sinal que te avisaria.

## O que o loop virou neste projeto

### O hook que protege o RBAC gerado

O hook genérico eu já expliquei no artigo anterior. O que muda aqui é o alvo: o RBAC do operator é gerado a partir de marcadores \`+kubebuilder:rbac\` no código, e editar o arquivo gerado à mão é trabalho que o gerador apaga em silêncio na próxima execução.

\`\`\`bash
#!/usr/bin/env bash
# PostToolUse — pega edição manual num arquivo de RBAC gerado, antes que ele seja sobrescrito.
set +e
payload="$(cat)"; [ -z "$payload" ] && exit 0
file="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty')"
case "$file" in *config/rbac/role.yaml) ;; *) echo '{"continue":true}'; exit 0 ;; esac

if git diff --quiet -- "$file" 2>/dev/null; then
  echo '{"continue":true}'; exit 0
fi

printf 'Guardrail: %s e gerado a partir dos marcadores +kubebuilder:rbac.\\n' "$file" >&2
printf 'Rode \`make manifests\` em vez de editar a mao, o gerador sobrescreve isso na proxima execucao.\\n' >&2
exit 2   # o stderr volta para o contexto do agente
\`\`\`

Duas coisas que só a prática ensina, e que valem para qualquer hook desse tipo. Primeira: ele **estreita o escopo antes de opinar**, dispara num arquivo só, não em todo YAML do repositório. Segunda: a mensagem diz **o que fazer**, não só o que está errado. Feedback acionável fecha o loop numa iteração; feedback vago gasta três.

### A skill do converter: "isto NÃO é um operator genérico"

A skill deste projeto tem uma linha que eu considero a mais valiosa dela, e não é um passo de procedimento, é uma negação:

\`\`\`markdown
---
name: ingress-converter-operator
description: >
  Convenções de trabalho do conversor nginx para Gateway API: regras de git,
  build/test/deploy, e decisões de arquitetura já resolvidas por investigação
  anterior. Use ao editar internal/converter/* ou internal/controller/*.
  Este NÃO é um operator de CRD genérico feito com kubebuilder,
  não use \`kubebuilder create api\` aqui.
---

## Quando usar
## Build e teste
## Limitações conhecidas (leia antes de reinvestigar)
\`\`\`

Sem a linha de desambiguação, o agente alcança o padrão genérico de scaffolding de Kubebuilder num projeto que deliberadamente arrancou tudo aquilo fora. Ele não está errado por burrice, está errado porque o padrão mais provável do mundo, dado o formato do repositório, é exatamente o que este projeto não é. Dizer o que a coisa **não** é custa uma linha e economiza um dia.

E a última seção importa tanto quanto o procedimento. **"Limitações conhecidas" existe para o agente não reinvestigar "será que dá pra consertar?"** em algo que uma sessão anterior já resolveu que não dá. Sem ela, cada sessão nova paga de novo o custo da mesma investigação, e chega na mesma conclusão, e não deixa registro. O agente esquece, o repositório não.

## Onde a escada encosta na realidade: o degrau que precisa de data plane

Os cinco degraus da escada de verificação estão no artigo anterior. O que esta migração acrescenta é o motivo de o degrau 4 existir, e ele é bem concreto.

O \`envtest\` sobe um \`kube-apiserver\` e um \`etcd\` de verdade, com os CRDs de Gateway API e de Envoy Gateway vendorizados, não com mocks. Isso prova que a lógica de reconciliação funciona. **E não prova absolutamente nada sobre tráfego**, porque o \`envtest\` não sobe o data plane do Envoy. Ele não move pacote.

Ou seja: tudo que depende de como um header é de fato reescrito **passa no envtest e falha no mundo**. É o tipo de verde que dá confiança errada.

A correção é um degrau a mais, e o detalhe que faz ele valer é chato de propósito: Envoy Gateway instalado localmente, no Kubernetes que vem no Docker Desktop, com **exatamente os mesmos values de Helm do módulo que provisiona o ambiente real**. Não é o chart com defaults, não é um cluster de brinquedo. É o ambiente de destino em miniatura, porque o que você está testando é justamente a configuração, não o Envoy.

Ao lado dele, um backend que só ecoa os headers que recebeu, e um \`curl\`. É assim que se confirma que um request HTTP simples atravessando o Envoy chega do outro lado com \`X-Forwarded-Proto: https\`. Não por leitura de código, não por asserção de unidade. Por observação.

Esse mesmo cluster local também roda o **Gateway API** (os CRDs), não só o Envoy. Motivo: simular o Envoy sozinho prova o rewrite de header, mas não prova que o operator chega até lá do jeito que chegaria em produção. O cluster local simula o operator **rodando**, não só existindo.

Isso é o ponto que vale enfatizar: quanto mais o ambiente local imita o real, Helm values, Gateway API incluído, menos surpresa sobra para o cluster de produção. Teste local que só sobe a aplicação não testa o caminho pelo qual a aplicação chega lá, e esse caminho tem tanta chance de esconder bug quanto o código em si.

![Diagrama em linhas neon azuis comparando um servidor de API do Kubernetes, que aceita os objetos mas não move tráfego, com um proxy Envoy por onde a requisição passa de fato e sai com um header a mais preenchido](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/2026/2026/nginx-envoy-gateway/2.png)

Vale registrar também que a imagem do operator **não faz parte do ciclo de iteração**. Editar arquivo, reiniciar o pod com a árvore de código montada por hostPath, ver o efeito em segundos. A imagem é construída pelo serviço de build do registry, depois que o comportamento já está validado. A imagem é o resultado do loop, não uma etapa dentro dele.

## A virada de tráfego é uma operação destrutiva

Remover ou rebaixar um Ingress nginx antigo depois que o equivalente em Gateway API está saudável é, tecnicamente, apagar um recurso de produção. Então ela passa pela mesma trava que qualquer outra operação destrutiva do meu setup: para, pede autorização explícita, e não importa o modo de automação em que eu esteja.

Não repito aqui como a trava é construída, [está detalhada no artigo anterior](/artigos/loop-engineering-na-pratica), incluindo a brecha do modo sem prompt que quase me custou caro. O ponto específico da migração é outro: **a palavra que importa é "sempre"**.

Um cutover é exatamente o momento em que a confiança anda mais rápido que a verificação. O loop vem funcionando bem há semanas, as rotas vêm saindo certas, e a tentação de aprovar no piloto automático é máxima justo quando o custo de errar também é. Esse guardrail não protege contra o agente errar, protege contra **o operador aprovando rápido demais**. Falso positivo aí é preço, não defeito.

## O que a auditoria em fan-out achou antes da virada

Rodar a descoberta com agentes em vez de na mão teve um efeito colateral que sozinho pagou o esforço.

A sweep foi em fan-out, um agente por área da frota, seguida de uma segunda rodada com a instrução **invertida**: não confirme o que já foi achado, tente refutar. E o resultado foi desconfortável.

Dezenas de serviços montavam a URL de redirect de OAuth a partir do header não-padrão \`X-Forwarded-Scheme\`, com fallback para \`X-Scheme\`, em vez do padrão \`X-Forwarded-Proto\`.

Repare no que isso significa. **Nem o nginx nem a borda anterior mandavam esses headers.** Ou seja, aquelas aplicações vinham confiando num header ausente e caindo no default \`http\` na URL entregue ao provedor de identidade. Funcionava porque nada dependia do valor até o momento em que dependeria.

Mover o tráfego para o Envoy sem tocar nisso teria produzido uma onda de callbacks de OAuth quebrados no dia 1, com root cause que não tem nada a ver com Envoy, num dia em que todo mundo estaria olhando para o Envoy. É o pior formato possível de incidente: sintoma novo, causa velha.

**A rodada de refutação é o que torna esse achado confiável.** O primeiro fan-out voltou com cara de completo, e isso por si só foi suspeito para um ambiente que eu sei que é bagunçado. A passada adversarial achou um item que não existia, um atribuído ao lugar errado, e um marcado como desativado que estava vivo em produção. Nenhum dos três aparece se você pedir para o mesmo agente reler o próprio trabalho, ele vai confirmar o que já acredita.

O fix, uma vez achado, foi pequeno: o controller injeta os dois headers não-padrão, **add-if-absent**, na mesma camada onde já reescreve outros headers de request. Add-if-absent importa, porque quem já manda o header certo não pode ser sobrescrito por compatibilidade retroativa.

![](https://stoblobcertificados2.blob.core.windows.net/imagens-blog/2026/2026/nginx-envoy-gateway/3.png)

## O que o processo não pegou: ReferenceGrant no namespace errado

No interesse de não vender o peixe maior do que ele é: **o processo pega classes de falha, ele não é infalível.** E o caso que escapou é instrutivo justamente porque os testes ficaram verdes o tempo todo.

Backend cross-namespace precisa de um objeto \`ReferenceGrant\` no namespace de destino para autorizar a rota. O teste de unidade provava, corretamente, que o conversor calculava o namespace de destino certo. E isso **não prova que o controller aplica o objeto lá**.

Um passo de carimbo de namespace em outro ponto do loop de reconciliação sobrescrevia aquele destino em um caso específico, deixando o objeto de autorização válido e inútil, no namespace errado. Unidade verde, comportamento quebrado.

A correção é um teste de integração cobrindo conversor e controller **juntos**, que é exatamente o degrau que a suíte original pulava. Ela está escrita na seção de limitações conhecidas da skill, com nome, não esquecida numa conversa. **Um loop com agente é tão honesto quanto o backlog que ele deixa para trás.**

## Para quem vai fazer essa migração

As recomendações genéricas de loop estão no [outro artigo](/artigos/loop-engineering-na-pratica). Estas são específicas desta migração:

- **Escreva o contrato de cobertura de annotations antes do primeiro código de conversão.** Decida de antemão o que acontece com cada entrada possível, para que nada que você não previu desapareça em silêncio. E tenha uma categoria explícita para "não dá".
- **Trate feature baseada em diretivo como tradução tudo ou nada.** Snippet, rewrite, qualquer config livre. Meia tradução é pior que nenhuma, porque parece que funcionou.
- **Verificação local precisa de data plane de verdade.** Uma API do Kubernetes falsa prova sua lógica de reconciliação; só um cluster rodando a mesma implementação de Gateway com os mesmos values de Helm da produção prova que seu rewrite de header acontece.
- **Audite os headers que suas aplicações consomem antes de virar a borda.** Não os que a documentação delas diz que elas consomem, os que o código realmente lê. E rode uma passada adversarial em cima do resultado, porque a primeira volta sempre parece completa demais.
- **Diga na skill o que o projeto NÃO é.** Se o formato do repositório sugere um padrão comum que não se aplica, escrever a negação custa uma linha e evita que o agente reconstrua o que você arrancou fora de propósito.
- **Trate o cutover como operação destrutiva com autorização explícita.** É o momento em que a confiança está mais alta e o custo de errar também.

## Conclusão

O que me deixou confortável nessa migração não foi a velocidade da conversão. Foi que os pontos onde ela poderia ter falhado em silêncio, annotation ignorada, snippet meio traduzido, header ausente, autorização no namespace errado, viraram itens com nome, seja numa categoria, seja numa lista de limitações conhecidas, seja num teste que ainda falta escrever.

O agente acelerou o trabalho. O que decidiu se ele foi confiável foi o contrato escrito antes dele começar, e a disciplina de tratar todo verde não observado como suspeito.
`,
  date: "2026-09-05",
  category: "Artigos",
  readTime: "14 min de leitura",
  tags: ["IA", "DevOps", "Docker"]
};
