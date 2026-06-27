# SKILL: Blog Post de Palestra

## Quando usar

- Transformar uma palestra, talk ou workshop em post para o blog
- Publicar anuncio, registro ou recap de apresentacao

## Objetivo

Gerar um post de palestra com narrativa clara, titulo oficial preservado e estrutura de links igual ao template antigo do site.

## Embedded Resources (carregar antes de escrever)

- `ai/skills/article-authoring-site-context.SKILL.md` — base editorial do site
- `src/data/articles/types.ts` — interface `Article`
- `src/lib/markdown.ts` — markdown suportado
- `src/components/Talks.tsx` — fonte do padrao de palestras, links e repositorios

## Regras editoriais

- O titulo do post deve ser exatamente o titulo da palestra
- Se o post for baseado em uma talk futura ou anunciada, manter tom de convite e contexto
- Se for recap, abrir com o evento, a audiencia e a tese central da palestra
- Sempre preservar o nome oficial do evento e a cidade quando existirem
- Nunca inventar repositorio, slides ou link social se eles nao existirem
- Incluir links oficiais inline na primeira mencao de cada tecnologia/ferramenta/protocolo citado no texto
- Se a palestra existir em `src/components/Talks.tsx`, reutilizar exatamente a mesma `image` e `slidesUrl`

## Sincronizacao obrigatoria com Talks

Antes de escrever ou atualizar um post de palestra:

1. Localizar a entrada correspondente em `src/components/Talks.tsx` (titulo/evento/data).
2. Reutilizar a capa do evento em metadata, preferindo:
	- `badges: [{ image: "<Talks.image>" }]` para consistencia no card, ou
	- `image: "<Talks.image>"` como fallback OG.
3. Em `## Slides`, usar exatamente o link de `Talks.slidesUrl`.
4. Se houver `Talks.repositories`, espelhar labels e URLs em `## Repositorios`.
5. Se nao houver slides em Talks, omitir `## Slides`.
6. Garantir que o corpo do post tenha links em markdown para:
	- pagina oficial do evento (`Talks.siteUrl`)
	- LinkedIn da talk quando existir (`Talks.linkedinUrl`), usando o rotulo legado (ex.: `LinkedIn Post Divulgação evento` ou `Post Linkedin`)
7. Garantir que `Talks.blogUrl` aponte para o post publicado (`https://www.orafaelferreira.com/artigos/<slug>`).

## Estrutura recomendada

1. Abertura curta com contexto da palestra
2. Motivo da talk e problema que ela aborda
3. Secao de links do evento e da publicacao social
4. Secao `## Agenda` (ou `## Agenda do evento`) com titulo da sessao, palestrante e resumo curto
5. Secao `## Slides` com um link nomeado
6. Secao `## Repositorios` com um link nomeado quando houver repo
7. Aprendizados, demo ou insights principais
8. Fechamento com agradecimento e proximos passos

## Padrao antigo que deve ser preservado

- Links para Meetup, site do evento ou LinkedIn devem continuar em markdown
- A secao de Slides deve ter um link nomeado, nao um URL solto
- A secao de Repositorios deve listar um ou mais links nomeados
- Se nao houver repositorio, omitir a secao em vez de preencher com placeholder
- Manter o link cruzado: Talks aponta para o post via `blogUrl` e o post aponta para o evento.

## Completion Hints

| campo | orientacao |
|-------|------------|
| category | prefira `Posts` para anuncio/recap, ou `Registro Eventos Presenciais` quando o foco for a presenca no evento |
| excerpt | 1-2 frases com a tese da palestra e o valor para quem leu |
| tags | use para destacar temas principais como Azure, DevOps, IA, Cloud Foundation, Seguranca |

## Qualidade final

- Titulo oficial da palestra sem adaptações artificiais
- Links coerentes com o texto
- Referencias oficiais aplicadas inline nas citacoes tecnicas
- Secao de agenda presente no corpo do post
- Capa e slides sincronizados com `src/components/Talks.tsx`
- Tom humano, objetivo e tecnico
- Sem exagero promocional