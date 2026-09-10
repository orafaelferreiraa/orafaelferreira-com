import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CTA_BUTTON_CLASS } from "./Mentorship";

/**
 * Persistent bottom CTA bar for the mentorship page, visible on both mobile and
 * desktop. Appears once the visitor scrolls past the hero, mirroring
 * BackToTop.tsx's own scroll-visibility pattern. Reuses the same payment link
 * and CTA styling as the page's other CTA buttons (Mentorship.tsx).
 */
const MentorshipStickyCta = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md transition-[opacity,transform] duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="hidden sm:block min-w-0">
          <p className="font-heading font-semibold text-sm truncate">{t("mentorship.services.mentorship")}</p>
          <p className="text-sm text-muted-foreground">R$ 989</p>
        </div>
        <Button size="lg" asChild className={CTA_BUTTON_CLASS}>
          <a href="https://payment.ticto.app/O13FE48B5" target="_blank" rel="noopener noreferrer">
            {t("mentorship.hero.cta")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MentorshipStickyCta;
