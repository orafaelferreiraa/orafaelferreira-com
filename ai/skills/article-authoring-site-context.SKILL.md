# SKILL: Article Authoring (Site Context)

## Quando usar

- Criar um novo arquivo de artigo em `src/data/articles/`
- Refatorar artigo existente mantendo padrao do site

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
- Conteudo em template string (backtick)

## Completion Hints (valores validos)

| campo | valores aceitos | exemplo |
|-------|----------------|--------|
| category | "Artigos", "Registro Eventos Presenciais", "Certificacoes" | "Artigos" |
| readTime | formato "N min de leitura" ou "N-M min de leitura" | "8 min de leitura" |
| date | formato ISO "AAAA-MM-DD" | "2026-04-18" |
| slug | kebab-case, sem acentos, sem espacos | "docker-python-distroless-kubernetes" |

## Regras de conteudo

- Linguagem: portugues claro e direto
- Forte foco em pratica real, sem marketing vazio
- Explicar contexto, decisoes tecnicas e trade-offs
- Encerrar com aprendizado e proximos passos

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
- Sem afirmacoes tecnicas sem evidencia
- Nome do arquivo: `AAAA-MM-DD-slug.ts` (data da publicacao)
