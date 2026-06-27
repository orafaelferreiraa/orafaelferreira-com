# SKILL: Article Authoring (Site Context)

## Quando usar

- Criar um novo arquivo de artigo em `src/data/articles/`
- Refatorar artigo existente mantendo padrao do site
- Criar posts longos de blog quando o formato for o padrao editorial do site

## Quando nao usar

- Posts baseados em palestra com estrutura fixa de links, slides e repositorios
- Posts sobre organizacao de eventos com foco operacional e bastidores

## Objetivo

Gerar artigos no formato exato da interface `Article` e com markdown compativel com o parser interno.

## Embedded Resources (carregar antes de escrever)

- `src/data/articles/types.ts` — interface Article completa
- `src/lib/markdown.ts` — parser markdown (define o que e suportado)
- `src/hooks/use-article-meta-tags.ts` — como metadados viram OG tags

## Regras de estrutura

- Exportar `export const article: Article = { ... }`
- Campos obrigatorios: slug, title, excerpt, content, date, category, readTime
- Campos opcionais: image (URL OG), badges (array de Badge)
- Campos opcionais extras do tipo `Article`: tags e excludeTags quando for preciso forcar ou remover topicos
- Conteudo em template string (backtick)
- Para artigos tecnicos, preferir `src/data/articles/artigos/*.ts`
- Para posts e registros, preferir `src/data/articles/blog-posts/*.ts`

## Completion Hints (valores validos)

| campo | valores aceitos | exemplo |
| category | `Artigos`, `Posts`, `Palestras`, `Registro Eventos Presenciais`, `Organização de Eventos`, `Organizador Grupo de Comunidade`, `Certificações` | `Artigos` |
|-------|----------------|--------|
| category | "Artigos", "Registro Eventos Presenciais", "Certificacoes" | "Artigos" |
| category (posts) | "Posts", "Registro Eventos Presenciais", "Organização de Eventos", "Organizador Grupo de Comunidade" | "Posts" |
| readTime | formato "N min de leitura" ou "N-M min de leitura" | "8 min de leitura" |
| date | formato ISO "AAAA-MM-DD" | "2026-04-18" |
| slug | kebab-case, sem acentos, sem espacos | "docker-python-distroless-kubernetes" |

## Regras de conteudo

- Linguagem: portugues claro e direto
- Forte foco em pratica real, sem marketing vazio
- Explicar contexto, decisoes tecnicas e trade-offs
- Encerrar com aprendizado e proximos passos
- Se o texto nascer de uma palestra, manter o titulo oficial da palestra como titulo do post
- Se houver dados de evento ou comunidade, manter os links e referencias como parte do conteudo e nao apenas em metadata
- Sempre incluir links oficiais para todo protocolo, ferramenta, produto, CLI ou especificacao citada no artigo
- Inserir links oficiais inline na primeira mencao de cada tecnologia/ferramenta/protocolo no corpo do texto (evitar concentrar tudo no fim)
- Priorizar sempre fonte primaria (docs oficiais do vendor, site oficial da especificacao, repositorio oficial no GitHub)
- Para posts de palestra/evento com entrada correspondente em `src/components/Talks.tsx`, sincronizar sempre capa (`image`/`badges`) e link de slides com Talks
- Para novos arquivos em `src/data/articles/blog-posts/`, incluir sempre secao de agenda no corpo (`## Agenda` ou `## Agenda do evento`) com titulo do conteudo/sessao, palestrante e resumo curto

## Compatibilidade markdown do projeto

O parser em `src/lib/markdown.ts` suporta:
- Titulos: `#`, `##`, `###`, `####`
- Negrito: `**texto**`
- Italico: `*texto*`
- Listas: `- item` ou `* item`
- Links: `[texto](url)` (externos abrem em nova aba)
- Imagens: `![alt](url)` (com lazy loading e shadow)
- Tabelas: formato pipe com header/separator/rows
- Blocos de codigo: ` ```lang ... ``` ` (com botao copiar)
- Codigo inline: `` `codigo` ``

**Nao suportado pelo parser:**
- Footnotes
- Checkboxes
- HTML arbitrario (exceto `<i>` para icones FontAwesome)

## Qualidade final

- Slug legivel e consistente com kebab-case
- Excerpt util para SEO (1-2 frases que resumem valor do artigo)
- Leitura fluida e secoes bem separadas
- Links oficiais presentes para tecnologias/protocolos citados
- Links oficiais aplicados inline na primeira citacao tecnica de ferramentas/protocolos/docs
- Em blog posts, secao de agenda presente no corpo
- Sem afirmacoes tecnicas sem evidencia
- Nome do arquivo: `AAAA-MM-DD-slug.ts` (data da publicacao)
- Em posts de palestra/evento, capa e slides devem vir de `src/components/Talks.tsx`

## Secoes recomendadas por tipo

- Artigo tecnico: contexto -> problema -> solucao -> codigo -> trade-offs -> conclusao
- Post de comunidade: contexto -> por que participei -> o que aprendi -> impacto -> proximos passos
