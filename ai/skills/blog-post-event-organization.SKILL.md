# SKILL: Blog Post de Organização de Eventos

## Quando usar

- Escrever um post sobre organizar meetup, conferência, comunidade ou evento presencial
- Registrar bastidores, planejamento, execucao e aprendizados de organizacao

## Objetivo

Gerar um post util para quem quer entender como o evento foi planejado, executado e melhorado, com foco operacional e de comunidade.

## Embedded Resources (carregar antes de escrever)

- `ai/skills/article-authoring-site-context.SKILL.md` — base editorial do site
- `src/data/articles/types.ts` — interface `Article`
- `src/lib/markdown.ts` — markdown suportado
- `src/components/Talks.tsx` — exemplos de posts com contexto de evento e comunidade

## Regras editoriais

- Priorizar a narrativa de organizacao, nao a autopromocao
- Explicar o que precisava ser coordenado: local, agenda, speakers, inscricoes, divulgação, suporte e follow-up
- Registrar desafios reais, trade-offs e o que foi feito para evitar falhas
- Se houver relacao com uma palestra sua, manter essa conexao como parte do contexto, nao como foco unico
- Inserir links oficiais inline na primeira citacao de tecnologias/ferramentas/protocolos mencionados no post
- Se o evento existir em `src/components/Talks.tsx`, reutilizar a mesma `image` e `slidesUrl` quando houver
- Incluir uma secao explicita de agenda em todo post de evento com titulo da sessao, nome do palestrante e resumo curto de cada conteudo
- Quando houver links sociais dos palestrantes (ex.: LinkedIn), incluir os links em markdown ao lado de cada nome

## Sincronizacao obrigatoria com Talks

Quando o evento organizado tiver entrada correspondente em `src/components/Talks.tsx`:

1. Reutilizar `Talks.image` como capa do post em metadata (preferir `badges[0].image`).
2. Se existir `Talks.slidesUrl`, incluir `## Slides` com o mesmo link.
3. Se existir `Talks.repositories`, preservar labels/URLs em `## Repositorios`.
4. Nunca criar links de slides/repositorios fora do que esta em Talks.

## Estrutura recomendada

1. Contexto do evento e objetivo da organizacao
2. O papel desempenhado pelo autor
3. Planejamento: prazos, parceiros, local, orcamento e comunicacao
4. Execucao: credenciamento, timing, suporte aos palestrantes, contingencias
5. Resultado e impacto para a comunidade
6. O que funcionou, o que nao funcionou e o que melhorar na proxima edicao
7. Proximos passos ou chamada para participar da comunidade

## Completion Hints

| campo | orientacao |
|-------|------------|
| category | prefira `Organização de Eventos` ou `Organizador Grupo de Comunidade` |
| excerpt | destaque o tipo de evento, o desafio principal e o aprendizado mais util |
| tags | use para marcar comunidade, meetup, evento, speaker, organizacao, etc. |

## Qualidade final

- Linguagem pratica e direta
- Bastidores claros sem detalhes desnecessarios
- Aprendizados acionaveis para futuros organizadores
- Estrutura leve, mas rica em contexto
- Referencias oficiais aplicadas inline nas citacoes tecnicas
- Secao de agenda presente no corpo do post
- Capa e slides alinhados com `src/components/Talks.tsx` quando disponiveis