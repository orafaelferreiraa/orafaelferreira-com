import type { Article } from "@/data/articles/types";

/**
 * Deriva tags de tópico (Azure, Docker, Kubernetes, etc.) a partir dos metadados
 * dos artigos. Cada artigo pode declarar `tags` (tópicos forçados) e `excludeTags`
 * (tópicos a remover); o restante é inferido por palavras-chave no título, excerpt
 * e categoria. O corpo (`content`) não é analisado — quando o tema só aparece lá,
 * declare-o em `tags`.
 *
 * Cada regra define um label visível e os padrões que identificam o tópico.
 * A ordem do array define a ordem de exibição das tags.
 */
interface TopicRule {
  label: string;
  patterns: RegExp[];
}

const TOPIC_RULES: TopicRule[] = [
  { label: "Azure", patterns: [/azure/i, /\bswa\b/i, /static web app/i, /app service/i, /bicep/i] },
  { label: "Kubernetes", patterns: [/kubernetes/i, /\baks\b/i, /\bk8s\b/i, /\bcka\b/i, /kubectl/i] },
  { label: "Docker", patterns: [/docker/i, /cont[eê]iner/i, /container/i, /distroless/i, /\bacr\b/i, /artifact cache/i] },
  // IaC não é tag própria: na prática, aqui, é sinônimo de Terraform.
  { label: "Terraform", patterns: [/terraform/i, /terragrunt/i, /\biac\b/i, /infra as code/i, /infrastructure as code/i, /infraestrutura como c[oó]digo/i] },
  { label: "GitHub Actions", patterns: [/github actions/i] },
  { label: "CI/CD", patterns: [/ci\/cd/i, /\bcicd\b/i, /pipelines?\b/i] },
  { label: "GitOps", patterns: [/gitops/i, /argo\s?cd/i, /flux\s?cd/i, /\bhelm\b/i] },
  { label: "DevOps", patterns: [/devops/i] },
  { label: "Platform Engineering", patterns: [/platform engineering/i, /plataformiza/i, /self-service/i, /backstage/i] },
  { label: "Cloud Native", patterns: [/cloud native/i, /\bcncf\b/i, /nativo (da|de) nuvem/i] },
  { label: "Cloud Foundation", patterns: [/cloud foundation/i, /foundation cloud/i, /funda[çc][ãa]o s[óo]lida/i, /funda[çc][ãa]o para a nuvem/i, /landing zone/i] },
  { label: "Redes", patterns: [/\bvnet\b/i, /private (endpoint|link|dns)/i, /hub[- ](and[- ])?spoke/i, /azure firewall/i, /virtual wan/i, /\bnsg\b/i, /front door/i, /application gateway/i] },
  { label: "Governança", patterns: [/azure policy/i, /policy[- ]as[- ]code/i, /kyverno/i, /gatekeeper/i, /\brbac\b/i, /compliance/i, /governan[çc]a/i, /guardrail/i] },
  { label: "Segurança", patterns: [/seguran[çc]a/i, /security/i, /devsecops/i, /hardening/i] },
  { label: "Observabilidade", patterns: [/observabilidade/i, /monitora/i, /monitoria/i, /workbooks/i, /prometheus/i, /grafana/i, /thanos/i, /loki/i, /opentelemetry/i, /\botel\b/i, /alertmanager/i] },
  { label: "FinOps", patterns: [/finops/i] },
  { label: "GreenOps", patterns: [/greenops/i, /sustentab/i] },
  { label: "Serverless", patterns: [/serverless/i, /sem servidor/i, /azure functions/i, /function app/i, /logic app/i] },
  // Case-sensitive de propósito: /\bia\b/i casaria com o verbo "ia" em português.
  { label: "IA", patterns: [/\bIA\b/, /intelig[êe]ncia artificial/i, /\bLLM\b/, /vibe coding/i, /\bagentes?\b/i] },
  { label: "MCP", patterns: [/\bMCP\b/, /model context protocol/i] },
  { label: "GitHub Copilot", patterns: [/copilot/i] },
  { label: "Open Source", patterns: [/open source/i, /c[óo]digo aberto/i, /contribui[çc]/i, /upstream/i, /sig docs/i, /pull request/i] },
  { label: "Comunidade", patterns: [/comunidade/i, /meetup/i, /\bkcd\b/i, /user group/i, /devopsdays/i, /organizador/i, /\btdc\b/i, /global azure/i] },
  { label: "Carreira", patterns: [/carreira/i, /exterior/i, /mentoria/i, /trabalhar para/i] },
  { label: "Certificações", patterns: [/certifica/i, /\baz-\d{3}\b/i, /\bdp-\d{3}\b/i] },
];

