import { Trophy, Award, Users, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type AwardItem = {
  id: 'mvp' | 'alura' | 'devops' | 'green';
  emoji: string;
  icon: any;
  year: string;
  link?: string;
  color: string;
};

const awards: AwardItem[] = [
  { id: 'mvp', emoji: '🔵', icon: Trophy, year: '2024', link: 'https://mvp.microsoft.com/pt-BR/mvp/profile/627d5ac9-f704-4768-81a7-5c580283881d', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
  { id: 'alura', emoji: '🟡', icon: Award, year: '2025', link: 'https://www.alura.com.br/stars', color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30' },
  { id: 'devops', emoji: '🟣', icon: Users, year: '2025', link: 'https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30' },
  { id: 'green', emoji: '🟢', icon: Leaf, year: '2025', link: 'https://champions.greensoftware.foundation/champions/rafael-ferreira/', color: 'from-green-500/20 to-green-600/20 border-green-500/30' }
];

const Awards = () => {
  const { t } = useTranslation();
  const communityBullets = t('awards.communityBullets', { returnObjects: true }) as string[];
  
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
            const title = t(`awards.items.${award.id}.title`);
            const category = t(`awards.items.${award.id}.category`);
            const description = t(`awards.items.${award.id}.description`);
            const benefits = t(`awards.items.${award.id}.benefits`, { returnObjects: true }) as string[];
            const benefitsHeading = award.id === 'mvp' ? t('awards.mvpOffers') : t('awards.whyChosen');
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
                        <span>{title}</span>
                      </CardTitle>
                      <CardDescription className="text-base">
                        <strong>{t("awards.category")}:</strong> {category}
                        <br />
                        <strong>{t("awards.yearJoined")}:</strong> {award.year}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{description}</p>
                  
                  {benefits && benefits.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider">{benefitsHeading}</h4>
                      <ul className="space-y-2">
                        {benefits.map((benefit, idx) => (
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
            <p className="text-muted-foreground mb-4">{t("awards.communityDescription")}</p>
            <ul className="space-y-3">
              {communityBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-muted-foreground">
              {t("awards.communityFooterPrefix")} {" "}
              <a
                href="https://www.linkedin.com/in/orafaelferreiraa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {t("awards.linkedin")}
              </a>
              {" "}{t("awards.communityFooterSuffix")} 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Awards;
