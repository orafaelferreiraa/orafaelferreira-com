import { Cloud, Code, TrendingUp, Lightbulb, Award, Users, Briefcase, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const highlights = [{
    icon: Award,
    title: t("about.highlights.experience.title"),
    description: t("about.highlights.experience.description"),
    details: t("about.highlights.experience.details")
  }, {
    icon: Briefcase,
    title: t("about.highlights.specialization.title"),
    description: t("about.highlights.specialization.description"),
    details: t("about.highlights.specialization.details")
  }, {
    icon: Monitor,
    title: t("about.highlights.stack.title"),
    description: t("about.highlights.stack.description"),
    details: t("about.highlights.stack.details")
  }, {
    icon: Users,
    title: t("about.highlights.community.title"),
    description: t("about.highlights.community.description"),
    details: t("about.highlights.community.details")
  }];
  const skills = [{
    icon: Cloud,
    title: t("about.skills.cloudAzure.title"),
    description: t("about.skills.cloudAzure.description")
  }, {
    icon: Code,
    title: t("about.skills.devopsIac.title"),
    description: t("about.skills.devopsIac.description")
  }, {
    icon: TrendingUp,
    title: t("about.skills.finops.title"),
    description: t("about.skills.finops.description")
  }, {
    icon: Lightbulb,
    title: t("about.skills.platformEngineering.title"),
    description: t("about.skills.platformEngineering.description")
  }];
  return <section id="about" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t("about.title")} <span className="text-primary">{t("about.titleHighlight")}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">{t("about.description")}</p>
            <p className="text-primary font-semibold italic text-lg">"{t("about.quote")}"</p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {highlights.map((highlight, index) => <Card key={highlight.title} className="group hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardContent className="p-6">
                  <highlight.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-heading font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground mb-3">{highlight.description}</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground/80">{highlight.details}</p>
                </CardContent>
              </Card>)}
          </div>

          <Separator className="my-12" />

          {/* Skills Grid */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              {t("about.skillsTitle")} <span className="text-primary">{t("about.skillsTitleHighlight")}</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => <div key={skill.title} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <skill.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground">{skill.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default About;
