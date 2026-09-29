import type { Article } from '../types';

export const article: Article = {
  slug: "claude-code-notificacoes-wsl",
  title: "Notificações no Claude Code: hooks Notification e Stop no WSL com VS Code",
  excerpt: "Como fazer o Claude Code avisar quando precisa de aprovação ou termina, no WSL dentro do VS Code, com hooks e um alerta que sobrevive ao Não Perturbe.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/claude-notif/capa.png",
  content: `

![Infográfico de capa: linha do tempo de um turno do agente, com o agente parando às 14h02 para pedir aprovação e o humano só percebendo às 14h21, marcando dezenove minutos perdidos; coluna à esquerda com preferredNotifChannel, escopo de usuário, hooks Notification e Stop, FlashWindowEx e kill-switch; ao centro o fluxo do hook indo do JSON no stdin para o roteador em bash e daí para o piscar da barra de tarefas do Windows](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/claude-notif/capa.png)

## O problema

Você pede uma tarefa longa para o agente, troca de janela para fazer outra coisa e volta vinte minutos
depois. O agente trabalhou por um minuto, parou para pedir aprovação de um comando e ficou os outros
dezenove esperando você olhar para a tela.

Escrevi sobre [como eu opero agentes no dia a dia](/artigos/loop-engineering-na-pratica), e o ponto central
lá é que o objetivo é deixar de ser a peça que dá o próximo passo. Só que existe um ponto do ciclo em que
o humano é obrigatório: aprovar uma operação destrutiva, responder uma pergunta, decidir entre dois
caminhos. Esse ponto não dá para automatizar, mas dá para encurtar. Se o agente para às 14h02 e você
descobre às 14h21, dezenove minutos foram embora por um motivo bobo: ninguém te avisou.

Este artigo é o passo a passo de como resolver isso no ambiente que eu uso, que é provavelmente o mais
comum entre quem trabalha com plataforma no Windows: **Claude Code via CLI, rodando no WSL, dentro do
terminal integrado do VS Code**.

## O caminho nativo: \`preferredNotifChannel\`

O Claude Code tem uma configuração própria de notificação. Ela vive no \`settings.json\` e aceita estes
valores:

| Valor | O que faz |
| --- | --- |
| \`auto\` | Padrão. Detecta o terminal e usa a notificação nativa dele |
| \`terminal_bell\` | Emite o caractere de bell (\`\\a\`) |
| \`iterm2\` / \`iterm2_with_bell\` | Notificação nativa do iTerm2 (macOS) |
| \`kitty\` / \`ghostty\` | Notificação nativa desses terminais |
| \`notifications_disabled\` | Desliga tudo |

O detalhe que importa: **\`auto\` não entrega nada no terminal integrado do VS Code**. A detecção procura
iTerm2, Kitty ou Ghostty. Não achando nenhum, ela não tem para onde mandar e silenciosamente não faz nada.
Como o padrão é \`auto\`, a conclusão natural de quem roda no VS Code é que "o Claude Code não notifica",
quando na verdade ele está notificando para um canal que não existe ali.

O que funciona nesse terminal é o bell:

\`\`\`json
// ~/.claude/settings.json
{
  "preferredNotifChannel": "terminal_bell"
}
\`\`\`

E, do lado do VS Code:

\`\`\`json
// settings.json do VS Code
{
  "terminal.integrated.enableBell": true
}
\`\`\`

Com os dois ligados, a aba do terminal ganha um ícone de sino quando o agente pede atenção. É barato e vale
a pena ligar. Mas resolve pouco: só te ajuda se você já estiver com o VS Code na tela. Se você trocou de
janela — que é exatamente o caso do problema — um marcador dentro da janela que você não está vendo não
serve de nada.

Para isso a gente precisa de hooks.

![Infográfico com os cinco valores de preferredNotifChannel em cartões: auto marcado como padrão, terminal_bell, iterm2 e iterm2_with_bell, kitty e ghostty, e notifications_disabled. O cartão auto está destacado em violeta com a anotação de que a detecção procura iTerm2, Kitty e Ghostty e, não achando nenhum, não manda nada. Abaixo, duas caixas de configuração lado a lado, preferredNotifChannel terminal_bell no settings.json do Claude Code e terminal.integrated.enableBell true no settings.json do VS Code, ligadas a um ícone de sino na aba do terminal](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/claude-notif/1.png)

## A pegadinha do escopo: usuário ou projeto?

Antes do código, o erro que faz um hook correto nunca rodar.

O Claude Code tem dois lugares para declarar hooks: o \`settings.json\` **do projeto**
(\`.claude/settings.json\` no repositório) e o **do usuário** (\`~/.claude/settings.json\`). A diferença é
sutil e cara: o \`settings.json\` de projeto só é lido quando a sessão **abre naquele diretório**.

Eu tinha um hook de notificação declarado no \`.claude/settings.json\` da raiz do meu workspace. Só que eu
quase nunca abro o Claude Code na raiz: eu abro dentro de um repositório específico, um nível abaixo. E,
aberta lá, a sessão carrega as skills e rules herdadas, mas **não carrega aquele bloco de hooks**. Ou seja:
o hook existia, estava correto, e não rodava praticamente nunca. Nenhum erro, nenhum aviso. Só silêncio.

A regra que eu tiro disso é simples. **Hook de domínio vai no projeto; hook transversal vai no usuário.**
Um guardrail que valida manifesto de Kubernetes só faz sentido no repositório que tem manifesto. Já
notificação não tem nada a ver com o repositório: eu quero ser avisado em qualquer sessão, em qualquer
diretório. Então ela vai no escopo de usuário:

\`\`\`json
// ~/.claude/settings.json
{
  "preferredNotifChannel": "terminal_bell",
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/hooks/notify-desktop.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/hooks/notify-desktop.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
\`\`\`

Dois detalhes desse bloco:

**Use caminho absoluto.** Em hook de projeto é comum escrever \`$CLAUDE_PROJECT_DIR/.claude/hooks/...\`.
Aqui isso não serve: essa variável aponta para o repositório da sessão atual, que muda a cada vez. Como o
script é único e global, ele precisa de um caminho fixo.

**Os settings somam, não substituem.** Se o mesmo evento estiver declarado no escopo de usuário e no de
projeto, os dois rodam. É ótimo quando são coisas diferentes: no meu caso, o \`Stop\` de usuário notifica e
o \`Stop\` do projeto imprime um resumo dos arquivos de infra tocados na sessão, e um não atrapalha o outro.
Vira problema quando é o mesmo hook nos dois lugares: aí você recebe a notificação duas vezes. Ao mover um
hook para o escopo de usuário, lembre de tirar do projeto.

## O notificador: por que piscar a barra de tarefas

A escolha óbvia no Windows é o toast, aquele balão no canto inferior direito. Eu comecei por ele e ele não
resolveu, por um motivo que provavelmente vale para muita gente.

**O toast morre com o "Não perturbe" ligado.** Ele não some: ele entra mudo e direto na Central de
Notificações, onde só aparece se você abrir (Win+N). Como o "Não perturbe" é justamente o que a gente liga
para conseguir trabalhar, o canal que deveria te chamar é o primeiro a ser silenciado. E o som, que seria o
plano B, morre junto se o volume estiver em zero, o que num notebook em reunião é o normal.

O que sobrevive aos dois é a API mais velha da lista: **\`FlashWindowEx\`**, que pisca o botão da janela na
barra de tarefas. Ela não passa pelo subsistema de notificações do Windows, então "Não perturbe" não a
afeta; não emite som, então volume zero não a afeta. E, com a combinação certa de flags, ela pisca **até a
janela receber foco**: se você voltar dez minutos depois, o ícone ainda está laranja te esperando.

De brinde, ela se autossuprime: chamar \`FlashWindowEx\` numa janela que já está em foco não faz nada. Isso
é exatamente o comportamento que a gente quer, porque se o VS Code está em foco você já está olhando.

O script abaixo faz as duas coisas: pisca (canal principal) e dispara o toast (que serve como histórico na
Central de Notificações, mesmo entrando mudo).

\`\`\`powershell
# ~/.claude/hooks/notify-desktop.ps1
param(
  [string]$Title = 'Claude Code',
  [string]$Body  = 'Precisa da sua atencao'
)

$SkipWhenFocused = $true

$ErrorActionPreference = 'SilentlyContinue'

Add-Type @'
using System;
using System.Runtime.InteropServices;
public class ClaudeNotify {
  [StructLayout(LayoutKind.Sequential)]
  public struct FLASHWINFO {
    public uint cbSize; public IntPtr hwnd; public uint dwFlags; public uint uCount; public uint dwTimeout;
  }
  [DllImport("user32.dll")] static extern bool FlashWindowEx(ref FLASHWINFO pwfi);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();

  const uint FLASHW_ALL = 3;        // titulo + botao na barra de tarefas
  const uint FLASHW_TIMERNOFG = 12; // pisca ate a janela receber foco

  public static void FlashUntilFocused(IntPtr hwnd) {
    FLASHWINFO f = new FLASHWINFO();
    f.cbSize = (uint)Marshal.SizeOf(f);
    f.hwnd = hwnd;
    f.dwFlags = FLASHW_ALL | FLASHW_TIMERNOFG;
    f.uCount = 0;
    f.dwTimeout = 0;
    FlashWindowEx(ref f);
  }
}
'@

$window = Get-Process -Name Code -ErrorAction SilentlyContinue |
          Where-Object { $_.MainWindowHandle -ne 0 } |
          Select-Object -First 1

if ($window) {
  if ($SkipWhenFocused -and [ClaudeNotify]::GetForegroundWindow() -eq $window.MainWindowHandle) {
    exit 0
  }
  [ClaudeNotify]::FlashUntilFocused($window.MainWindowHandle)
}

try {
  [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
  $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent(
    [Windows.UI.Notifications.ToastTemplateType]::ToastText02)
  $nodes = $template.GetElementsByTagName('text')
  $nodes.Item(0).AppendChild($template.CreateTextNode($Title)) | Out-Null
  $nodes.Item(1).AppendChild($template.CreateTextNode($Body))  | Out-Null
  [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Microsoft.VisualStudioCode').Show(
    [Windows.UI.Notifications.ToastNotification]::new($template))
} catch { }

exit 0
\`\`\`

Uma observação sobre o AppId \`Microsoft.VisualStudioCode\` na chamada do toast: o Windows 11 descarta em
silêncio toasts de AppIds que não estão registrados na máquina. O AppId do PowerShell normalmente não está,
e é por isso que muito exemplo de internet "funciona" (a API retorna sucesso) sem nunca mostrar nada.
Usar o AppId de um aplicativo que já é registrado resolve, e de quebra o toast sai com o ícone dele.

Se você quiser o toast furando o "Não perturbe", dá: Configurações → Sistema → Notificações → Não perturbe
→ *Definir notificações prioritárias*, e adicione o Visual Studio Code. É opcional: o canal principal aqui
não depende disso.

![Infográfico dividido em dois painéis. À esquerda, TOAST: o balão do Windows saindo do canto inferior direito, com duas linhas vermelhas marcando que ele entra mudo na Central de Notificações quando o Não Perturbe está ligado e que o som morre com o volume em zero. À direita, FLASHWINDOWEX: o botão do VS Code piscando em laranja na barra de tarefas, com três linhas em ciano marcando que não passa pelo subsistema de notificações, que não emite som e que pisca até a janela receber foco graças às flags FLASHW_ALL e FLASHW_TIMERNOFG. Barra de rodapé com a frase de que o canal que deveria te chamar é o primeiro a ser silenciado](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/claude-notif/2.png)

## O roteador: o que o hook recebe e como decidir

O script PowerShell sabe *como* avisar. Falta decidir *quando* avisar e *o quê* dizer, e isso vem do JSON
que o Claude Code entrega no stdin do hook.

O evento \`Notification\` traz \`message\`, \`title\` (opcional) e, o campo que interessa,
\`notification_type\`:

| \`notification_type\` | Quando dispara | No script abaixo |
| --- | --- | --- |
| \`permission_prompt\` | O agente está pedindo aprovação para uma ferramenta | Notifica |
| \`agent_needs_input\` | Um subagente está esperando entrada | Notifica |
| \`idle_prompt\` | O agente terminou e você não digitou nada desde então | Notifica |
| \`agent_completed\` | Um subagente terminou | Ignorado: o \`Stop\` já cobre o fim do turno |
| \`auth_success\` e outros | Autenticação, quota, avisos internos | Ignorado |

Já o evento \`Stop\`, que dispara no fim de cada turno, traz \`last_assistant_message\`, a última mensagem
do agente. Dá para usar a primeira linha dela como corpo da notificação, o que é bem melhor do que um
genérico "terminei": você lê o que aconteceu direto do toast, sem voltar para a janela.

Tratar esses tipos de forma diferente é o que separa uma notificação útil de um incômodo. Aprovação é
urgente; \`auth_success\` é ruído e não deveria te interromper nunca.

Antes do script, uma dependência: ele usa \`jq\` para ler o JSON, e o Ubuntu do WSL não vem com ele. Como
o script sai em silêncio quando o \`jq\` falta (é o comportamento correto para um hook, mas é indistinguível
de "não funcionou"), instale primeiro:

\`\`\`bash
sudo apt install -y jq
\`\`\`

\`\`\`bash
#!/usr/bin/env bash
# ~/.claude/hooks/notify-desktop.sh
set +e

# Kill-switches: um geral (se voce ja tiver um para seus hooks) e um so da notificacao.
if [ "$\{HOOKS_ENABLED}" = "false" ]; then exit 0; fi
if [ "$\{CLAUDE_NOTIFY}" = "off" ]; then exit 0; fi
command -v powershell.exe >/dev/null 2>&1 || exit 0

raw_input="$(cat 2>/dev/null)"
[ -z "$raw_input" ] && exit 0
command -v jq >/dev/null 2>&1 || exit 0

event="$(printf '%s' "$raw_input" | jq -r '.hook_event_name // ""' 2>/dev/null)"

case "$event" in
  Notification)
    ntype="$(printf '%s' "$raw_input" | jq -r '.notification_type // ""' 2>/dev/null)"
    case "$ntype" in
      permission_prompt|agent_needs_input) body="Precisa da sua aprovacao" ;;
      idle_prompt)                         body="Esperando sua resposta" ;;
      *)                                   exit 0 ;;   # auth_success, quota: ruido
    esac
    ;;
  Stop)
    last="$(printf '%s' "$raw_input" \\
      | jq -r '(.last_assistant_message // "") | split("\\n")[0] | .[0:120]' 2>/dev/null)"
    if [ -n "$last" ]; then body="Terminei: $\{last}"; else body="Terminei"; fi
    ;;
  *)
    exit 0
    ;;
esac

# powershell.exe nao enxerga caminho WSL; converter para o caminho Windows.
script_dir="$(cd "$(dirname "$\{BASH_SOURCE[0]}")" && pwd)"
ps1_win="$(wslpath -w "$\{script_dir}/notify-desktop.ps1" 2>/dev/null)"
[ -z "$ps1_win" ] && exit 0

body="$\{body//\\'/}"
body="$\{body//\\"/}"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$ps1_win" \\
  -Title "Claude Code" -Body "$body" >/dev/null 2>&1 &

exit 0
\`\`\`

Três decisões nesse script que valem explicação:

**\`wslpath -w\`.** O \`powershell.exe\` é um binário Windows: ele não entende \`/home/voce/.claude/...\`.
Sem a conversão para o caminho Windows, ele simplesmente não acha o arquivo. Vale saber o que sai dessa
conversão, porque não é o que a gente espera: como o script mora no filesystem do WSL, o caminho é UNC
(\`\\\\wsl.localhost\\Ubuntu\\home\\voce\\...\`), não \`C:\\...\`. Só o que está em \`/mnt/c/\` vira letra
de unidade. Para a chamada tanto faz, o PowerShell abre os dois, mas se você for depurar à mão é bom não
estranhar.

**O \`&\` no fim.** Subir um \`powershell.exe\` do WSL custa perto de um segundo, e o \`Add-Type\` compila
C# em tempo de execução. O hook tem \`timeout\`, e segurar o agente por um segundo a cada notificação é um
imposto que não faz sentido pagar. Jogando para background, o hook retorna em milissegundos.

**Sair cedo quando falta dependência.** Sem \`jq\`, sem \`powershell.exe\`, sem stdin: \`exit 0\`. Hook de
notificação nunca deve quebrar a sessão por causa de si mesmo. O preço desse desenho é o da seção anterior:
falta de dependência e funcionamento normal têm exatamente a mesma cara, então instale o \`jq\` antes de
concluir que a receita não funciona.

![Infográfico do roteamento: no topo, um cartão com o JSON que chega no stdin do hook. Abaixo, um nó divisor que separa por hook_event_name em dois caminhos, Notification e Stop. O caminho Notification abre em cinco cartões de notification_type, com permission_prompt, agent_needs_input e idle_prompt em ciano levando a corpos de notificação, e agent_completed e auth_success em cinza levando a um cartão exit 0 marcado como ruído. O caminho Stop mostra last_assistant_message sendo cortada na primeira linha e nos 120 caracteres. Barra de rodapé com a frase de que tratar esses tipos de forma diferente é o que separa uma notificação útil de um incômodo](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2026/claude-notif/3.png)

## Testando — e por que meus dois primeiros testes não valeram nada

Essa parte é a que eu mais quero que fique, porque eu errei aqui.

Escrevi o script, rodei à mão para testar e não vi nada. Rodei de novo, nada. A primeira reação foi achar
que o script estava quebrado. Só que não estava: **o teste é que era inválido**.

Os dois primeiros testes rodaram com o VS Code em foco. Nessa condição, o script sai antes de piscar (é o
\`$SkipWhenFocused\`), e mesmo sem ele a \`FlashWindowEx\` não faria nada, porque piscar janela em foco não
é uma operação que existe. Eu tinha testado, com capricho, exatamente a condição em que o comportamento
correto é não acontecer nada.

A segunda tentativa foi disparar com atraso fixo: "dispara em 12 segundos, troque de janela". Também não
valeu: aos 12 segundos eu ainda estava no VS Code, lendo a mensagem que mandava eu sair dele.

O teste que presta tira o tempo da equação. Em vez de contar segundos, ele **espera o foco sair** e dispara
no instante em que sai:

\`\`\`powershell
# espera o VS Code perder o foco e so entao dispara
$code = Get-Process -Name Code | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
$deadline = (Get-Date).AddSeconds(90)
while ((Get-Date) -lt $deadline) {
  if ([ClaudeNotify]::GetForegroundWindow() -ne $code.MainWindowHandle) {
    [ClaudeNotify]::FlashUntilFocused($code.MainWindowHandle)
    'Disparado.'
    break
  }
  Start-Sleep -Milliseconds 800
}
\`\`\`

E os caminhos do hook em si, com o VS Code minimizado ou em outra tela:

\`\`\`bash
# pedido de aprovacao
echo '{"hook_event_name":"Notification","notification_type":"permission_prompt"}' \\
  | bash ~/.claude/hooks/notify-desktop.sh

# fim de turno, com a mensagem real no corpo
echo '{"hook_event_name":"Stop","last_assistant_message":"Terminei o refactor."}' \\
  | bash ~/.claude/hooks/notify-desktop.sh

# tipo de ruido: nao deve notificar nada
echo '{"hook_event_name":"Notification","notification_type":"auth_success"}' \\
  | bash ~/.claude/hooks/notify-desktop.sh
\`\`\`

A lição que sobra é maior que o script: **a API retornar sucesso não é verificação**. No caminho do toast,
o Windows aceitou a notificação quatro vezes seguidas e devolveu \`OK\` nas quatro, e eu não vi nenhuma
delas, porque o "Não perturbe" mandava todas, mudas, direto para a Central de Notificações. "O sistema
aceitou" e "a pessoa foi avisada" são duas afirmações diferentes, e só a segunda é o objetivo. Vale para
notificação e vale para praticamente tudo em infraestrutura: o \`Succeeded\` do control plane não prova que
a coisa funciona, prova que o pedido foi aceito.

## Kill-switch e detalhes finais

Duas coisas para fechar.

**O kill-switch.** Em dia de foco absoluto, \`export CLAUDE_NOTIFY=off\` silencia só a notificação, sem
derrubar os hooks de guardrail. Separar os dois interruptores importa: você nunca quer estar numa situação
em que a única forma de calar a notificação é desligar as travas de segurança junto.

**Reabra o Claude Code.** O \`settings.json\` é lido na abertura da sessão. Depois de mexer nos hooks, a
sessão que já está aberta continua com a configuração antiga, o que gera aquele minuto de confusão
achando que nada funcionou.

E se um dia parar de funcionar sem motivo aparente, o suspeito é a barra de tarefas com ocultação
automática: piscar um botão que não está na tela não avisa ninguém.

No fim, o que essa configuração faz é pequeno: um ícone que pisca. Mas ela devolve os dezenove minutos do
começo do artigo, e faz isso sem depender de som, sem depender de notificação ligada e sem exigir que você
fique de olho na janela. Para um ciclo em que o humano só entra nos pontos onde ele é obrigatório, o que
importa é que esses pontos sejam curtos.
`,
  date: "2026-09-27",
  category: "Artigos",
  readTime: "12 min de leitura",
  tags: ["IA", "DevOps"]
};

