import type { Article } from "@/data/articles/types";

/**
 * Deriva tags de tópico (Azure, Docker, Kubernetes, etc.) a partir do conteúdo
 * dos artigos. Como a estrutura de dados não possui um campo `tags` próprio,
 * as tags são inferidas por palavras-chave no título, excerpt e categoria.
 *
 * Cada regra define um label visível e os padrões que identificam o tópico.
 * A ordem do array define a ordem de exibição das tags.
 */
interface TopicRule {
  label: string;
  patterns: RegExp[];
}

const TOPIC_RULES: TopicRule[] = [
  { label: "Azure", patterns: [/azure/i, /\bswa\b/i, /static web app/i, /bicep/i, /app service/i, /application gateway/i] },
  { label: "Kubernetes", patterns: [/kubernetes/i, /\baks\b/i, /\bk8s\b/i, /\bcka\b/i, /kubectl/i] },
  { label: "Docker", patterns: [/docker/i, /cont[eê]iner/i, /container/i, /distroless/i, /\bacr\b/i, /artifact cache/i] },
  { label: "Terraform", patterns: [/terraform/i, /\biac\b/i, /infra as code/i, /infraestrutura como c[oó]digo/i] },
  { label: "Azure DevOps", patterns: [/azure devops/i, /azure repos/i, /azure pipelines/i] },
  { label: "GitHub Actions", patterns: [/github actions/i, /ci\/cd/i, /\bcicd\b/i] },
  { label: "DevOps", patterns: [/devops/i] },
  { label: "FinOps", patterns: [/finops/i] },
  { label: "GreenOps", patterns: [/greenops/i, /sustentab/i] },
  { label: "Cloud Foundation", patterns: [/cloud foundation/i, /foundation cloud/i, /funda[çc][ãa]o s[óo]lida/i, /funda[çc][ãa]o para a nuvem/i, /landing zone/i] },
  { label: "Platform Engineering", patterns: [/platform engineering/i, /plataforma/i, /self-service/i, /policy-as-code/i, /policy as code/i] },
  { label: "Segurança", patterns: [/seguran[çc]a/i, /security/i, /devsecops/i, /\bpolicy\b/i] },
  { label: "IA", patterns: [/\bia\b/i, /copilot/i, /intelig[êe]ncia artificial/i, /\bagentes?\b/i, /vibe coding/i] },
  { label: "Carreira", patterns: [/carreira/i, /exterior/i, /mentoria/i, /trabalhar para/i] },
  { label: "Certificações", patterns: [/certifica/i, /\baz-\d{3}\b/i] },
  { label: "Observabilidade", patterns: [/observabilidade/i, /monitora/i, /workbooks/i, /prometheus/i, /grafana/i] },
];

const ORDER = TOPIC_RULES.map((rule) => rule.label);

/** Retorna as tags de tópico de um artigo, na ordem canônica. */
export function getArticleTags(
  article: Pick<Article, "title" | "excerpt" | "category" | "tags" | "excludeTags">,
): string[] {
  const haystack = `${article.title} ${article.excerpt} ${article.category}`;
  const derived = TOPIC_RULES.filter((rule) => rule.patterns.some((pattern) => pattern.test(haystack))).map(
    (rule) => rule.label,
  );
  const excluded = new Set(article.excludeTags ?? []);
  const present = new Set([...derived, ...(article.tags ?? [])].filter((label) => !excluded.has(label)));
  return ORDER.filter((label) => present.has(label));
}

/** Retorna as tags únicas presentes em uma lista de artigos, ordenadas. */
export function getAvailableTags(
  articles: Pick<Article, "title" | "excerpt" | "category" | "tags" | "excludeTags">[],
): string[] {
  const present = new Set<string>();
  for (const article of articles) {
    for (const tag of getArticleTags(article)) {
      present.add(tag);
    }
  }
  return ORDER.filter((label) => present.has(label));
}