const ORDER = TOPIC_RULES.map((rule) => rule.label);
const ORDER_SET = new Set(ORDER);

/**
 * Tags-pai: um artigo marcado como `Docker` também conta como `DevOps`, sem
 * precisar declarar isso em cada arquivo. É o que faz um filtro por `DevOps`
 * alcançar os artigos de Docker/Terraform/Kubernetes que nunca escrevem a
 * palavra "DevOps".
 */
export const TAG_IMPLIES: Record<string, string[]> = {
  Docker: ["DevOps"],
  Kubernetes: ["Cloud Native", "DevOps"],
  Terraform: ["DevOps"],
  "GitHub Actions": ["CI/CD"],
  GitOps: ["CI/CD", "Cloud Native"],
  "CI/CD": ["DevOps"],
  "Platform Engineering": ["DevOps"],
  "Cloud Native": ["DevOps"],
  Observabilidade: ["DevOps"],
  Governança: ["Segurança"],
  MCP: ["IA"],
  "GitHub Copilot": ["IA"],
};

/** Fecho transitivo de {@link TAG_IMPLIES}. Seguro contra ciclos. */
function expandImplied(labels: Iterable<string>): Set<string> {
  const resolved = new Set<string>(labels);
  const pending = [...resolved];
  while (pending.length > 0) {
    const current = pending.pop() as string;
    for (const parent of TAG_IMPLIES[current] ?? []) {
      if (!resolved.has(parent)) {
        resolved.add(parent);
        pending.push(parent);
      }
    }
  }
  return resolved;
}

export type ArticleTagInput = Pick<Article, "title" | "excerpt" | "category" | "tags" | "excludeTags">;

/** Ordena pelas tags conhecidas e joga as declaradas fora de TOPIC_RULES no fim. */
function sortTags(present: Set<string>): string[] {
  const known = ORDER.filter((label) => present.has(label));
  const unknown = [...present]
    .filter((label) => !ORDER_SET.has(label))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  return [...known, ...unknown];
}

// Os artigos são objetos estáticos de módulo, então o resultado nunca muda. Vale
// cachear: a listagem chama isto para os temas disponíveis e para o filtro, nas
// duas abas, a cada tecla digitada na busca.
const tagCache = new WeakMap<object, string[]>();

/** Retorna as tags de tópico de um artigo, na ordem canônica. */
export function getArticleTags(article: ArticleTagInput): string[] {
  const cached = tagCache.get(article);
  if (cached) return cached;

  const haystack = `${article.title} ${article.excerpt} ${article.category}`;
  const derived = TOPIC_RULES.filter((rule) => rule.patterns.some((pattern) => pattern.test(haystack))).map(
    (rule) => rule.label,
  );
  const excluded = new Set(article.excludeTags ?? []);
  const declared = [...derived, ...(article.tags ?? [])].filter((label) => !excluded.has(label));
  const present = expandImplied(declared);
  // excludeTags também vale para as tags herdadas.
  for (const label of excluded) present.delete(label);

  const tags = sortTags(present);
  tagCache.set(article, tags);
  return tags;
}

/** Retorna as tags únicas presentes em uma lista de artigos, ordenadas. */
export function getAvailableTags(articles: ArticleTagInput[]): string[] {
  const present = new Set<string>();
  for (const article of articles) {
    for (const tag of getArticleTags(article)) {
      present.add(tag);
    }
  }
  return sortTags(present);
}

/** "Certificações" -> "certificacoes", "CI/CD" -> "ci-cd". Usado no parâmetro `?tema=`. */
export function tagToSlug(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve um slug de volta para o label exibível, dentro das tags disponíveis. */
export function tagFromSlug(slug: string, availableTags: string[]): string | null {
  const needle = tagToSlug(slug);
  return availableTags.find((tag) => tagToSlug(tag) === needle) ?? null;
}

/** Todas as tags que o site conhece, na ordem canônica. */
export function getAllKnownTags(): string[] {
  return [...ORDER];
}
