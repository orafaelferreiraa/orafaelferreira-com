import { describe, expect, it } from "vitest";
import { getArticleTags, getAvailableTags, tagFromSlug, tagToSlug } from "./article-tags";

type Input = Parameters<typeof getArticleTags>[0];

const make = (overrides: Partial<Input> = {}): Input => ({
  title: "",
  excerpt: "",
  category: "Artigos",
  ...overrides,
});

describe("getArticleTags", () => {
  it("deriva tags a partir do título, excerpt e categoria", () => {
    expect(getArticleTags(make({ title: "Terraform na prática" }))).toContain("Terraform");
    expect(getArticleTags(make({ excerpt: "usando Kubernetes" }))).toContain("Kubernetes");
  });

  it("mantém tags declaradas que não existem em TOPIC_RULES, no fim da lista", () => {
    const tags = getArticleTags(make({ title: "Um artigo", tags: ["Microsoft Foundry"] }));
    expect(tags).toContain("Microsoft Foundry");
    expect(tags[tags.length - 1]).toBe("Microsoft Foundry");
  });

  it("aplica tags-pai: Docker implica DevOps", () => {
    const tags = getArticleTags(make({ title: "Dois anos de Docker" }));
    expect(tags).toEqual(expect.arrayContaining(["Docker", "DevOps"]));
  });

  it("resolve tags-pai transitivamente: GitOps -> CI/CD -> DevOps", () => {
    const tags = getArticleTags(make({ title: "GitOps com Argo CD" }));
    expect(tags).toEqual(expect.arrayContaining(["GitOps", "CI/CD", "DevOps"]));
  });

  it("trata IaC como sinônimo de Terraform, sem criar tag própria", () => {
    const tags = getArticleTags(make({ title: "Infraestrutura como código na prática" }));
    expect(tags).toContain("Terraform");
    expect(tags).not.toContain("IaC");
  });

  it("classifica Azure Policy como Governança, e só herda Segurança", () => {
    const tags = getArticleTags(make({ title: "O que é Azure Policy?" }));
    expect(tags).toContain("Governança");
    expect(tags).toContain("Segurança");
  });

  it("não confunde o verbo 'ia' em português com a tag IA", () => {
    expect(getArticleTags(make({ excerpt: "o backup ia falhar toda noite" }))).not.toContain("IA");
    expect(getArticleTags(make({ title: "Explorando a IA Generativa" }))).toContain("IA");
  });

  it("excludeTags remove tanto a tag derivada quanto a herdada", () => {
    const withImplied = getArticleTags(make({ title: "Docker" }));
    expect(withImplied).toContain("DevOps");

    const excluded = getArticleTags(make({ title: "Docker", excludeTags: ["DevOps"] }));
    expect(excluded).not.toContain("DevOps");
    expect(excluded).toContain("Docker");
  });

  it("não duplica tags quando derivada e declarada coincidem", () => {
    const tags = getArticleTags(make({ title: "Docker", tags: ["Docker"] }));
    expect(tags.filter((tag) => tag === "Docker")).toHaveLength(1);
  });
});

describe("tagToSlug / tagFromSlug", () => {
  const cases: Array<[string, string]> = [
    ["Certificações", "certificacoes"],
    ["GitHub Actions", "github-actions"],
    ["Segurança", "seguranca"],
    ["CI/CD", "ci-cd"],
    ["Platform Engineering", "platform-engineering"],
    ["Migração", "migracao"],
  ];

  it.each(cases)("%s vira %s", (label, slug) => {
    expect(tagToSlug(label)).toBe(slug);
  });

  it("volta do slug para o label dentro das tags disponíveis", () => {
    const available = cases.map(([label]) => label);
    for (const [label, slug] of cases) {
      expect(tagFromSlug(slug, available)).toBe(label);
    }
  });

  it("devolve null para slug desconhecido", () => {
    expect(tagFromSlug("nao-existe", ["Docker"])).toBeNull();
  });
});

describe("getAvailableTags", () => {
  const list = [
    make({ title: "Docker na prática" }),
    make({ title: "Terraform na prática" }),
    make({ title: "Docker e Kubernetes" }),
  ];

  it("reúne as tags de toda a lista, sem repetir", () => {
    const tags = getAvailableTags(list);
    expect(tags).toEqual(expect.arrayContaining(["Docker", "Terraform", "Kubernetes", "DevOps"]));
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("inclui tags herdadas que nenhum artigo declara", () => {
    // Nenhum título diz "DevOps" nem "Cloud Native": vêm das tags-pai.
    expect(getAvailableTags(list)).toEqual(expect.arrayContaining(["DevOps", "Cloud Native"]));
  });

  it("segue a ordem canônica de TOPIC_RULES", () => {
    const tags = getAvailableTags(list);
    expect(tags.indexOf("Kubernetes")).toBeLessThan(tags.indexOf("Docker"));
  });
});
