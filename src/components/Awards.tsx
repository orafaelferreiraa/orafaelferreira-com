import { Trophy, Award, Users, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const awards = [
  {
    id: 1,
    title: "Microsoft MVP Azure 2025",
    emoji: "🔵",
    icon: Trophy,
    category: "Azure – Compute Infrastructure",
    year: "2024",
    description: "O Microsoft MVP Award reconhece profissionais que compartilham expertise com a comunidade e contribuem para o ecossistema Microsoft.",
    benefits: [
      "Acesso antecipado a builds e roadmaps do Azure",
      "Canal direto com times de produto na Microsoft",
      "Convite para o MVP Global Summit em Redmond",
      "Licenças Visual Studio Enterprise & Microsoft 365 para projetos de comunidade"
    ],
    link: "https://mvp.microsoft.com/pt-BR/mvp/profile/627d5ac9-f704-4768-81a7-5c580283881d",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
  },
  {
    id: 2,
    title: "Alura Star 2025",
    emoji: "🟣",
    icon: Award,
    category: "Educação e Comunidade",
    year: "2025",
    description: "Alura Stars é o programa de embaixadores da Alura que destaca creators e líderes comunitários que transformam o futuro pela educação em tecnologia.",
    benefits: [
      "Conteúdo constante sobre Azure, DevOps e FinOps nas redes e blog",
      "Lives técnicas, aproximando iniciantes do mercado",
      "Organização de Comunidades (Azure Floripa, DevOpsDays Floripa, CNCF SC)"
    ],
    link: "https://www.alura.com.br/stars",
    color: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
  },
  {
    id: 3,
    title: "DevOps Institute Ambassador 2025",
    emoji: "🟢",
    icon: Users,
    category: "DevOps Community",
    year: "2025",
    description: "DevOps Institute Ambassador reconhece embaixadores globais por liderar e apoiar a comunidade internacional de DevOps.",
    benefits: [
      "Defensor ativo do SKIL Framework (Skills, Knowledge, Ideas & Learning)",
      "Contribuição com conteúdo, eventos e iniciativas educacionais",
      "Promoção de conexões valiosas entre profissionais do movimento Humans of DevOps"
    ],
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf",
    color: "from-green-500/20 to-green-600/20 border-green-500/30"
  },
  {
    id: 4,
    title: "Green Software Champion 2025",
    emoji: "🟢",
    icon: Leaf,
    category: "Sustentabilidade",
    year: "2025",
    description: "Green Software Champion é uma distinção internacional concedida pela Green Software Foundation a profissionais que lideram iniciativas para descarbonizar o desenvolvimento de software e promover práticas sustentáveis na indústria de tecnologia.",
    benefits: [
      "Liderança em iniciativas de descarbonização de software",
      "Promoção de práticas sustentáveis na indústria tech",
      "Reconhecimento internacional pela Green Software Foundation"
    ],
    link: "https://champions.greensoftware.foundation/champions/rafael-ferreira/",
    color: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30"
  }
];

const Awards = () => {
  const { t } = useTranslation();
  
  return (
    <section id="awards" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("awards.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic border-l-4 border-primary pl-4">
            {t("awards.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {awards.map((award, index) => {
            const Icon = award.icon;
            return (
              <Card
                key={award.id}
                className={`group hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${award.color} backdrop-blur-sm animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-background/50">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                        <span>{award.emoji}</span>
                        <span>{award.title}</span>
                      </CardTitle>
                      <CardDescription className="text-base">
                        <strong>{t("awards.category")}:</strong> {award.category}
                        <br />
                        <strong>{t("awards.yearJoined")}:</strong> {award.year}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{award.description}</p>
                  
                  {award.benefits && award.benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider">
                        {award.id === 1 ? t("awards.mvpOffers") : t("awards.whyChosen")}
                      </h4>
                      <ul className="space-y-2">
                        {award.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {award.link && (
                    <a
                      href={award.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm mt-2"
                    >
                      {t("awards.viewProfile")} →
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">{t("awards.communityImpact")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t("awards.communityDescription")}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Levar <strong>conteúdo de qualidade</strong> a ainda mais pessoas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Trazer conteúdos sobre Azure, DevOps e sustentabilidade de forma acessível</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Conectar quem está começando com oportunidades reais de carreira</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Apoiar iniciativas de diversidade, inclusão e práticas sustentáveis em tech</span>
              </li>
            </ul>
            <p className="mt-6 text-muted-foreground">
              Se quiser saber mais, colaborar ou convidar para palestrar,{" "}
              <a
                href="https://www.linkedin.com/in/orafaelferreiraa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {t("awards.linkedin")}
              </a>
              ! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Awards;
