import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { experiencesEN } from "@/i18n/experiences/en";
import { experiencesPT } from "@/i18n/experiences/pt-BR";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

const Experience = () => {
  const { t, i18n } = useTranslation();
  
  // Select experiences based on current language
  const experiences = i18n.language === 'en' ? experiencesEN : experiencesPT;
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("experience.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
            {t("experience.description")}
          </p>
        </div>

        <Separator className="mb-12" />

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-start gap-2">
                      <Briefcase className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span>{exp.title}</span>
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground/80">
                      {exp.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{exp.period.replace(/Present/i, t('experience.present'))}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