/* IMAGE GENERATION PROMPTS

Bloco de estilo (colar no topo de CADA um dos 4 prompts):

  Infográfico técnico dark navy, 16:9, alta densidade de informação, como um slide de conferência bem
  desenhado. Fundo: gradiente azul-marinho profundo com textura sutil de placa de circuito e painéis
  fantasma de editor de código nos cantos. Acentos: ciano elétrico, azul vivo, violeta. O conteúdo fica
  em cartões escuros arredondados com bordas finas luminosas. Ícones de linha fina dentro de círculos.
  Sans-serif geométrica limpa: títulos brancos com palavras-chave destacadas em ciano ou violeta, corpo
  em cinza claro. Use os logos oficiais reais de Claude (Anthropic), Visual Studio Code, WSL/Ubuntu e
  Windows. Todo o texto em português do Brasil, grafado exatamente como escrito abaixo.

--- CAPA (capa.png) ---
Bloco de título no canto superior esquerdo: "NOTIFICAÇÕES NO CLAUDE CODE" com "NOTIFICAÇÕES" em ciano.
Subtítulo: "hooks Notification e Stop no WSL com VS Code".
Coluna esquerda com 5 linhas de ícone + título MAIÚSCULO colorido + uma linha cinza:
  - sino riscado / "PREFERREDNOTIFCHANNEL" / "auto não entrega nada no VS Code"
  - pasta com engrenagem / "ESCOPO DE USUÁRIO" / "hook transversal não mora no projeto"
  - webhook / "NOTIFICATION E STOP" / "os dois eventos que importam"
  - janela piscando / "FLASHWINDOWEX" / "sobrevive ao Não Perturbe"
  - interruptor / "KILL-SWITCH" / "CLAUDE_NOTIFY=off"
Diagrama isométrico central: um relógio marcando "14h02" ligado por uma linha tracejada laranja a outro
relógio marcando "14h21", com o rótulo "19 MINUTOS PERDIDOS" em vermelho suave no meio da linha.
Barra de rodapé de largura total: "O agente parou às 14h02. Você descobriu às 14h21."

--- 1.png (fim da seção "O caminho nativo") ---
Recipe: taxonomia / fan-out.
Cartão de entrada no topo: "preferredNotifChannel". Nó divisor abaixo dele, depois 5 cartões em linha:
  "AUTO" (chip "PADRÃO", contornado em VIOLETA para destacar) / "procura iTerm2, Kitty, Ghostty"
  "TERMINAL_BELL" / "emite o caractere de bell"
  "ITERM2" / "notificação nativa, macOS"
  "KITTY / GHOSTTY" / "notificação nativa do terminal"
  "NOTIFICATIONS_DISABLED" / "desliga tudo"
Sob o cartão AUTO, uma seta tracejada terminando num X vermelho e no rótulo "no VS Code: nada".
Faixa inferior com duas caixas de código lado a lado, cada uma com seu logo:
  logo Claude + "~/.claude/settings.json" + "preferredNotifChannel: terminal_bell"
  logo VS Code + "settings.json do VS Code" + "terminal.integrated.enableBell: true"
As duas caixas apontam para um ícone de sino numa aba de terminal.
Barra de rodapé: "Ele notifica para um canal que não existe ali."

--- 2.png (fim da seção "O notificador") ---
Recipe: comparação split.
Divisor vertical central. Painel esquerdo, cabeçalho "TOAST" com logo do Windows: balão de notificação
saindo do canto inferior direito; linhas com X violeta:
  "Não Perturbe: entra mudo na Central"
  "Volume zero: o som morre junto"
Painel direito, cabeçalho "FLASHWINDOWEX" com o ícone do VS Code piscando em laranja na barra de tarefas;
linhas com check ciano:
  "Não passa pelo subsistema de notificações"
  "Não emite som"
  "Pisca até a janela receber foco"
Chip pequeno sob o painel direito: "FLASHW_ALL | FLASHW_TIMERNOFG".
Barra de rodapé: "O canal que deveria te chamar é o primeiro a ser silenciado."

--- 3.png (fim da seção "O roteador") ---
Recipe: taxonomia / fan-out.
Cartão de entrada no topo: bloco de código com "{ hook_event_name, notification_type }" e o rótulo
"stdin do hook". Nó divisor que abre em dois caminhos rotulados "NOTIFICATION" e "STOP".
Do lado NOTIFICATION, 5 cartões:
  "PERMISSION_PROMPT" (ciano) -> "Precisa da sua aprovacao"
  "AGENT_NEEDS_INPUT" (ciano) -> "Precisa da sua aprovacao"
  "IDLE_PROMPT" (ciano) -> "Esperando sua resposta"
  "AGENT_COMPLETED" (cinza, apagado) -> "exit 0"
  "AUTH_SUCCESS" (cinza, apagado) -> "exit 0"
Os dois cartões cinza convergem para uma caixa rotulada "RUÍDO: exit 0".
Do lado STOP, um cartão "LAST_ASSISTANT_MESSAGE" com duas operações encadeadas em chips:
  "primeira linha" e "120 caracteres", terminando em "Terminei: ...".
Barra de rodapé: "Aprovação é urgente; auth_success não deveria te interromper nunca."

Upload: gerar os 4 e subir para o container imagens-blog, em posts/2026/claude-notif/
  capa.png, 1.png, 2.png, 3.png

*/
