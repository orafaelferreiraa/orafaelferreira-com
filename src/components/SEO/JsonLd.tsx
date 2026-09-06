import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders JSON-LD structured data in the <head> for SEO and GEO (Generative Engine Optimization).
 * Accepts a single schema object or an array of schemas.
 */
const JsonLd = ({ data }: JsonLdProps) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default JsonLd;

// --- Reusable schema builders ---

const SITE_URL = "https://www.orafaelferreira.com";
const PERSON_NAME = "Rafael Martin Alves Ferreira";
const PERSON_SHORT = "Rafael Ferreira";
const PERSON_ID = `${SITE_URL}/#person`;

export const personSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  alternateName: [PERSON_SHORT, "orafaelferreira", "Rafael Martin"],
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-image.jpg`,
    width: 1200,
    height: 630,
  },
  jobTitle: "Cloud & DevOps Specialist",
  description:
    "Brazilian Platform Engineer and Cloud & DevOps specialist with over 10 years of experience. Microsoft MVP Azure, MCT, DevOps Institute Ambassador, Alura Star, Green Software Champion and Platform Engineering Ambassador. Specialized in Azure, Terraform, Kubernetes, FinOps, and Platform Engineering.",
  nationality: {
    "@type": "Country",
    name: "Brazil",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florianópolis",
    addressRegion: "Santa Catarina",
    addressCountry: "BR",
  },
  sameAs: [
    "https://www.linkedin.com/in/orafaelferreiraa/",
    "https://github.com/orafaelferreiraa",
    "https://www.youtube.com/@LowOps",
    "https://www.instagram.com/orafaelferreira1/",
    "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj",
    "https://mvp.microsoft.com/en-us/PublicProfile/5005188",
  ],
  knowsAbout: [
    {
      "@type": "Thing",
      name: "Microsoft Azure",
      description: "Cloud computing platform by Microsoft",
    },
    {
      "@type": "Thing",
      name: "DevOps",
      description: "Set of practices combining software development and IT operations",
    },
    {
      "@type": "Thing",
      name: "Platform Engineering",
      description: "Discipline focused on building internal developer platforms",
    },
    {
      "@type": "Thing",
      name: "FinOps",
      description: "Cloud financial management and cost optimization",
    },
    {
      "@type": "Thing",
      name: "Terraform",
      description: "Infrastructure as Code tool by HashiCorp",
    },
    {
      "@type": "Thing",
      name: "Kubernetes",
      description: "Container orchestration platform",
    },
    {
      "@type": "Thing",
      name: "Cloud Architecture",
      description: "Design of cloud-based systems and infrastructure",
    },
    {
      "@type": "Thing",
      name: "Observability",
      description: "Monitoring, logging and tracing for distributed systems",
    },
    {
      "@type": "Thing",
      name: "CI/CD",
      description: "Continuous Integration and Continuous Delivery pipelines",
    },
    {
      "@type": "Thing",
      name: "GitOps",
      description: "Git-based operational practices for cloud-native deployments",
    },
    {
      "@type": "Thing",
      name: "Azure Kubernetes Service",
      description: "Managed Kubernetes service on Microsoft Azure",
    },
    {
      "@type": "Thing",
      name: "Infrastructure as Code",
      description: "Managing and provisioning infrastructure through code",
    },
    {
      "@type": "Thing",
      name: "Kyverno",
      description: "Kubernetes-native policy engine for admission control",
    },
    {
      "@type": "Thing",
      name: "OPA Gatekeeper",
      description: "Open Policy Agent-based admission controller for Kubernetes",
    },
    {
      "@type": "Thing",
      name: "cert-manager",
      description: "Automated X.509 certificate management for Kubernetes",
    },
    {
      "@type": "Thing",
      name: "KEDA",
      description: "Kubernetes Event-driven Autoscaling",
    },
    {
      "@type": "Thing",
      name: "Envoy Gateway",
      description: "Gateway API implementation powered by Envoy Proxy",
    },
    {
      "@type": "Thing",
      name: "Trivy",
      description: "Vulnerability and misconfiguration scanner for containers and IaC",
    },
    {
      "@type": "Thing",
      name: "OpenTelemetry",
      description: "Observability framework for distributed tracing and instrumentation",
    },
    {
      "@type": "Thing",
      name: "Thanos",
      description: "Highly available Prometheus setup with long-term storage",
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Microsoft MVP Azure",
      credentialCategory: "award",
      recognizedBy: {
        "@type": "Organization",
        name: "Microsoft",
        url: "https://www.microsoft.com",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "MCT — Microsoft Certified Trainer",
      credentialCategory: "certification",
      recognizedBy: {
        "@type": "Organization",
        name: "Microsoft",
        url: "https://www.microsoft.com",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "DevOps Institute Ambassador",
      credentialCategory: "award",
      recognizedBy: {
        "@type": "Organization",
        name: "DevOps Institute",
        url: "https://www.devopsinstitute.com",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Green Software Champion",
      credentialCategory: "award",
      recognizedBy: {
        "@type": "Organization",
        name: "Green Software Foundation",
        url: "https://greensoftware.foundation",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Platform Engineering Ambassador",
      credentialCategory: "award",
      recognizedBy: {
        "@type": "Organization",
        name: "PlatformEngineering.org",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Alura Star",
      credentialCategory: "award",
      recognizedBy: {
        "@type": "Organization",
        name: "Alura",
        url: "https://www.alura.com.br",
      },
    },
  ],
  memberOf: [
    {
      "@type": "Organization",
      name: "CNCF — Cloud Native Computing Foundation",
      url: "https://www.cncf.io",
    },
    {
      "@type": "Organization",
      name: "Azure Floripa Community",
    },
    {
      "@type": "Organization",
      name: "CNCF SC",
    },
  ],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${PERSON_SHORT} | Cloud & DevOps Specialist`,
  url: SITE_URL,
  inLanguage: ["pt-BR", "en"],
  author: { "@type": "Person", name: PERSON_NAME },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const articleSchema = (article: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category: string;
  image?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  url: `${SITE_URL}/artigos/${article.slug}`,
  datePublished: article.date,
  author: {
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/artigos/${article.slug}`,
  },
  articleSection: article.category,
  inLanguage: "pt-BR",
  ...(article.image && {
    image: {
      "@type": "ImageObject",
      url: article.image,
      width: 1200,
      height: 630,
    },
  }),
});

export const collectionPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: page.name,
  description: page.description,
  url: page.url,
  author: { "@type": "Person", name: PERSON_NAME, url: SITE_URL },
  inLanguage: ["pt-BR", "en"],
});

export const profilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  name: `${PERSON_NAME} — Cloud & DevOps Specialist`,
  description:
    "Perfil de Rafael Martin Alves Ferreira: Microsoft MVP Azure, MCT, Platform Engineer especializado em Azure, DevOps, FinOps e Kubernetes. Mentor, palestrante e criador de conteúdo técnico.",
  url: SITE_URL,
  inLanguage: ["pt-BR", "en"],
  dateCreated: "2023-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  mainEntity: {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON_NAME,
    alternateName: ["Rafael Ferreira", "orafaelferreira"],
    description:
      "Platform Engineer e especialista em Cloud Azure & DevOps. Microsoft MVP Azure, MCT, DevOps Institute Ambassador, Alura Star, Green Software Champion e Platform Engineering Ambassador.",
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
    },
    sameAs: [
      "https://www.linkedin.com/in/orafaelferreiraa/",
      "https://github.com/orafaelferreiraa",
      "https://www.youtube.com/@LowOps",
    ],
    agentInteractionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WriteAction",
      userInteractionCount: 25,
    },
  },
  hasPart: [
    {
      "@type": "Article",
      headline: "Explorando IA Generativa no Azure",
      url: `${SITE_URL}/artigos/2023-10-27-explorando-ia-generativa`,
      datePublished: "2023-10-27",
      author: { "@id": PERSON_ID },
    },
    {
      "@type": "Article",
      headline: "Prometheus no AKS: Observabilidade no Azure Kubernetes Service",
      url: `${SITE_URL}/artigos/2023-08-14-artigo-prometheus`,
      datePublished: "2023-08-14",
      author: { "@id": PERSON_ID },
    },
    {
      "@type": "Article",
      headline: "AKS + ACR: Integração e Deploy no Azure",
      url: `${SITE_URL}/artigos/2023-02-05-artigo-aks-acr`,
      datePublished: "2023-02-05",
      author: { "@id": PERSON_ID },
    },
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", "#about p", "#hero p"],
  },
});

export const faqSchema = (lang: "pt-BR" | "en" = "pt-BR") => {
  const faqs =
    lang === "en"
      ? [
          {
            q: "Who is Rafael Ferreira?",
            a: "Rafael Martin Alves Ferreira is a Brazilian Platform Engineer and Cloud & DevOps specialist with over 10 years of experience. He is a Microsoft MVP Azure, MCT (Microsoft Certified Trainer), DevOps Institute Ambassador, Alura Star, Green Software Champion, and Platform Engineering Ambassador.",
          },
          {
            q: "What does Rafael Ferreira specialize in?",
            a: "Rafael specializes in Microsoft Azure, Platform Engineering, DevOps, FinOps (cloud cost optimization), Infrastructure as Code (Terraform and Bicep), AKS, CI/CD pipelines with GitHub Actions and Azure DevOps, and Observability with Prometheus and Grafana.",
          },
          {
            q: "Is Rafael Ferreira a Microsoft MVP?",
            a: "Yes. Rafael Ferreira is a Microsoft MVP (Most Valuable Professional) in the Azure category — Compute Infrastructure. The MVP Award recognizes technology professionals who actively share their knowledge with the community.",
          },
          {
            q: "Does Rafael Ferreira offer mentorship?",
            a: "Yes. Rafael offers 1:1 Cloud Azure and DevOps mentorship sessions (1h–1h30) with a pre-session diagnostic form, personalized 6–12 month action plan, and async follow-up support. Sessions are one-time, not recurring. More details at https://www.orafaelferreira.com/mentoria-cloud-devops",
          },
          {
            q: "Where does Rafael Ferreira publish technical content?",
            a: "Rafael publishes technical articles at https://www.orafaelferreira.com/blog, produces the LowOpsCast podcast on Spotify and YouTube, and shares short-form content on LinkedIn and Instagram.",
          },
          {
            q: "What community events does Rafael Ferreira organize?",
            a: "Rafael co-organizes the Azure Floripa, DevOpsDays Floripa, and CNCF SC communities in Florianópolis, Santa Catarina, Brazil.",
          },
        ]
      : [
          {
            q: "Quem é Rafael Ferreira?",
            a: "Rafael Martin Alves Ferreira é um Platform Engineer e especialista em Cloud & DevOps com mais de 10 anos de experiência. É Microsoft MVP Azure, MCT (Microsoft Certified Trainer), DevOps Institute Ambassador, Alura Star, Green Software Champion e Platform Engineering Ambassador.",
          },
          {
            q: "Em que Rafael Ferreira se especializa?",
            a: "Rafael se especializa em Microsoft Azure, Platform Engineering, DevOps, FinOps (otimização de custos em nuvem), Infraestrutura como Código (Terraform e Bicep), AKS, pipelines CI/CD com GitHub Actions e Azure DevOps, e Observabilidade com Prometheus e Grafana.",
          },
          {
            q: "Rafael Ferreira é Microsoft MVP?",
            a: "Sim. Rafael Ferreira é Microsoft MVP (Most Valuable Professional) na categoria Azure — Compute Infrastructure. O prêmio reconhece profissionais de tecnologia que compartilham conhecimento com a comunidade.",
          },
          {
            q: "Rafael Ferreira oferece mentoria?",
            a: "Sim. Rafael oferece sessões de mentoria 1:1 em Cloud Azure e DevOps (1h–1h30) com formulário diagnóstico pré-sessão, plano de ação personalizado de 6–12 meses e suporte assíncrono. As sessões são únicas, sem recorrência. Detalhes em https://www.orafaelferreira.com/mentoria-cloud-devops",
          },
          {
            q: "Onde Rafael Ferreira publica conteúdo técnico?",
            a: "Rafael publica artigos técnicos em https://www.orafaelferreira.com/blog, produz o podcast LowOpsCast no Spotify e YouTube, e compartilha conteúdo no LinkedIn e Instagram.",
          },
          {
            q: "Quais eventos de comunidade Rafael Ferreira organiza?",
            a: "Rafael co-organiza as comunidades Azure Floripa, DevOpsDays Floripa e CNCF SC em Florianópolis, Santa Catarina, Brasil.",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
};

export const mentorshipWebPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/mentoria-cloud-devops#webpage`,
  name: "Mentoria Individual Cloud Azure e DevOps | Rafael Ferreira",
  description:
    "Sessão única 1:1 de 1h a 1h30 com Microsoft MVP Azure. Inclui formulário diagnóstico, plano de ação personalizado de 6–12 meses, suporte assíncrono e grupo exclusivo de vagas. Sem recorrência. Sem assinatura.",
  url: `${SITE_URL}/mentoria-cloud-devops`,
  inLanguage: "pt-BR",
  isPartOf: { "@type": "WebSite", url: SITE_URL },
  about: { "@type": "Service", name: "Mentoria Cloud Azure e DevOps" },
  author: { "@type": "Person", "@id": PERSON_ID },
  dateModified: new Date().toISOString().split("T")[0],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [
      "h1",
      "h2",
      "[data-speakable]",
      "#mentorship-hero p",
      "#mentorship-summary li",
      "#mentorship-benefits",
      "#mentorship-why p",
      "#mentorship-process",
    ],
  },
  mainEntity: {
    "@type": "Service",
    "@id": `${SITE_URL}/mentoria-cloud-devops#service`,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mentoria Cloud & DevOps",
        item: `${SITE_URL}/mentoria-cloud-devops`,
      },
    ],
  },
});

