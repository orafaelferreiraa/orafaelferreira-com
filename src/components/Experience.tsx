import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { experiencesEN } from "@/i18n/experiences/en";
import { experiencesPT } from "@/i18n/experiences/pt-BR";
import { getTechIcon } from "@/lib/tech-icons";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  stack: string[];
}

/* ───────────────────────── Timeline Card ───────────────────────── */
const TimelineCard = ({
  exp,
  index,
  t,
}: {
  exp: ExperienceItem;
  index: number;
  isFirst: boolean;
  t: (key: string) => string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.12, rootMargin: "-40px" });

  const descriptionPreview = exp.description.length > 220 ? exp.description.slice(0, 220) + "..." : exp.description;
  const isLong = exp.description.length > 220;
  const isPresent = /present|atualmente/i.test(exp.period);

  return (
    <div ref={ref} className="relative flex items-stretch gap-6">
      {/* ── Timeline line + dot ── */}
      <div className="hidden md:flex flex-col items-center">
        {/* Glowing dot */}
        <div
          className={`relative z-10 mt-7 h-4 w-4 rounded-full border-2 shrink-0 transition-all duration-700 ${
            isPresent
              ? "border-primary bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)] animate-pulse"
              : "border-primary/50 bg-background"
          }`}
        >
          {isPresent && (
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          )}
        </div>
        {/* Vertical line */}
        <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      {/* ── Card ── */}
      <div
        className={`flex-1 pb-10 scroll-fade-in ${isVisible ? "visible" : ""}`}
        style={{ transitionDelay: `${index * 60}ms` }}
      >
        {/* Date + badge row */}
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          {/* Mobile dot */}
          <span
            className={`md:hidden inline-flex h-3 w-3 rounded-full border-2 shrink-0 ${
              isPresent
                ? "border-primary bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)] animate-pulse"
                : "border-primary/50 bg-background"
            }`}
          />
          <Calendar className="h-3.5 w-3.5 text-primary/60" />
          <span className="text-sm font-medium">
            {exp.period.replace(/Present/i, t("experience.present"))}
          </span>
          {isPresent && (
            <Badge variant="secondary" className="bg-primary/15 text-primary text-[10px] px-2 py-0">
              {t("experience.currentRole")}
            </Badge>
          )}
        </div>

        <div
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            isPresent
              ? "border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card/80 to-card/60 shadow-[0_0_40px_hsl(var(--primary)/0.06)]"
              : "border-primary/10 bg-card/60"
          } backdrop-blur-sm hover:border-primary/25 hover:shadow-[0_8px_40px_hsl(var(--primary)/0.08)] hover:-translate-y-0.5`}
        >
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  {isPresent && (
                    <Badge variant="secondary" className="hidden md:inline-flex bg-primary/15 text-primary text-[10px] px-2 py-0.5 shrink-0">
                      {t("experience.currentRole")}
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {exp.title}
                </h3>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Building2 className="h-4 w-4 text-primary/50" />
              <span className="text-sm font-medium">{exp.company}</span>
            </div>

            {/* Description */}
            <div className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {expanded || !isLong ? exp.description : descriptionPreview}
              </p>
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {expanded ? (
                    <>
                      {t("experience.showLess")} <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      {t("experience.showMore")} <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stack */}
            {exp.stack?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-primary/5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-2.5">
                  {t("experience.stackLabel")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((item) => {
                    const { Icon, color } = getTechIcon(item);
                    return (
                      <Badge
                        key={`${exp.title}-${item}`}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── Main Component ───────────────────────── */
const Experience = () => {
  const { t, i18n } = useTranslation();
  const experiences = i18n.language === "en" ? experiencesEN : experiencesPT;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative">
        {/* ── Header ── */}
        <div className="mb-16 animate-fade-in text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-foreground">
            {t("experience.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("experience.description")}
          </p>
        </div>

        <Separator className="mb-16 opacity-50" />

        {/* ── Timeline ── */}
        <div className="relative max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <TimelineCard
              key={`${exp.company}-${index}`}
              exp={exp}
              index={index}
              isFirst={index === 0}
              t={t}
            />
          ))}

          {/* End dot */}
          <div className="hidden md:flex ml-[7px]">
            <div className="h-3 w-3 rounded-full bg-primary/20 border border-primary/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
