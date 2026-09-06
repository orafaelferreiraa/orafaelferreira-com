import { Award, Users, Briefcase, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getTechIcon } from "@/lib/tech-icons";

const About = () => {
  const { t } = useTranslation();
  
  // Criar hooks para diferentes grupos de elementos
  const { ref: highlightsRef, isVisible: highlightsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const highlights = {
    experience: {
      icon: Award,
      title: t("about.highlights.experience.title"),
      description: t("about.highlights.experience.description"),
      details: t("about.highlights.experience.details")
    },
    specialization: {
      icon: Briefcase,
      title: t("about.highlights.specialization.title"),
      description: t("about.highlights.specialization.description"),
      details: t("about.highlights.specialization.details")
    },
    stack: {
      icon: Monitor,
      title: t("about.highlights.stack.title"),
      description: t("about.highlights.stack.description"),
      tools: t("about.highlights.stack.tools", { returnObjects: true }) as string[]
    },
    community: {
      icon: Users,
      title: t("about.highlights.community.title"),
      description: t("about.highlights.community.description"),
      details: t("about.highlights.community.details")
    }
  };

  const skills = [{
    techKey: "cloud azure",
    title: t("about.skills.cloudAzure.title"),
    description: t("about.skills.cloudAzure.description")
  }, {
    techKey: "devops & iac",
    title: t("about.skills.devopsIac.title"),
    description: t("about.skills.devopsIac.description")
  }, {
    techKey: "finops",
    title: t("about.skills.finops.title"),
    description: t("about.skills.finops.description")
  }, {
    techKey: "platform engineering",
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

          {/* Highlights Grid - 2x2 Layout */}
          {/* Row 1: Experience + Specialization */}
          <div ref={highlightsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Experience Card */}
            <Card 
              className={`group hover:border-primary/50 transition-all duration-300 scroll-fade-in ${highlightsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '0ms' }}>
              <CardContent className="p-6">
                <highlights.experience.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-semibold mb-2">{highlights.experience.title}</h3>
                <p className="text-muted-foreground mb-3">{highlights.experience.description}</p>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground/80">{highlights.experience.details}</p>
              </CardContent>
            </Card>

             {/* Community Card */}
             <Card 
               className={`group hover:border-primary/50 transition-all duration-300 scroll-fade-in ${highlightsVisible ? 'visible' : ''}`}
               style={{ transitionDelay: '100ms' }}>
               <CardContent className="p-6">
                 <highlights.community.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                 <h3 className="text-xl font-heading font-semibold mb-2">{highlights.community.title}</h3>
                 <p className="text-muted-foreground mb-3">{highlights.community.description}</p>
                 <Separator className="my-3" />
                 <p className="text-sm text-muted-foreground/80">{highlights.community.details}</p>
               </CardContent>
             </Card>
          </div>

          {/* Stack de Ferramentas - Centralizado */}
          <div className="flex justify-center mb-16">
            <Card className={`group hover:border-primary/50 transition-all duration-300 scroll-fade-in w-full max-w-2xl ${highlightsVisible ? 'visible' : ''}`}
              style={{ transitionDelay: '200ms' }}>
              <CardContent className="p-6 flex flex-col items-center">
                <highlights.stack.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-semibold mb-2">{highlights.stack.title}</h3>
                <p className="text-muted-foreground mb-4 text-center">{highlights.stack.description}</p>
                <Separator className="my-6 w-full" />
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {highlights.stack.tools.map((item) => {
                    const { Icon, color } = getTechIcon(item);
                    return (
                      <Badge
                        key={`stack-tool-${item}`}
                        variant="secondary"
                        className="inline-flex items-center gap-1.5 bg-primary/[0.07] text-primary/80 text-sm font-medium border border-primary/10 hover:bg-primary/15 hover:text-primary transition-colors cursor-default px-3 py-1"
                      >
                        <Icon
                          className="h-5 w-5 shrink-0"
                          style={color ? { color } : undefined}
                          aria-hidden="true"
                        />
                        {item}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          {/* Skills Grid */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              {t("about.skillsTitle")} <span className="text-primary">{t("about.skillsTitleHighlight")}</span>
            </h3>
          </div>
          <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => {
              const { Icon, color } = getTechIcon(skill.techKey);
              return (
                <div
                  key={skill.title}
                  className={`group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 scroll-fade-in ${skillsVisible ? 'visible' : ''}`}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}>
                  <Icon
                    className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform"
                    style={color ? { color } : undefined}
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-heading font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>;
};
export default About;