export const mentorshipServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/mentoria-cloud-devops#service`,
  name: "Mentoria Individual Cloud Azure e DevOps",
  alternateName: "Cloud Azure and DevOps Mentorship",
  description:
    "Mentoria 1:1 em Cloud Azure e DevOps com Microsoft MVP. Sessão única de 1h a 1h30, formulário diagnóstico pré-sessão, plano de ação personalizado de 6 a 12 meses, suporte assíncrono e grupo exclusivo de vagas. Sem recorrência. Sem assinatura.",
  url: `${SITE_URL}/mentoria-cloud-devops`,
  serviceType: "Professional Career Mentorship",
  category: "Cloud Computing | DevOps | Career Development",
  areaServed: {
    "@type": "Country",
    name: "Brazil",
  },
  inLanguage: "pt-BR",
  provider: {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON_NAME,
  },
  brand: {
    "@type": "Brand",
    name: PERSON_SHORT,
    url: SITE_URL,
  },
  offers: [
    {
      "@type": "Offer",
      name: "Mentoria Individual Cloud Azure e DevOps — Open to Work (40% off)",
      description: "Sessão de mentoria 1:1 com desconto de 40% para profissionais em busca de emprego.",
      priceCurrency: "BRL",
      eligibleCustomerType: "https://schema.org/BusinessEntityType",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/mentoria-cloud-devops`,
    },
    {
      "@type": "Offer",
      name: "Mentoria Individual Cloud Azure e DevOps — Pleno (20% off)",
      description: "Sessão de mentoria 1:1 com desconto de 20% para profissionais de nível pleno.",
      priceCurrency: "BRL",
      eligibleCustomerType: "https://schema.org/BusinessEntityType",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/mentoria-cloud-devops`,
    },
    {
      "@type": "Offer",
      name: "Mentoria Individual Cloud Azure e DevOps — Sênior (10% off)",
      description: "Sessão de mentoria 1:1 com desconto de 10% para profissionais de nível sênior.",
      priceCurrency: "BRL",
      eligibleCustomerType: "https://schema.org/BusinessEntityType",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/mentoria-cloud-devops`,
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços Rafael Ferreira",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Mentoria Individual Cloud Azure e DevOps",
        description: "Sessão única 1:1 de 1h a 1h30 com diagnóstico, plano de ação e suporte assíncrono.",
      },
      {
        "@type": "OfferCatalog",
        name: "Revisão de Perfil LinkedIn",
        description: "Revisão profissional do perfil LinkedIn para profissionais de Cloud e DevOps.",
      },
      {
        "@type": "OfferCatalog",
        name: "Template de Currículo",
        description: "Template de currículo otimizado para vagas em Cloud e DevOps.",
      },
    ],
  },
  audience: {
    "@type": "Audience",
    audienceType:
      "Profissionais de tecnologia (iniciantes ou experientes) que estudam Cloud Azure e DevOps e buscam clareza no caminho de carreira.",
  },
});

export const mentorshipFaqSchema = (lang: "pt-BR" | "en" = "pt-BR") => {
  const faqs =
    lang === "en"
      ? [
          {
            q: "What is included in the Cloud Azure and DevOps mentorship?",
            a: "The mentorship includes: a single 1-on-1 session lasting 1h to 1h30, a diagnostic form filled out before the session, a personalized 6–12 month action plan, ongoing async support via direct contact, and access to an exclusive job group with direct recruiter referrals.",
          },
          {
            q: "Is the mentorship recurring?",
            a: "No. There is no subscription or recurrence. It is a single strategic meeting followed by async follow-up — a one-time, high-impact session designed to guide your career for 6 to 12 months.",
          },
          {
            q: "Who is the Cloud Azure and DevOps mentorship designed for?",
            a: "The mentorship is for tech professionals — beginners or experienced — who study Cloud Azure and DevOps but feel unsure about the right path: what to study first, which certifications matter, and how to stand out in the job market.",
          },
          {
            q: "How does the mentorship process work?",
            a: "Step 1: Payment. Step 2: Fill out the diagnostic form with your goals and challenges. Step 3: 1:1 session (1h–1h30) where we design your strategic plan together. Step 4: Receive a written personalized action plan for 6–12 months and ongoing async support.",
          },
          {
            q: "What discounts are available for the mentorship?",
            a: "Discounts apply based on career level: Open to Work (40% off), Junior (30% off), Mid-level (20% off), Senior (10% off). Proof of status is required. LinkedIn review and resume template have fixed prices.",
          },
          {
            q: "Why choose Rafael Ferreira as a Cloud and DevOps mentor?",
            a: "Rafael is a Microsoft MVP Azure, MCT, DevOps Institute Ambassador, Alura Star, Green Software Champion, and Platform Engineering Ambassador with over 10 years of experience, 20 certifications, and a degree in Computer Science. He is a Senior Azure Platform Engineer at an American company and an active community organizer (Azure Floripa, DevOpsDays Floripa, CNCF SC).",
          },
        ]
      : [
          {
            q: "O que está incluso na mentoria Cloud Azure e DevOps?",
            a: "A mentoria inclui: sessão única 1:1 de 1h a 1h30, formulário diagnóstico preenchido antes da sessão, plano de ação personalizado de 6–12 meses, suporte assíncrono contínuo via contato direto e acesso a grupo exclusivo de vagas com recomendação direta a recrutadores.",
          },
          {
            q: "A mentoria é recorrente?",
            a: "Não. Não há assinatura nem recorrência. É uma reunião estratégica única com acompanhamento assíncrono — uma sessão pontual de alto impacto desenhada para guiar sua carreira por 6 a 12 meses.",
          },
          {
            q: "Para quem é a mentoria Cloud Azure e DevOps?",
            a: "A mentoria é para profissionais de tecnologia — iniciantes ou experientes — que estudam Cloud Azure e DevOps mas não sabem ao certo o caminho certo: o que estudar primeiro, quais certificações valem, e como se destacar no mercado.",
          },
          {
            q: "Como funciona o processo da mentoria?",
            a: "Etapa 1: Pagamento. Etapa 2: Preenchimento do formulário diagnóstico com seus objetivos e desafios. Etapa 3: Sessão 1:1 (1h a 1h30) onde desenhamos juntos seu plano estratégico. Etapa 4: Recebimento do plano de ação personalizado por escrito para 6–12 meses e suporte assíncrono contínuo.",
          },
          {
            q: "Quais são os descontos disponíveis na mentoria?",
            a: "Os descontos são por nível de carreira: Open to Work (40% off), Júnior (30% off), Pleno (20% off), Sênior (10% off). Comprovante obrigatório. Revisão de LinkedIn e template de currículo têm preço fixo.",
          },
          {
            q: "Por que escolher Rafael Ferreira como mentor de Cloud e DevOps?",
            a: "Rafael é Microsoft MVP Azure, MCT, DevOps Institute Ambassador, Alura Star, Green Software Champion e Platform Engineering Ambassador, com mais de 10 anos de experiência, 20 certificações e formação em Ciência da Computação. Atua como Senior Azure Platform Engineer em empresa americana e é organizador ativo de comunidades (Azure Floripa, DevOpsDays Floripa, CNCF SC).",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
};
