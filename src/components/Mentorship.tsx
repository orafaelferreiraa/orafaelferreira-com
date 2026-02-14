import { UserCheck, Target, Rocket, ArrowRight, Award, Globe, TrendingUp, CheckCircle2, Clock, FileCheck, Briefcase, ClipboardList, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

const Mentorship = () => {
  const { t } = useTranslation();
  const mentorHighlights = [{
    icon: Briefcase,
    text: t("mentorship.highlights.experience"),
    link: "https://www.orafaelferreira.com/experiencias/"
  }, {
    icon: Globe,
    text: t("mentorship.highlights.global")
  }, {
    icon: Award,
    text: t("mentorship.highlights.education"),
    link: "https://www.orafaelferreira.com/certificacoes/"
  }, {
    icon: Award,
    text: t("mentorship.highlights.mvp"),
    link: "https://mvp.microsoft.com/pt-BR/mvp/profile/627d5ac9-f704-4768-81a7-5c580283881d"
  }, {
    icon: Globe,
    text: t("mentorship.highlights.ambassador"),
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf"
  }, {
    icon: Award,
    text: t("mentorship.highlights.aluraStar"),
    link: "https://www.alura.com.br/stars"
  }, {
    icon: Globe,
    text: t("mentorship.highlights.greenChampion"),
    link: "https://champions.greensoftware.foundation/champions/rafael-ferreira/"
  }, {
    icon: TrendingUp,
    text: t("mentorship.highlights.speaker"),
    link: "https://www.orafaelferreira.com/palestras/"
  }];
  const mentorshipBenefits = [{
    icon: Target,
    title: t("mentorship.benefits.personalized.title"),
    description: t("mentorship.benefits.personalized.description")
  }, {
    icon: UserCheck,
    title: t("mentorship.benefits.directSupport.title"),
    description: t("mentorship.benefits.directSupport.description")
  }, {
    icon: Rocket,
    title: t("mentorship.benefits.tips.title"),
    description: t("mentorship.benefits.tips.description")
  }, {
    icon: TrendingUp,
    title: t("mentorship.benefits.strategic.title"),
    description: t("mentorship.benefits.strategic.description")
  }, {
    icon: CheckCircle2,
    title: t("mentorship.benefits.confidence.title"),
    description: t("mentorship.benefits.confidence.description")
  }, {
    icon: Briefcase,
    title: t("mentorship.benefits.jobGroup.title"),
    description: t("mentorship.benefits.jobGroup.description")
  }];
  const unifiedProcessSteps = [{
    icon: ClipboardList,
    title: t("mentorship.unifiedProcess.step1Title"),
    paragraphs: t("mentorship.unifiedProcess.step1Paragraphs", { returnObjects: true }) as string[]
  }, {
    icon: FileCheck,
    title: t("mentorship.unifiedProcess.step2Title"),
    paragraphs: t("mentorship.unifiedProcess.step2Paragraphs", { returnObjects: true }) as string[]
  }, {
    icon: Video,
    title: t("mentorship.unifiedProcess.step3Title"),
    paragraphs: t("mentorship.unifiedProcess.step3Paragraphs", { returnObjects: true }) as string[]
  }, {
    icon: CheckCircle2,
    title: t("mentorship.unifiedProcess.step4Title"),
    paragraph: t("mentorship.unifiedProcess.step4Paragraph")
  }];
  const services = [{
    name: t("mentorship.services.mentorship"),
    price: "R$ 989",
    link: "https://payment.ticto.app/O13FE48B5"
  }, {
    name: t("mentorship.services.linkedin"),
    price: "R$ 189",
    link: "https://payment.ticto.app/OB136C8B8"
  }, {
    name: t("mentorship.services.resume"),
    price: "R$ 49",
    link: "https://payment.ticto.app/OE731FEB6"
  }];
  const discountsByProfile = [{
    profile: t("mentorship.profiles.openToWork"),
    mentorship: "R$ 593,40",
    linkedin: "R$ 189",
    template: "R$ 49",
    total: "R$ 831,40"
  }, {
    profile: t("mentorship.profiles.junior"),
    mentorship: "R$ 692,30",
    linkedin: "R$ 189",
    template: "R$ 49",
    total: "R$ 930,30"
  }, {
    profile: t("mentorship.profiles.mid"),
    mentorship: "R$ 791,20",
    linkedin: "R$ 189",
    template: "R$ 49",
    total: "R$ 1.029,20"
  }, {
    profile: t("mentorship.profiles.senior"),
    mentorship: "R$ 890,10",
    linkedin: "R$ 189",
    template: "R$ 49",
    total: "R$ 1.128,10"
  }];
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-[20%] -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[50%] -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[75%] right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              {t("mentorship.heroTitle.prefix")} {t("mentorship.heroTitle.highlight")}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8">
              {t("mentorship.hero.subtitle1")}
            </p>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8">
              {t("mentorship.hero.subtitle2")}
            </p>
            <p className="text-base lg:text-lg font-medium leading-relaxed mb-8">
              {t("mentorship.hero.subtitle3")}
            </p>
            <Card className="p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm bg-primary/5">
              <p className="text-base lg:text-lg font-semibold">
                {t("mentorship.hero.highlight")}
              </p>
            </Card>
            <div className="flex justify-center mt-8">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <a href="https://payment.ticto.app/O13FE48B5" target="_blank" rel="noopener noreferrer">
                  {t("mentorship.hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Por que me escolher Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-center mb-12">
              {t("mentorship.whyChoosePrefix")} <span className="text-primary">{t("mentorship.whyChooseHighlight")}</span>
            </h2>

            <div className="mb-12 rounded-lg overflow-hidden"></div>

            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">{t("mentorship.intro")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorHighlights.map((highlight, index) => <Card key={index} className="p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_4px_24px_hsl(180_100%_50%/0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      {highlight.link ? <a href={highlight.link} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                          <p className="text-sm leading-relaxed">{highlight.text}</p>
                        </a> : <p className="text-sm leading-relaxed">{highlight.text}</p>}
                    </div>
                  </div>
                </Card>)}
            </div>

            <Card className="mt-8 p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm">
              <p className="text-sm leading-relaxed">
                <strong>{t("mentorship.expertise.technical")}</strong> {t("mentorship.expertise.technicalDesc")}
              </p>
              <Separator className="my-4" />
              <p className="text-sm leading-relaxed">
                <strong>{t("mentorship.expertise.methodologies")}</strong> {t("mentorship.expertise.methodologiesDesc")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-4">{t("mentorship.values")}</h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              {t("mentorship.pricing")}
            </p>

            <Card className="mb-8 overflow-hidden rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">{t("mentorship.service")}</TableHead>
                    <TableHead className="font-bold text-right">{t("mentorship.price")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => <TableRow key={index}>
                      <TableCell className="font-medium">
                        {service.link ? (
                          <a href={service.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {service.name}
                          </a>
                        ) : service.name}
                      </TableCell>
                      <TableCell className="text-right">{service.price}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </Card>

            <h3 className="text-2xl font-heading font-bold text-center mb-8">{t("mentorship.discountsByProfile")}</h3>

            <Card className="overflow-hidden rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">{t("mentorship.profile")}</TableHead>
                    <TableHead className="font-bold text-right">{t("mentorship.table.mentorshipHeader")}</TableHead>
                    <TableHead className="font-bold text-right">{t("mentorship.table.linkedinHeader")}</TableHead>
                    <TableHead className="font-bold text-right">{t("mentorship.table.resumeHeader")}</TableHead>
                    <TableHead className="font-bold text-right">{t("mentorship.total")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountsByProfile.map((row, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{row.profile}</TableCell>
                      <TableCell className="text-right">{row.mentorship}</TableCell>
                      <TableCell className="text-right">{row.linkedin}</TableCell>
                      <TableCell className="text-right">{row.template}</TableCell>
                      <TableCell className="text-right font-bold">{row.total}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </Card>

            <Card className="mt-8 p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm bg-primary/5">
              <h4 className="font-heading font-bold text-lg mb-4">{t("mentorship.payment.title")}</h4>
              <p className="text-sm mb-4 leading-relaxed">
                {t("mentorship.payment.method")}
              </p>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm font-semibold mb-2">{t("mentorship.payment.proof")}</p>
                <p className="text-sm leading-relaxed">
                  {t("mentorship.payment.proofDesc")}
                </p>
                <p className="text-sm font-bold mt-2">{t("mentorship.payment.noProof")}</p>
              </div>
              <div className="p-4 mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                <p className="text-sm font-semibold leading-relaxed text-amber-900 dark:text-amber-100">
                  {t("mentorship.payment.startCondition")}
                </p>
              </div>
              <div className="p-4 mt-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
                  {t("mentorship.payment.discountCoupon")}{" "}
                  <a 
                    href="https://www.linkedin.com/in/orafaelferreiraa/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {t("mentorship.payment.discountCouponLink")}
                  </a>.
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <a href="https://payment.ticto.app/O13FE48B5" target="_blank" rel="noopener noreferrer">
                    {t("mentorship.payment.ctaSignup")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que minha mentoria Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-16">
              {t("mentorship.whySection.title")} <span className="text-primary">{t("mentorship.whySection.titleHighlight")}</span>
            </h2>

            <div className="space-y-8 text-base lg:text-lg leading-relaxed">
              <p className="text-foreground">
                {t("mentorship.whySection.paragraph1")}
              </p>

              <Card className="p-8 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm bg-primary/10 shadow-lg">
                <p className="font-bold text-foreground text-lg lg:text-xl leading-relaxed">
                  {t("mentorship.whySection.quote")}
                </p>
              </Card>

              <p className="text-foreground">
                {t("mentorship.whySection.paragraph2")}
              </p>

              <Card className="p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm bg-gradient-to-r from-primary/5 to-primary/10">
                <p className="font-bold text-foreground text-lg lg:text-xl">
                  {t("mentorship.whySection.paragraph3")}
                </p>
              </Card>

              <p className="text-foreground font-medium text-lg">
                {t("mentorship.whySection.paragraph4")}
              </p>

              <Card className="p-6 rounded-2xl border border-destructive/20 bg-card/40 backdrop-blur-sm bg-destructive/10">
                <h4 className="font-heading font-bold text-lg mb-3 text-foreground">{t("mentorship.whySection.warning")}</h4>
                <p className="text-sm">
                  {t("mentorship.whySection.warningText")}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Method Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-8">
              {t("mentorship.provenMethod.title")}
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t("mentorship.provenMethod.intro")}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(t("mentorship.provenMethod.pillars", { returnObjects: true }) as string[]).map((pillar, index) => (
                  <Card key={index} className="p-6 text-center rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_4px_24px_hsl(180_100%_50%/0.08)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground font-medium">{pillar}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Process Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
              {t("mentorship.unifiedProcess.title")}
            </h2>

            <div className="space-y-6">
              {unifiedProcessSteps.map((step, index) => (
                <Card key={index} className="p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_4px_24px_hsl(180_100%_50%/0.08)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-heading font-bold">{step.title}</h3>
                      </div>
                      {'paragraphs' in step ? (
                        <div className="space-y-2">
                          {step.paragraphs.map((para, pIndex) => (
                            <p key={pIndex} className="text-muted-foreground leading-relaxed">{para}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">{step.paragraph}</p>
                      )}
                      {index === 0 && (
                        <Button asChild className="mt-4" size="sm">
                          <a href="https://payment.ticto.app/O13FE48B5" target="_blank" rel="noopener noreferrer">
                            {t("mentorship.signUp")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Na minha mentoria você terá Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
              {t("mentorship.benefitsTitle")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorshipBenefits.map((benefit, index) => <Card key={index} className="p-6 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_8px_32px_hsl(180_100%_50%/0.08)] hover:-translate-y-1 transition-all duration-300">
                  <CardHeader className="p-0 mb-4">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3 w-fit">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t("mentorship.finalCTA.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("mentorship.finalCTA.paragraph1")}
            </p>
            <p className="text-lg font-semibold mb-8">
              {t("mentorship.finalCTA.paragraph2")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <a href="https://payment.ticto.app/O13FE48B5" target="_blank" rel="noopener noreferrer">
                  {t("mentorship.finalCTA.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
  
   
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Mentorship;