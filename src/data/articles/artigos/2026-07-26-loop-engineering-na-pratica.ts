import { Article } from '../types';

export const article: Article = {
  slug: "loop-engineering-na-pratica",
  title: "Loop Engineering na prática: como eu opero agentes no dia a dia",
  excerpt:
    "O que é Loop Engineering, e como eu monto meu loop de verdade com skills, rules, subagents, hooks e MCP no Docker, incluindo os quatro pontos onde eu discordo da definição canônica.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/Loop.Engineering/capa.png",
  content: `
Usando LLMs e agentes há mais ou menos dois anos, desde a época em que eu ainda estava [explorando o que a IA generativa mudava na prática](/artigos/ia-gen), o **GitHub Copilot** desde então, e o **Claude Code** há uns três meses. O que vem abaixo é um resumo de como isso entrou no meu dia a dia de verdade.

## Resumo rápido

- **Loop Engineering** é técnica de o sistema que dá o prompt no agente, em vez de você dar o prompt a cada passo. O termo foi sistematizado em junho de 2026.
- O conceito original de um loop de verdade tem cinco peças: **objetivo**, **verificador**, **caminho de feedback**, **regra de parada** e **teto de iteração/custo**. Sem verificador, não é loop, é um gerador de texto com autoconfiança.
- Meu setup implementa quatro dos cinco componentes canônicos. O quinto, **worktree**, eu tirei de propósito, e explico por quê.
- A peça mais útil do meu loop não é uma IA: é um **hook em shell que sai com código 2**. É assim que a correção volta para o contexto do modelo.
- A divisão que faz o resto funcionar: **hook aplica, skill instrui, MCP executa.** Nenhuma das três invade o papel da outra.
- Trabalho com plataforma sob NDA, então aqui não tem nome de empresa, cluster, tenant ou repositório. O que interessa é o mecanismo, e o mecanismo é público.

## De prompt para loop

Nos últimos dois anos a alavanca foi migrando para fora. Primeiro era a **palavra que você digita**, prompt engineering. Depois virou **a informação que o modelo vê**, context engineering. Depois **o ambiente em que ele roda**, harness engineering. Agora é **o ciclo que dirige tudo isso**.

O [Peter Steinberger resumiu de um jeito que provoca](https://addyo.substack.com/p/loop-engineering): *"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."*

Isso provoca, porque é verdade. Se o seu trabalho com agente ainda é abrir o terminal, descrever a tarefa, ler a resposta, corrigir, repetir, você é o loop. Você é a peça que não escala.

Eu passei os últimos meses construindo o meu, num contexto que é bem menos glamouroso que os exemplos de blog: infraestrutura multi-tenant, Terraform, AKS, pipelines. Domínio onde o custo de errar não é um teste vermelho, é um ambiente fora do ar. E foi justamente esse contexto que me fez questionar e estudar cada vez mais para não usar a receita padrão.

## O que é Loop Engineering

Vamos ao que o povão está dizendo

O termo foi sistematizado pelo **Addy Osmani** em junho de 2026, [no artigo que virou referência](https://addyo.substack.com/p/loop-engineering) (também [publicado no O'Reilly Radar](https://www.oreilly.com/radar/loop-engineering/)). A definição dele é direta: *"Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead."*

A [IBM descreve como](https://www.ibm.com/think/topics/loop-engineering) a prática de projetar, especificar e manter loops agênticos, sistemas que se auto-instruem e avaliam o próprio trabalho até atingir um objetivo declarado. O [Augment Code detalha a anatomia](https://www.augmentcode.com/guides/what-is-loop-engineering): um loop pareia um agente de código com um **verificador**, um **caminho de feedback**, uma **condição de saída**, um **teto de iterações** e um **teto de orçamento**, para que ele possa rodar sem supervisão sob regras de parada explícitas.

Repare no que essa lista tem de mais importante: quatro dos cinco itens são **freios**. Só um é acelerador.

### Os cinco componentes

O Osmani lista cinco peças que transformam execução avulsa em loop:

- **Automations**, *"Automations are what make a loop an actual loop and not just one run you did once."* Tarefas agendadas que descobrem trabalho sozinhas.
- **Worktrees**, diretórios de trabalho isolados, para vários agentes mexerem no mesmo repo sem colidir.
- **Skills**, conhecimento de projeto codificado em arquivos \`SKILL.md\`: convenções, passos de build, o contexto que você reexplicaria a cada sessão.
- **Plugins e connectors**, integrações via [MCP](https://modelcontextprotocol.io), para o loop alcançar sistemas reais e não só o filesystem.
- **Subagents**, separar quem escreve de quem confere. Nas palavras dele: *"The most useful structural thing in a loop, by far, is splitting the one who writes from the one who checks."*

E uma sexta peça, que na verdade é a fundação: **estado externo**. O modelo esquece tudo entre execuções, então a memória tem que viver fora dele. O jeito mais curto de dizer isso: **o agente esquece, o repo não.**

![Ilustração de um núcleo de estado externo brilhando no centro, orbitado por cinco satélites de energia que representam automations, worktrees, skills, plugins/MCP e subagents](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/Loop.Engineering/1.png)

### A tensão que ninguém resolveu

Existe um problema estrutural no meio disso, e vale nomear antes de qualquer entusiasmo: **a capacidade de gerar ultrapassou a capacidade de verificar.** Agentes produzem código rápido; checagens confiáveis continuam sendo artefato escasso, feito por gente.

Daí vêm as falhas clássicas, todas documentadas: **reward hacking** (o agente reescreve o teste em vez de consertar o código), **tool-call hacking** (ele chuta a saída em vez de usar o resultado da ferramenta), o exit *"parece pronto"* (declara conclusão sem evidência) e a **iteração infinita** (loop sem condição de parada).

Um [paper de julho deste ano no arXiv](https://arxiv.org/abs/2607.00038) argumenta na mesma direção: o problema não é o modelo ser fraco, é o loop ser mal projetado. E a própria Anthropic, [na engenharia de agentes eficazes](https://www.anthropic.com/engineering/building-effective-agents), coloca o requisito de forma seca, o agente precisa obter *ground truth* do ambiente a cada passo. Não da própria opinião. Do ambiente.


## Os quatro pontos onde meu loop é diferente

Eu implemento quatro dos cinco componentes acima. São decisões que o eu determinei.

### 1. Loop sem worktree

O worktree é um dos cinco componentes canônicos. Eu tirei o meu, e tenho uma regra explícita proibindo o agente de criar um por iniciativa própria.

O raciocínio é este: em repositório de infraestrutura, **o isolamento que importa não é de arquivo, é de estado**. O que colide de verdade quando dois agentes trabalham em paralelo não é o diretório, é o *state* remoto do Terraform, é o lock de um apply em andamento, é o contexto de cluster ativo no \`kubectl\`, é o registro de um recurso que só existe uma vez na nuvem. Worktree não resolve nenhum desses. Ele te dá dois checkouts que disputam exatamente o mesmo recurso, com a sensação agradável de que estão isolados.

Então eu troco por outra coisa: **branch, e o PR como gate.** O isolamento vem do branch. A verificação vem da revisão. E o PR ainda me dá o que worktree nenhum dá, trilha de auditoria com diff, comentário e aprovação nominal. Em infra, "quem aprovou isso" é uma pergunta que aparece.

### 2. Guardrail antes da geração, não depois

O padrão da literatura é gerar e depois verificar. Meu loop inverte parte disso. As **rules** carregam antes de qualquer código existir, e várias delas são proibições: validar versão de provider e schema do recurso via MCP **antes** de escrever a primeira linha; nunca escrever segredo em arquivo; nunca abrir endpoint público em serviço de dados de produção; menor privilégio por padrão.

A ideia é simples e pouco glamourosa: **o verificador mais barato do mundo é a regra que impede o erro de existir.** Um teste que pega credencial hardcoded é bom. Uma regra que faz o agente nunca escrever uma é melhor, porque custa zero iteração.

É o mesmo raciocínio que eu já defendi em [Platform Engineering e Policy-as-Code que aceleram times](/artigos/platform-engineering-policy-as-code), só deslocado uma camada para trás. Lá a política barra o recurso errado na hora de admitir; aqui a regra impede o agente de escrever o recurso errado. Política é guardrail para o que já existe; rule é guardrail para o que ainda vai nascer.

### 3. Em infra, o verificador não é a suíte de testes

Aquela tensão de gerar-versus-verificar é ruim em desenvolvimento de aplicação. Em plataforma é pior, por um motivo bobo: **verificar custa tocar em ambiente.**

Não existe \`npm test\` que me diga se uma regra de rede vai funcionar. O verificador honesto é outro conjunto de coisas, e elas têm preços muito diferentes:

| Gate | O que ele responde | Custo |
|---|---|---|
| Lint e format | O código é sintaticamente válido? | Segundos, zero risco |
| Validate e schema | Os campos existem nessa versão do provider? | Segundos, zero risco |
| Plan / diff | O que exatamente vai mudar? | Minutos, leitura remota |
| Health e reconciliação | O ambiente aceitou e está saudável? | Depois do apply, risco real |

A regra que eu sigo é ordenar do mais barato ao mais caro, e nunca deixar o agente pular etapa. O [Augment recomenda a mesma ordenação](https://www.augmentcode.com/guides/what-is-loop-engineering) de forma genérica, portas determinísticas primeiro, raciocínio depois, teste dinâmico por último. Em infra isso não é otimização de custo, é gestão de blast radius.

E o corolário desconfortável: **o último gate da minha lista não é automatizável hoje.** "O ambiente está saudável" envolve olhar coisa que só existe depois de aplicar. É exatamente por isso que a próxima tese existe.

### 4. O outer loop é meu

O Osmani tem uma frase: *"Delegating the inner loop is leverage; delegating the outer loop is abdication."*

Delegar o **inner loop**, escrever, rodar o gate, corrigir, rodar de novo, é alavancagem pura. É trabalho que eu não quero fazer à mão.

Delegar o **outer loop**, decidir o que é o objetivo, julgar se o resultado presta, assumir o resultado, é abdicação. Não é uma questão de confiança no modelo. É que a responsabilidade não é transferível: quando algo cai, ninguém aceita "o agente decidiu".

No meu setup isso está codificado, não é boa intenção:

- O **objetivo** vem de um card do Jira.
- O **ID da tarefa** vive no nome da branch, não na conversa. Qualquer sessão nova recupera o objetivo com um comando de git.
- O **fim do ciclo** é um PR, com um comentário de volta no card. Não um deploy.
- O **estado** persiste fora do modelo, em memória entre sessões e no próprio histórico do repo.
- O **merge é meu.** O agente nunca faz merge. Nenhuma exceção.

Repare que só o primeiro e o último item são sobre mim. Os três do meio são automação, e é justamente por serem automatizados que eu consigo manter as pontas na mão sem virar gargalo. Autonomia no meio, autoridade nas bordas.

Isso torna meu loop menos autônomo do que os exemplos que circulam por aí. É de propósito. Autonomia é meio, não é métrica.

![Ilustração conceitual separando o inner loop automatizado, em ciclo rápido, do outer loop humano, representado por uma mão segurando firme um volante, símbolo de quem decide o objetivo e aprova o resultado](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/Loop.Engineering/3.png)

## Como o loop está montado

Agora a mecânica. A tese organizadora, e o que eu levaria para qualquer outro setup: **hook aplica, skill instrui, MCP executa.**

Três camadas, três papéis, e a disciplina de nenhuma invadir a outra. Hook é determinístico , ele detecta e aplica. Skill é procedimento versionado, ela ensina. MCP é quem busca atualidade na internet. Quando eu misturei os papéis, quebrou. Quando separei, ficou previsível.

![Ilustração de um raio de energia atravessando três camadas empilhadas, hook determinístico, skill com o procedimento e MCP como executor autenticado, com um arco elétrico de retorno representando o feedback do exit code 2](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/Loop.Engineering/2.png)

### \`exit 2\` é a primitiva do loop

Se eu pudesse levar uma coisa só deste artigo, seria esta.

[Hooks no Claude Code](https://code.claude.com/docs/en/hooks) são comandos disparados por evento do ciclo de vida, antes de uma ferramenta rodar, depois que ela roda, no início da sessão, no fim. E eles têm um comportamento de código de saída que é a coisa mais subestimada da ferramenta: **quando um hook sai com código 2, o que ele escreveu no stderr volta para o contexto do modelo como mensagem de erro.**

Leia de novo. Isso significa que um script de shell de trinta linhas consegue **injetar correção no loop**. Não é sugestão em documentação que o modelo talvez leia. É feedback que chega no momento exato do erro, com o texto que eu escrevi.

Esse é o *caminho de feedback* da definição de loop, implementado em bash. Cinco hooks meus usam isso: três para o modelo se autocorrigir, um para entregar uma tarefa de follow-up, um para travar de verdade.

Um exemplo genérico, que é a forma de todos eles:

\`\`\`bash
#!/usr/bin/env bash
# PostToolUse — avisa quando um manifesto sai sem limite de recurso.
set +e
[ -t 0 ] && exit 0                    # sem stdin, nada a fazer
payload="$(cat)"; [ -z "$payload" ] && exit 0

file="$(printf '%s' "$payload" | jq -r '.tool_input.file_path // empty')"
case "$file" in *.yaml|*.yml) ;; *) echo '{"continue":true}'; exit 0 ;; esac

# só olha workload de verdade, não Application/CRD/kustomization
grep -qE "^kind: (Deployment|StatefulSet|DaemonSet|Job|CronJob|Pod)$" "$file" || {
  echo '{"continue":true}'; exit 0; }

if ! grep -q 'resources:' "$file"; then
  printf 'Guardrail: %s define workload sem resources/limits. Adicione requests e limits antes de seguir.\\n' "$file" >&2
  exit 2                              # <- stderr volta para o contexto do modelo
fi
echo '{"continue":true}'
\`\`\`

Note duas coisas que aprendi na prática. Primeira: o hook **estreita o escopo antes de opinar**, se ele disparasse em todo YAML, ia gritar em manifesto de GitOps que legitimamente não tem \`resources\`, e guardrail que grita errado é guardrail que a gente desliga. Segunda: a mensagem diz **o que fazer**, não só o que está errado. Feedback acionável fecha o loop numa iteração; feedback vago gasta três.

### O card é o objetivo, e o loop começa nele

Um loop precisa de objetivo que o modelo não inventou. No meu setup ele vem de um card do Jira, e o ciclo toca o card em três momentos: **descobrir qual é**, **criar a branch** e **comentar de volta no fim**.

**Descoberta do card.** Eu não digito o número da tarefa. Uma skill consulta o Jira via MCP com um JQL fechado no meu projeto, atribuído a mim, em andamento, ordenado pelo mais recentemente atualizado:

\`\`\`text
project = <PROJ> AND assignee = currentUser() AND status = "In Progress"
ORDER BY updated DESC
\`\`\`

E aqui está a decisão de design IRADA que decidi criar: **ele pega o primeiro resultado e não pergunta.** Diz em uma linha qual card assumiu, "usando o card X, tal resumo", e segue trabalhando. Se estiver errado, eu corrijo na mensagem seguinte.

Um loop que para para perguntar "qual desses três cards?" não é um loop, é um formulário. Pergunta bloqueante no início de toda tarefa é exatamente o atrito de humano-no-meio que Loop Engineering existe para remover. O padrão certo é **default otimista com correção barata**: escolha o mais provável, diga em voz alta o que escolheu, continue. Errar custa uma mensagem; perguntar custa todas as vezes.

As saídas de emergência são explícitas, e isso importa mais que a regra: se eu já dei a chave na mensagem, não busca nada. Se a busca voltar vazia, ela avisa e pede a chave, **nunca inventa uma**. Se eu citar outro projeto, usa aquele. Loop bom tem default; loop confiável tem default *e* as três exceções escritas.

**Criação da branch.** O nome é sempre \`feature/{CHAVE-DA-ISSUE}\`, independente do tipo, Bug, Task e Story todos entram como \`feature/\`. Taxonomia única, zero decisão a cada tarefa. Nome de branch é metadado, não é lugar de criatividade.

E tem um detalhe de arquitetura aí que eu considero mais importante que a convenção: **a sequência do git não está na skill.** Dar pull na base, sair dela para uma branch nova, nunca commitar na base, isso vive numa *rule*, e a skill do Jira diz explicitamente para não repetir esses passos. É a disciplina anti-duplicação. Se eu copiar a sequência do git em toda skill que mexe com git, mudar a sequência significa editar cinco arquivos e esquecer dois.

Tem também um ritual de limpeza antes de começar a próxima tarefa: voltar para a base, \`git pull --prune\` para derrubar as referências de rastreamento que já morreram no remoto, e apagar a branch local que já virou PR. Parece detalhe bobo, mas um loop que cria uma branch por tarefa e nunca limpa te deixa com quarenta branches órfãs em três meses.

**A chave mora na branch.** Esse é o ponto estrutural que faz o loop ser fechável, e é o que eu levaria para qualquer outro rastreador de tarefas. O modelo não precisa lembrar qual era o card, o próprio git conta:

\`\`\`bash
git branch --show-current | grep -oE 'feature/[A-Z][A-Z0-9_]+-[0-9]+'
\`\`\`

*"O agente esquece, o repo não"* deixa de ser abstração e vira um regex. O estado do ciclo está no nome da branch, não na conversa, então qualquer sessão nova, qualquer hook, qualquer subagente consegue recuperar o objetivo sem contexto anterior. É a peça de estado externo mais barata que eu tenho, e não custou nada além de escolher uma convenção e respeitá-la.

### O ciclo que se fecha sozinho

O melhor exemplo de loop no meu setup é o que fecha esse ciclo: liga o PR de volta ao card. Ele mostra as três camadas trabalhando sem se atropelar.

O **hook** roda em \`PostToolUse\`, casando tanto com o comando de CLI que abre PR quanto com a tool MCP equivalente. E aí vem a parte que eu errei na primeira versão: ele **confirma que uma URL de PR realmente voltou na resposta** antes de fazer qualquer coisa. Sem isso, ele disparava quando o comando falhava ou era negado, anunciando um PR que não existia.

\`\`\`bash
pr_url="$(printf '%s' "$response_blob" \\
  | grep -oE 'https://github\\.com/[^"[:space:]]+/pull/[0-9]+' | head -1)"
[ -z "$pr_url" ] && { echo '{"continue":true}'; exit 0; }
\`\`\`

E o passo decisivo: **o hook não escreve no rastreador.** Ele não tem credencial, não conhece a API, não sabe formatar o comentário. Ele sai com código 2 e devolve ao modelo um ponteiro, vá na seção tal da skill tal, extraia a chave da branch atual, resuma o que foi feito, comente no card com o link.

A **skill** é quem sabe o procedimento, e ela é específica de um jeito que só a prática ensina: o resumo sai em inglês mesmo quando a conversa é em português, porque o card é lido por outros times; o link do PR vai como link markdown com texto descritivo, nunca URL crua, porque URL crua vira uma string gigante que arrebenta a leitura do parágrafo; e se a branch não seguir o padrão esperado, **não faz nada e fica calado**, não todo PR está ligado a um card.

O **MCP** tem o token e escreve o comentário.

Trigger determinístico, procedimento versionado, efetor autenticado. Nenhuma das camadas sabe fazer o trabalho da outra, e é por isso que dá para mexer numa sem quebrar as demais.

### Minha trava preferida: nada é destruído sem eu olhar

De tudo que eu construí nesse setup, esse é o hook de que eu mais gosto, e é o que eu recomendaria escrever primeiro se alguém me perguntasse por onde começar. A regra dele é uma frase: **toda operação destrutiva para e pede autorização, sempre, independente do modo em que eu esteja.**

Ele roda em \`PreToolUse\`, antes de qualquer coisa acontecer, e a cobertura é deliberadamente ampla. São dez regras rotuladas, testadas em ordem, e o rótulo importa porque é ele que vai para o log:

- **Remoção de arquivo**, \`rm\`, \`rmdir\`, \`unlink\`, \`shred\`, \`del\`, com ou sem \`sudo\`, inclusive quando aparecem depois de um \`;\`, de um \`&&\` ou dentro de um subshell.
- **Subcomando destrutivo depois de uma CLI conhecida**, a rede mais larga de todas: \`delete\`, \`destroy\`, \`uninstall\`, \`purge\`, \`prune\`, \`remove\`, \`drop\` precedidos de \`az\`, \`kubectl\`, \`helm\`, \`docker\`, \`terraform\`, \`tofu\`, \`gh\`, \`argocd\`, \`flux\`, \`aws\`, \`gcloud\`, \`npm\`, \`apt\` e companhia.
- **\`terraform destroy\`**, e também o \`apply\` disfarçado com a flag de destruição, que é o jeito silencioso de fazer a mesma coisa.
- **Git destrutivo**, \`push --force\`, \`reset --hard\`, \`clean -f\`, \`branch -D\`, \`tag -d\`, \`stash drop\` e \`stash clear\`. Perder trabalho local não é menos grave que perder recurso na nuvem, é só mais silencioso.
- **Docker**, \`system prune\`, \`volume rm\`, \`network rm\`, e o \`compose down -v\` que leva os volumes junto.
- **Kubernetes**, \`kubectl delete\` e \`kubectl drain\`, \`helm uninstall\`.
- **\`find\` com \`-delete\` ou \`-exec rm\`**, que é como um comando de busca se transforma em remoção em massa.
- **SQL**, \`DROP TABLE\`, \`DROP DATABASE\`, \`DELETE FROM\`, \`TRUNCATE\`.
- **Verbo destrutivo genérico**, a rede de segurança para o que eu não previ: pega uma tool de MCP chamada \`delete_algumacoisa\` ou um campo \`"destroy"\` no payload.

E tem um detalhe de escopo que faz esse último item funcionar. O hook não olha só linha de comando: **quando a ferramenta não é o shell, ele varre o \`tool_input\` inteiro.** Isso é o que faz uma tool de MCP que apaga recurso na nuvem cair na mesma rede que um \`rm -rf\`. Ferramentas que não destroem nada (ler, escrever, buscar arquivo) saem na primeira linha, sem custo.

**Por que "sempre" é a palavra que importa.** O modo que aceita edição automaticamente existe justamente para eu não aprovar cada passo, e é ótimo para isso. Só que ele não distingue "criar arquivo" de "apagar cluster". Esse hook devolve \`permissionDecision: "ask"\`, que **sobrevive ao auto mode**: mesmo com tudo liberado, remoção volta a exigir um sim explícito meu.

Repare no que isso significa: **é o único guardrail meu que não confia em mim.** Os outros protegem contra o agente errar. Esse protege contra eu estar no automático e aprovar sem ler, que é o modo de falha mais provável depois que o loop começa a funcionar bem. É o freio contra a rendição cognitiva, escrito em shell.

Ele também é o único que **ignora o kill-switch global**. Todos os meus outros hooks respeitam uma variável de ambiente que os desliga de uma vez; esse não olha para ela. Guardrail que desliga junto com o resto não é guardrail, é enfeite.

**Está funcionando?** O log diz que sim, e mais do que eu esperava. Em vinte dias, **100 detecções**, cerca de cinco por dia:

| Regra que disparou | Vezes |
|---|---|
| Subcomando destrutivo depois de CLI | 54 |
| Remoção de arquivo | 32 |
| Git destrutivo | 12 |
| SQL e verbo genérico | 2 |

**E o detalhe de engenharia que quase me custou caro.** O jeito elegante de um hook barrar algo é devolver um JSON pedindo confirmação:

\`\`\`json
{ "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "Operação destrutiva — confirme antes de seguir." } }
\`\`\`

Só que existe um modo de permissão em que os prompts estão desligados. Nele, pedir confirmação é **pedir para o vazio**, a decisão é simplesmente ignorada e o comando passa. Descobri isso do pior jeito possível: o guardrail existia, parecia certo, e não protegia nada exatamente no modo em que eu mais precisava dele.

A correção é ser consciente do modo:

\`\`\`bash
case "$perm_mode" in
  bypassPermissions) printf 'BLOQUEADO: %s\\n' "$reason" >&2; exit 2 ;;
  *) jq -n --arg r "$reason" '{"hookSpecificOutput":{
       "hookEventName":"PreToolUse","permissionDecision":"ask",
       "permissionDecisionReason":$r}}' ;;
esac
\`\`\`

Onde tem prompt, pede. Onde não tem, usa \`exit 2\`, que é o único mecanismo que bloqueia em qualquer modo, e a mensagem diz para sair do modo bypass e reexecutar se a intenção era real. Isso fecha a única brecha que restava.

E o log de auditoria é escrito **antes** da decisão, nunca depois. Se eu aprovar no automático, quero pelo menos ter o registro de que fui eu que aprovei, com data, sessão, regra e o comando inteiro. Auditoria que só grava o que foi bloqueado conta metade da história.

### Verificador separado, com dentes

O componente que o Osmani chama de mais útil é separar quem escreve de quem confere. [Subagentes](https://code.claude.com/docs/en/sub-agents) são o mecanismo.

O que eu acrescentaria é: **separe por restrição de ferramenta, não por instrução.** Dizer no prompt "você é read-only" é pedir cortesia. Não entregar as ferramentas de escrita é garantir.

Meus dois verificadores, um que planeja antes de mexer, um que revisa depois, não têm \`Edit\` nem \`Write\`. Também não têm a ferramenta de spawnar outros agentes, então são folhas da árvore: não conseguem delegar o próprio julgamento para um terceiro que teria escrita. O agente que implementa tem escrita, e não é o mesmo que aprova.

E tem um teto explícito no orquestrador: se a revisão não convergir em **três rodadas**, ele para e me reporta em vez de continuar tentando. Escrevi isso meses antes de ler qualquer coisa sobre Loop Engineering, por um motivo prosaico, vi um ciclo revisar e reescrever a mesma coisa sem convergir. É o "iteration cap" da literatura, aprendido na marra.

Um detalhe que economiza contexto: meus verificadores têm **formato de saída fixo**, e uma das seções obrigatórias é *"obstáculos encontrados"*, problema de ambiente, comando que precisou de flag especial, dependência que atrapalhou. Isso impede que quem chamou redescubra o mesmo tropeço. É estado externo em escala de subagente.

### A escada de verificação, na prática: escrevendo um operator

A tese 3 disse que em infra o verificador não é a suíte de testes. Mas isso não significa que não exista suíte. Significa que ela é **um degrau, não o topo**. O caso onde eu montei essa escada por inteiro foi escrevendo um operator Kubernetes em Go, com [Kubebuilder](https://book.kubebuilder.io/), e a ordem importa mais que cada peça.

**Degrau 1, compilar e passar o vet.** \`go build\` e \`go vet\`. Custa segundos, pega erro de digitação e de tipo. Óbvio, e ainda assim é o degrau que o agente mais tenta pular quando está confiante.

**Degrau 2, testes de unidade.** A lógica de tradução do operator concentra a maior parte deles, tabela-driven, dezenas de casos. É onde uma mudança de comportamento fica cravada em asserção.

E aqui está a regra que eu considero a mais valiosa deste artigo depois do \`exit 2\`, porque é a defesa direta contra reward hacking:

**Sempre que o agente adiciona um teste de regressão, ele tem que provar que o teste FALHA se você reverter a correção que ele guarda.** Um teste que passa igual com e sem a correção não está exercitando nada, é decoração que dá sensação de cobertura.

Isso é mutation testing manual, e resolve o problema central do loop autônomo. O agente é ótimo em escrever teste que passa. Pedir "escreva um teste", não. Digite "escreva um teste e me prove que ele pega o bug". É a diferença entre verificar e parecer que verificou.

**Degrau 3, testes de integração contra uma API real.** O reconciler roda contra \`envtest\`, que sobe um \`kube-apiserver\` e um \`etcd\` de verdade. Detalhe que virou nota na skill porque me custou uma sessão inteira de diagnóstico errado: esses binários **não vêm no repo**, precisam ser baixados uma vez por um passo de setup. Sem ele a suíte falha de um jeito que parece bug do código. Não era gap conhecido, era só um passo faltando, e eu quase "consertei" código que estava certo.

Essa é uma falha de loop clássica e vale nomear: **erro de ambiente que se disfarça de erro de código.** O agente lê o stack trace, acredita nele, e começa a consertar a coisa errada com muita confiança. O antídoto é o mesmo do resto: registrar o obstáculo por escrito na primeira vez que ele aparece, para a próxima sessão não repetir o diagnóstico.

**Degrau 4, o cluster local que imita o ambiente real.** E aqui está o limite duro do degrau anterior: \`envtest\` sobe a API do Kubernetes, mas **não sobe o data plane**. Ele não tem proxy de verdade, não move pacote. Qualquer coisa que dependa de comportamento real de rede, como um header sendo reescrito ou uma política aplicada no caminho do tráfego, passa no envtest e falha no mundo.

Então existe um degrau a mais: o Kubernetes que vem no Docker Desktop, rodando na minha máquina, configurado com **os mesmos valores de Helm do módulo que provisiona o ambiente real**. Não é um cluster de brinquedo com o default do chart; é o ambiente de produção em miniatura, e é isso que faz o teste valer. Ao lado dele, um backend que só ecoa os headers que recebeu, e um \`curl\`. Aí eu vejo o que realmente chegou.

Esse degrau também é onde mora um dos meus guardrails favoritos, e ele é de permissão, não de código: **os clusters reais são read-only para o agente**, só \`get\`, \`list\`, \`watch\`, \`logs\` e \`events\`, mais nada. O cluster local é a única exceção com acesso de escrita. A assimetria é o guardrail. O agente pode quebrar o quanto quiser onde quebrar é grátis, e não alcança onde não é.

E uma armadilha bem específica de quem roda WSL com Docker Desktop, que me custou um bom tempo: rodar o operator com \`go run\` no WSL e tentar alcançá-lo do cluster via \`host.docker.internal\` **não funciona**. WSL e a VM do Kubernetes do Docker Desktop são máquinas virtuais separadas. O DNS resolve, o que faz parecer que está tudo certo, e a conexão TCP simplesmente não completa. Diagnóstico enganoso do início ao fim.

**Não tem build de imagem no ciclo de iteração.** Editar arquivo, reiniciar o pod, ver o efeito, o loop interno fica em segundos em vez de minutos, e a imagem só é construída quando o comportamento já está validado. Que é exatamente o ponto: a imagem é o *resultado* do loop, não uma etapa dele.

**Degrau 5: A imagem. E só então,** quando os quatro degraus passam, aí sai a imagem, construída pelo serviço de build do registry, nunca na minha máquina.

Tem um sexto verificador nessa história que eu gosto de citar porque é um teste guardando **consistência entre duas fontes de verdade**, não comportamento. O RBAC do operator existe em dois lugares: um arquivo gerado a partir de marcadores no código, que **não pode ser editado à mão**, porque o gerador sobrescreve silenciosamente na próxima execução, e uma cópia de referência no manifesto. Um teste falha o build se os dois divergirem. Sem ele, alguém edita o gerado à mão, o gerador apaga na semana seguinte, e o operator perde permissão em produção sem ninguém ter tocado em permissão.

### Quando o CI é o verificador: ler a pipeline de volta

Os cinco degraus acima rodam antes do push. Depois do push existe outro verificador, que é o único que enxerga o ambiente de CI de verdade: a pipeline.

E é aqui que o loop se fecha de um jeito que eu não esperava que funcionasse tão bem. O agente não precisa que eu traduza o erro do CI para ele. Ele lê direto, pelo \`gh\` CLI ou pela tool de MCP do GitHub, pega o log do que falhou, corrige e empurra de novo.

O detalhe de eficiência que faz diferença é pedir **só o que falhou**:

\`\`\`bash
gh run list --branch "$(git branch --show-current)" --limit 1
gh run view <run-id> --log-failed
\`\`\`

\`--log-failed\` traz apenas os passos que quebraram. Jogar o log inteiro de um workflow no contexto é desperdício e, pior, enterra o erro real em milhares de linhas de saída de build bem-sucedida. Contexto é orçamento; log de CI é o item mais fácil de estourar.

Isso é *ground truth* do ambiente, no sentido exato que a Anthropic descreve, o agente não está julgando o próprio trabalho, está lendo o veredito de um sistema que ele não controla. Que é a definição de verificador honesto.

**E aqui vem a parte honesta:** esse é o pedaço **menos codificado** do meu setup. Os cinco degraus locais estão escritos numa skill; a leitura de CI ainda é convenção que vive na minha cabeça e se repete a cada sessão por hábito, não por procedimento. Não existe hook que dispare no push, não existe regra que force ler \`--log-failed\` em vez do log todo, não existe teto de quantas vezes tentar antes de me chamar.

### Skills: a descrição é o que decide

[Skills](https://code.claude.com/docs/en/skills) são arquivos \`SKILL.md\` com procedimento escrito. Elas seguem o [padrão aberto Agent Skills](https://agentskills.io), o que significa que não é conhecimento preso numa ferramenta só.

O que mais gente entende errado, e eu entendi errado por um bom tempo: **a \`description\` do frontmatter não é documentação, é o mecanismo de roteamento.** É por ela que o modelo decide carregar a skill ou não. Descrição vaga é skill que nunca dispara.

\`\`\`markdown
---
name: minha-skill
description: "O que faz + QUANDO usar, com as palavras que aparecem no pedido real. Diga também o que NÃO é, se existir skill vizinha que confunde."
---

## Quando usar
## Passos
## Guardrails
\`\`\`

Duas coisas que a prática ensinou. **Desambiguação explícita vale ouro**: eu tenho duas skills sobre Kubernetes  que fazem coisas diferentes, e cada descrição termina dizendo "isto é X, não Y, para Y use a outra". Sem isso, disparava a errada metade das vezes.

**Disclosure progressivo importa** porque o corpo da skill só carrega quando ela é usada. Procedimento no \`SKILL.md\`, material de referência longo em arquivos ao lado, script que ela chama num subdiretório. Referência de 300 linhas custa quase nada até o momento em que é necessária.

### Rules com escopo: disciplina de token

Um [\`CLAUDE.md\`](https://code.claude.com/docs/en/memory) carrega em toda requisição. Isso é uma faca de dois lados: o que está lá é sempre verdade, e você paga por isso sempre.

Então eu separei. O arquivo raiz ficou deliberadamente curto, contexto, modelo de nomenclatura, os não-negociáveis, e a regra de roteamento. Profundidade de domínio foi para arquivos que carregam **só quando um arquivo daquele tipo é editado**, via glob de caminho.

A lição de escopo veio de um erro que dói de lembrar. Minha regra de manifestos casava com \`**/*.yaml\`, extensão nua. Resultado: disparava em pipeline, em config de linter, em qualquer YAML do mundo, injetando guardrail de Kubernetes onde não tinha Kubernetes. Trocar para escopo por **convenção de diretório** resolveu. Regra que dispara errado treina você a ignorar regra.

### MCP no Docker: um gateway, muitos servidores

[MCP](https://code.claude.com/docs/en/mcp) é o que faz o loop alcançar sistemas reais. E aqui o Docker resolveu um problema chato de verdade.

Já escrevi um artigo inteiro sobre esse caminho, [MCP Server com Docker e Terraform: discovery, troubleshooting e produtividade](/artigos/terraform-mcp-server-docker), com a montagem passo a passo. Aqui o recorte é outro: o papel que ele cumpre dentro do loop.

Sem ele, cada servidor MCP é um processo com runtime próprio, dependência própria e credencial largada em algum \`.env\`. Com o [MCP Toolkit e o Catalog](https://docs.docker.com/ai/mcp-catalog-and-toolkit/), você habilita servidores pela interface do Docker Desktop e o [MCP Gateway](https://github.com/docker/mcp-gateway) agrega todos eles atrás de **uma única entrada** de configuração. Cada servidor roda em container, com limite de CPU e memória e \`no-new-privileges\`. E, o ponto que mais me importa, **as credenciais ficam no store cifrado do Docker**, não em arquivo no repo.

**O que eu tenho habilitado hoje.** Não adianta falar de sprawl de ferramentas em abstrato, então aqui está o inventário real, contado na saída do gateway enquanto eu escrevia este parágrafo:

| Servidor MCP | Ferramentas | Para que eu uso |
|---|---|---|
| \`atlassian\` | 77 | Jira e Confluence, o discovery do card e o comentário de volta no PR |
| \`azure\` | 65 | consulta de recurso, custo, quota, RBAC, diagnóstico |
| \`grafana\` | 65 | dashboards, consulta a métricas e logs, alertas |
| \`github-official\` | 44 | PR, issue, busca de código, leitura de workflow |
| \`playwright\` | 23 | navegar e validar página de verdade, não só supor |
| \`kubernetes\` | 23 | inspeção de cluster, sempre read-only fora do local |
| \`dockerhub\` | 13 | busca de imagem e checagem de tag |
| \`terraform\` | 9 | versão de provider e schema de recurso, o gate da tese 2 |
| \`mcp-python-refactoring\` | 9 | análise de código Python das automações |
| \`context7\` | 2 | documentação de biblioteca atualizada, contra alucinação de API |
| \`docker-docs\` | 1 | documentação oficial do Docker |

São **331 ferramentas em 11 servidores**, mais as nativas do próprio gateway, o que fecha as ~339 que aparecem no handshake. Um único container por servidor, uma única entrada de configuração no cliente.

Agora olhe essa tabela como orçamento em vez de catálogo. Três servidores concentram **207 das 331 ferramentas**, quase dois terços. Eu não uso 77 operações de Jira: uso quatro ou cinco. Esse é o custo escondido do "habilita que é fácil", e é a causa do problema de timeout logo abaixo, não só um detalhe de contexto.

**Você pode puxar esse setup inteiro com um comando.** Essa é a parte que eu descobri tarde e que mais me deixou com cara de bobo por ter configurado tudo na mão antes: um profile do MCP Toolkit **é publicável como artefato OCI**. Ele vai para um registry como qualquer imagem, e do outro lado alguém puxa e recebe a lista de servidores já montada.

Eu publiquei o meu:

\`\`\`bash
# publicar o profile local em um registry
docker mcp profile push profile rafaferreira011/public:latest

# do outro lado, instalar tudo de uma vez
docker mcp profile pull rafaferreira011/public:latest
\`\`\`

O [artefato está público no Docker Hub](https://hub.docker.com/r/rafaferreira011/public). Repare que **não é uma imagem executável**: são ~170 kB de JSON com \`artifactType\` \`application/vnd.docker.mcp.profile.v1+json\`, a relação de servidores com as imagens fixadas por digest. Ninguém roda esse artefato, o Toolkit lê e reconstrói a configuração.

Duas coisas que valem dizer, porque são exatamente as perguntas que eu faria:

**Segredo não viaja junto.** O profile guarda o *nome* do segredo e a variável de ambiente que ele preenche, nunca o valor. Os valores continuam no store cifrado da sua máquina. Eu confirmei baixando o meu próprio artefato e varrendo o JSON: zero token, zero chave. É o que torna publicar um profile uma coisa segura de fazer, e é o mesmo princípio da seção inteira, referência em vez de cópia.

**O profile público é um recorte, não o meu espelho.** São 8 servidores, os que funcionam para qualquer pessoa: Azure, GitHub, Terraform, Kubernetes, Playwright, Docker Hub, Docker Docs e Context7. Ficaram de fora justamente os que dependem de endpoint interno, porque nesses o campo de configuração carrega a URL do ambiente, e URL de ambiente interno em registry público é vazamento, não é conveniência. Segredo o Toolkit protege sozinho; **configuração ele não protege, e essa parte é sua.** Olhe o que vai no profile antes de dar push.

E fechando o argumento do orçamento de ferramentas lá de cima, existe a régua fina, que eu deveria ter começado a usar antes:

\`\`\`bash
docker mcp profile tools <profile-id> --disable atlassian.jira_delete_issue
docker mcp profile tools <profile-id> --disable-all playwright
\`\`\`

Dá para habilitar e desabilitar **ferramenta a ferramenta**, não só servidor inteiro. É a resposta certa para "77 operações de Jira das quais eu uso cinco": em vez de desligar o servidor e perder o que presta, corta a cauda e fica com o que você chama de verdade.

A configuração no lado do cliente é uma entrada só:

\`\`\`json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "type": "stdio",
      "command": "docker",
      "args": ["mcp", "gateway", "run"]
    }
  }
}
\`\`\`

Tem caminho ainda mais curto: no Docker Desktop, em **MCP Toolkit → Clients**, existe um botão que conecta o cliente e escreve esse arquivo por você. Pela CLI, o equivalente é \`docker mcp client connect claude-code\`. Segredo entra com \`docker mcp secret set\`, nunca no JSON. Depois é só rodar \`/mcp\` no cliente para conferir que conectou. O [blog oficial do Docker tem o passo a passo](https://www.docker.com/blog/add-mcp-servers-to-claude-code-with-mcp-toolkit/), e existe [um tutorial em vídeo do próprio Docker](https://www.youtube.com/watch?v=1Tu0c1zuz70) cobrindo a mesma sequência. Para diagnóstico, o Docker publica [um plugin oficial](https://github.com/docker/claude-plugins) que adiciona comandos de status e debug do gateway.

Agora as duas armadilhas que eu paguei, e que não estão em tutorial nenhum.

**Primeira: WSL.** Eu rodo o cliente dentro do WSL, com o Docker Desktop no Windows. O plugin \`docker mcp\` do lado Linux **não enxerga o Docker Desktop**, insiste que não está rodando, mesmo com o socket no lugar. Tentei symlink de socket, bind-mount, plugin alternativo; nada. A solução que funciona é chamar o **binário do Windows** via interop, \`docker.exe\`, que detecta o Desktop nativamente. Detalhe adicional: o arquivo de configuração precisa estar na **raiz do projeto**, não dentro do diretório de configuração do cliente, nesse segundo caminho ele é ignorado silenciosamente, e você fica olhando uma lista vazia sem nenhuma mensagem de erro.

**Segunda: timeout.** Gateway grande demora para subir. Ele carrega o catálogo, verifica imagens, inicia um container por servidor habilitado e lista as ferramentas de cada um **antes** de responder ao handshake. Eu medi: cerca de **21 segundos** para o \`initialize\` responder, já com as imagens em cache, servindo algumas centenas de ferramentas. O timeout padrão de conexão é de 30 segundos. Ou seja: funcionava quente e falhava frio, com uma mensagem de timeout que não diz nada sobre a causa.

A correção é aumentar o teto nas [configurações do cliente](https://code.claude.com/docs/en/settings):

\`\`\`json
{ "env": { "MCP_TIMEOUT": "120000", "MCP_TOOL_TIMEOUT": "180000" } }
\`\`\`

### Estado externo

O modelo esquece entre execuções. Então tem que existir memória fora dele, e ela opera em duas escalas no meu setup.

**Entre sessões**, memória persistente guarda o que foi descoberto e custou caro para descobrir, não estrutura de código, que o repo já conta, mas coisa como "esse comportamento estranho tem essa causa raiz", com data. Fato durável, um por arquivo, indexado.

**Dentro da sessão**, um par de hooks com estado: um registra cada arquivo tocado num arquivo temporário por sessão; o outro, no encerramento, filtra os arquivos de infraestrutura, me mostra a lista e lembra de rodar os gates antes do PR, e trunca o registro.

### O loop que melhora o loop

Voltando ao primeiro componente do Osmani: **automations são o que fazem um loop ser loop.** É a peça que eu demorei mais para colocar, e a que mais mudou as coisas.

Tenho uma rotina semanal agendada que lê os transcripts da própria semana e mede o que aconteceu: quais ferramentas foram mais chamadas, quais skills dispararam, quais subagentes foram acionados. Aí ela cruza isso com o que já existe no meu setup e propõe: aqui houve repetição que merece uma skill nova; aqui uma skill existente ficou vaga e precisa de descrição melhor.

A barra de aceitação é explícita, porque sem ela a rotina cria skill para tudo: precisa ser **repetível e não-óbvio**, ter aparecido em duas sessões com a mesma forma, *ou* ter custado iteração pesada uma vez, *ou* ser uma correção minha que ainda não estava escrita em lugar nenhum, do tipo "nesse repositório não crie nada", "sempre use tal comando".

E o detalhe que faz funcionar: ela registra o que foi **rejeitado**. Sem isso, a rodada seguinte propõe a mesma coisa de novo, e você passa a ignorar o relatório inteiro.

Tem uma segunda camada: uma skill de governança que define como escrever artefato nesse setup, quando é regra e quando é skill, limite de tamanho, e a obrigação de procurar sobreposição antes de criar coisa nova. Cada regra dela rastreia para uma falha concreta que eu vivi.

O loop tem meta-loop. E é aí que ele para de ser configuração e começa a ser sistema.

### Como eu montei essa rotina

O objetivo era fácil de enunciar: **toda semana, ler as minhas próprias sessões de trabalho e transformar o que se repetiu em skill**, nova quando não existe nada cobrindo, melhoria na que já existe quando existe. Nada de inventar processo: a fonte é o que eu de fato fiz na semana, com o agente, no ambiente real.

A primeira decisão apareceu antes de qualquer código: **onde vive o insumo.** E a resposta elimina de saída a opção mais confortável. Os transcripts das minhas sessões só existem na minha máquina, então um agendador na nuvem, que rodaria com o computador desligado, sem eu precisar lembrar de nada, veria commit e PR, e é exatamente isso que não interessa. Commit conta o que ficou de pé; transcript conta o que eu pedi, quantas tentativas custou e qual suposição estava errada. **O valor está no atrito, e o atrito só fica registrado localmente.** Sobrou tarefa agendada no sistema operacional chamando o cliente em modo headless: menos elegante, e a única com acesso ao que importa.

A segunda decisão foi de divisão de trabalho, e é a mesma tese do resto do artigo: **o que é determinístico não vai para o agente.** Destilar a semana é trabalho de shell, varrer os transcripts, contar chamada de ferramenta, extrair os prompts reais separando-os do ruído de plumbing, cruzar com o histórico de commits, listar o inventário de skills que já existe. Dezenas de megabytes viram um digest de umas seiscentas linhas em menos de um minuto, sem gastar um token. O agente entra depois, com o digest pronto na mão, para fazer só a parte que exige julgamento: isso é rotina ou foi acidente? já existe skill que cobre? melhora a que existe ou cria nova?

Aí vieram as paredes. Três, e todas se parecem exatamente igual do lado de fora, **o agente diz que precisa de aprovação e para**, sem pista de qual delas é:

- **O agente não escreve na própria camada de configuração.** O diretório de customização é caminho sensível: em modo não-interativo a escrita é recusada, com ou sem regra de permissão liberando explicitamente aquele caminho. E é proteção correta, rotina que pode reescrever as próprias permissões não é rotina, é risco. A saída foi inverter o fluxo: o agente escreve a proposta num diretório de staging, e um script de shell promove só o que casa um padrão estreito, arquivo \`.md\` dentro de \`skills/<nome>/\`, nunca configuração, nunca hook, nunca executável, guardando backup do que for sobrescrito. O que o script recusa, ele registra.
- **Liberar o caminho não libera criar arquivo.** Regra de permissão com escopo de caminho não limpa a aprovação de **criação** de arquivo novo, e a execução trava pedindo uma confirmação que, em headless, ninguém pode dar. Precisa combinar com o modo de permissão que aceita edição. Bônus: diretório oculto, começando com ponto, simplesmente não casa com o glob da regra, perdi um ciclo inteiro procurando bug antes de renomear o diretório e ver funcionar.
- **Comando composto não casa allow-list.** Eu havia liberado o script coletor por caminho; o agente rodou \`mkdir -p ... && ./coletor\` e a regra não casou. Isso virou princípio, e é o que consolidou a divisão acima: **passo determinístico roda no wrapper, não dentro do agente.**

O que a primeira execução real entregou: **uma skill nova**, um procedimento de virada de ingress que atravessa duas camadas de infraestrutura e que nenhuma skill existente cobria; **duas melhoradas**, uma delas ganhou a descoberta que mais me custou na semana, a de que o dry-run do cliente de linha de comando valida schema mas não avalia lógica de política de admissão, então "passou no dry-run" não significa nada ali; e **quatro rejeitadas**, cada uma com o motivo escrito, três delas por duplicarem skill existente.

Mas o item que me convenceu de que a coisa tinha valor foi outro: **ela corrigiu uma memória minha que estava errada.** Eu tinha um fato registrado dizendo que um certo repositório seguia meu fluxo padrão de branch e PR. Durante a semana eu havia dito o contrário, duas vezes, em sessões diferentes. A rotina leu isso nos transcripts, viu a contradição com o que estava escrito, e reescreveu o registro. O loop consertando o estado externo do próprio loop.

E uma honestidade sobre o alcance: **o passe agendado é rede de segurança, não o evento principal.** Rodando sem supervisão, o agente não pode me perguntar "isso vai repetir?", e essa resposta é justamente o critério que separa skill útil de entulho. Quando eu rodo o mesmo procedimento à mão, numa sessão normal, sai skill melhor. O agendamento existe porque o insumo é perecível e disciplina humana não é confiável; o refino continua sendo meu. Outer loop, de novo.

A verificação que me deixou tranquilo não foi ela ter criado skill, foi rodar duas vezes na mesma janela. Na segunda, reconheceu que a semana já tinha sido processada, reconferiu as rejeições anteriores e **não escreveu nada**. Zero arquivos promovidos. Automação que reescreve o que já existe a cada execução não é automação, é ruído com agenda.

### A automação que eu não escrevi

Outra automação que pensei: uma rotina para **apagar as sessões antigas**, com mais de uma semana. A motivação é menos glamourosa que a da anterior e mais séria. Transcript é texto puro, e **tudo que passa por uma ferramenta é gravado nele**, conteúdo de arquivo, saída de comando, o que eu colei no prompt. Em ambiente de plataforma isso significa detalhe de infraestrutura acumulando em texto claro no meu diretório de usuário, protegido só por permissão de arquivo do sistema. E o bom que o próprio claude code ja tem um mecanismo de limpeza: **o client já varre por idade na inicialização**, e o período é uma chave no arquivo de configuração do usuário, \`~/.claude/settings.json\`:

\`\`\`json
{ "cleanupPeriodDays": 8 }
\`\`\`

O default são 30 dias, o mínimo é 1. Baixar para 8 foi uma escolha minha.

**A varredura não cobre tudo.** Ela apaga transcript, transcript de subagente, saída grande derramada em arquivo, snapshot pré-edição, cache de imagem e de colagem. Só que o **histórico de prompts**, o arquivo que guarda tudo que eu já digitei, com data e projeto, fica fora dela e persiste indefinidamente. Quem baixa a retenção por privacidade e para aí resolveu a maior parte do problema achando que resolveu o problema inteiro.

**Retenção e janela de análise se amarram.** Se o transcript expira em oito dias e a rotina de skills olha oito dias para trás, os dois números batem no caso normal, mas uma semana perdida por férias ou máquina desligada fica irrecuperável, porque o insumo foi varrido antes da execução seguinte. Semana que não roda é semana que não existe. Duas configurações feitas em minutos, uma dependência entre elas que não estava escrita em lugar nenhum: é assim que loop vira sistema, e é por isso que a dependência precisa ir para o estado externo, se ela só existe na minha cabeça, ela não existe.

### Um inventário inteiro, do zero até virar sistema

O exemplo mais completo de tudo isso trabalhando junto não veio da rotina agendada, veio de um pedido pontual: mapear todas as tecnologias em uso num ambiente de plataforma com dezenas de repositórios. Sem inventário prévio. Era descobrir do zero, e o resultado ia decidir o que precisava virar skill.

A primeira rodada foi fan-out puro: um agente por área, infraestrutura como código, pipelines, orquestração de containers, linguagens, todos em paralelo, cada um devolvendo o que achou. Saiu organizado, sem furo visível. Foi exatamente essa perfeição que me fez desconfiar: levantamento bom demais de um ambiente que eu sei que é bagunçado é sinal de cobertura rasa, não de sorte. Pedi mais uma passada, recortando por um repositório específico que eu sabia ser denso, e a lista de tecnologias daquele recorte sozinho quase dobrou o total. O primeiro fan-out tinha visitado cada área uma vez e chamado isso de completo.

Fechei a segunda rodada com o mesmo princípio de sempre: quem escreve não confere. Nova leva de agentes, mas com a instrução invertida, não confirme o que já está escrito, **tente refutar**. Cada um recebeu um pedaço do levantamento e a ordem explícita de achar erro, não validar acerto. Valeu a rodada: achou um item que não existia (um agente anterior tinha inventado um detalhe plausível que não batia com o ambiente real), achou outro atribuído ao lugar errado, e um terceiro marcado como "desativado" quando na verdade estava ativo em produção. Nenhum dos três ia aparecer se eu tivesse pedido para o mesmo agente reler o próprio trabalho, ele ia confirmar o que já acreditava.

Com o levantamento fechado, o passo seguinte foi virar aquilo em conhecimento operacional, não documento pra ler uma vez, skill que o sistema carrega quando alguém pedir ajuda com uma daquelas tecnologias. E aqui entrou a decisão que o resto do artigo já defende, aplicada em escala: **nem tudo virou skill.** Duas coisas viraram **hook**, porque a regra era "isso tem que acontecer sempre, sem depender do modelo lembrar", um aviso de dependência de terceiro que tinha acabado de ser descontinuada e um checador de configuração que falha calado em vez de dar erro. **Nada virou agente novo**, porque agente é persona isolada com escopo de ferramenta próprio, e cada tecnologia daquelas era conhecimento de referência, não um papel a interpretar. Artefato errado custa tanto quanto artefato nenhum, essa parte do julgamento não terceirizo.

Pra não terminar com dezenas de skills competindo pela mesma descrição, agrupei por domínio operacional, um \`SKILL.md\` raiz por área, arquivo de referência por tecnologia dentro dele, carregado só quando aquela tecnologia específica entra na conversa. Antes de escrever a primeira linha, consultei a documentação oficial do próprio formato de skill via MCP: a intuição de "menor é melhor" tem limite, e o padrão oficial recomenda exatamente esse agrupamento com disclosure progressivo, pra não competir por trigger nem custar contexto à toa quando ninguém precisa daquele arquivo.

O último passo foi replicar tudo numa segunda camada de customização, que outra ferramenta usa nesse mesmo ambiente. A motivação não foi capricho de organização: é redundância de verdade. Se o Claude Code sair do ar, tiver uma degradação, ou eu simplesmente precisar trocar de ferramenta num dia ruim, o conhecimento não desaparece junto, ele já existe traduzido, pronto para outro agente carregar. Skill, hook e regra viraram ativo do time, não vendor lock-in de configuração. Eu esperava find-and-replace de caminho. Não foi. A documentação oficial da outra ferramenta, puxada via MCP na hora, corrigiu duas suposições de uma vez: a numeração das regras "inegociáveis" era diferente entre as duas camadas, citar por número mantendo só o nome do arquivo teria virado referência errada, e o formato de skill que eu vinha usando já era, na prática, um padrão aberto que a outra ferramenta também suporta nativamente, pasta de recurso e tudo. MCP não é só pra puxar doc de infraestrutura. É pra puxar doc de qualquer coisa que eu não deveria assumir de memória, incluindo o próprio formato que eu uso pra ensinar o agente.

## Conclusão

O que eu levaria daqui, na ordem em que eu faria de novo:

- **Comece pelo verificador, não pelo agente.** Sem gate honesto, aumentar autonomia só aumenta a velocidade com que você acumula problema. Um loop com verificador ruim é pior que nenhum loop, porque parece estar funcionando.
- **Escreva o freio antes do acelerador.** Teto de iteração, regra de parada, guardrail que dispara antes da geração. Quatro dos cinco itens da anatomia de um loop são freios; essa proporção não é acidente.
- **Separe quem escreve de quem confere, por ferramenta, não por instrução.** Read-only de verdade é não ter a ferramenta de escrita.
- **Um hook que sai com código 2 é feedback de loop de verdade.** É a peça mais barata e mais eficaz do meu setup, e não tem nada de IA nela.
- **Escreva primeiro a trava de remoção, e faça ela desconfiar de você.** Toda operação destrutiva para e pede autorização, inclusive no modo que liberou o resto, inclusive quando o pedido veio de uma ferramenta e não do shell. É o único guardrail que protege contra o operador no automático, e não contra o agente. Falso positivo nessa checagem é preço, não defeito.
- **Exija que o teste de regressão prove que pega o bug.** Se ele passa igual com e sem a correção, não testa nada. Não pedir "escreva um teste". Use "reverta a correção e me mostre o teste falhando" é a defesa mais barata que existe contra reward hacking.
- **Ordene os gates por custo e nunca deixe pular degrau.** Compilar, unidade, integração com API real, cluster local espelhando o ambiente de verdade, e só então a imagem. A imagem é o resultado do loop, não uma etapa dele.
- **Deixe o agente ler o CI sozinho, mas só a parte que falhou.** Ele não precisa que você traduza o erro. Precisa de acesso ao veredito e de disciplina para não arrastar o log inteiro para o contexto.
- **Default otimista, correção barata.** Onde o loop precisaria perguntar, faça ele escolher o mais provável, declarar em voz alta o que escolheu e continuar. Pergunta bloqueante no começo de toda tarefa transforma o loop em formulário. Só não esqueça de escrever as exceções: se a busca voltar vazia, pede, nunca inventa.
- **Guarde o estado do ciclo onde qualquer sessão acha.** A chave da tarefa no nome da branch faz o objetivo sobreviver a compactação, a sessão nova e a subagente. Estado externo não precisa de banco; às vezes precisa só de uma convenção de nome respeitada.
- **Deixe a descrição fazer o roteamento.** Skill boa com descrição ruim não dispara. Escope regra por convenção de diretório, nunca por extensão nua.
- **Automation é o que separa configuração de sistema.** Sem rotina agendada, você tem um setup bonito. Com ela, você tem um loop.
- **Discorde do padrão quando o seu domínio pedir.** Eu tirei worktree porque em infra o isolamento que importa é de estado, não de arquivo.

E o mais importante: **o outer loop continua sendo seu.** Delegar o ciclo interno é alavancagem; delegar o julgamento é abdicação. A frase com que o Osmani fecha o artigo dele é a melhor síntese que eu achei disso, e serve de régua: *"Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go."*

`,
  date: "2026-07-26",
  category: "Artigos",
  readTime: "47 min de leitura",
  tags: ["IA", "Platform Engineering", "DevOps", "Docker"]
};
