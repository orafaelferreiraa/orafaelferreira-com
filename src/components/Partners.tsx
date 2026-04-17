import { ExternalLink, Copy, Check, Shirt, GraduationCap, Banknote, Calculator, Video, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState } from "react";

const Partners = () => {
  const { t } = useTranslation();
  const { ref: partnersRef, isVisible: partnersVisible } = useScrollAnimation({ threshold: 0.1 });
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const partners = [
    {
      id: "useti",
      icon: Shirt,
      name: "Use T.I",
      description: t("partners.items.useti.description"),
      coupon: "RAFAFERREIRA",
      link: "https://www.useti.shop/useti",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "alura",
      icon: GraduationCap,
      name: "Alura",
      description: t("partners.items.alura.description"),
      link: "https://www.alura.com.br/promocao/awin_10EstudeAlurax",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "techfx",
      icon: Banknote,
      name: "TechFX",
      description: t("partners.items.techfx.description"),
      link: "https://www.techfx.com.br/rafa-ferreira/",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "contabilizei",
      icon: Calculator,
      name: "Contabilizei",
      description: t("partners.items.contabilizei.description"),
      link: "https://www.contabilizei.com.br/programa-de-indicacao/?ref=daf792a9759933c6a3f54a8832357168&nome=RAFAEL&email=rafael_low%40hotmail.com&utm_source=plataforma&utm_campaign=MGM",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "opusclip",
      icon: Video,
      name: "OpusClip",
      description: t("partners.items.opusclip.description"),
      link: "https://www.opus.pro/pt-br?via=1526dc",
      gradient: "from-red-500 to-rose-500",
    },
    {
      id: "nuvme",
      icon: Cloud,
      name: "Nuvme",
      description: t("partners.items.nuvme.description"),
      link: "https://nuvme.com.br/",
      gradient: "from-indigo-500 to-violet-500",
    },
  ];

  const handleCopyCoupon = async (coupon: string) => {
    try {
      await navigator.clipboard.writeText(coupon);
      setCopiedCoupon(coupon);
      setTimeout(() => setCopiedCoupon(null), 2000);
    } catch (err) {
      console.error("Failed to copy coupon:", err);
    }
  };

  return (
    <section id="partners" className="py-20 lg:py-32 relative bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              {t("partners.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("partners.subtitle")}
            </p>
          </div>

          {/* Partners Grid */}
          <div
            ref={partnersRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {partners.map((partner, index) => (
              <Card
                key={partner.id}
                className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 scroll-fade-in ${
                  partnersVisible ? "visible" : ""
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient Top Border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${partner.gradient} opacity-70 group-hover:opacity-100 transition-opacity`}
                />

                <CardContent className="p-6 pt-8">
                  {/* Icon and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${partner.gradient} text-white`}
                    >
                      <partner.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold">{partner.name}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-5 min-h-[48px]">
                    {partner.description}
                  </p>

                  {/* Coupon Badge (if exists) */}
                  {partner.coupon && (
                    <div className="mb-4">
                      <button
                        onClick={() => handleCopyCoupon(partner.coupon!)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors group/coupon"
                      >
                        <span className="text-sm font-mono font-medium text-primary">
                          {t("partners.coupon")}: {partner.coupon}
                        </span>
                        {copiedCoupon === partner.coupon ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-primary/70 group-hover/coupon:text-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    variant="outline"
                    className="w-full group-hover:border-primary/50 transition-colors"
                    asChild
                  >
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {t("partners.visitSite")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
