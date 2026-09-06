import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const links: { to: string; label: string }[] = [
    { to: "/blog", label: t("nav.blog") },
    { to: "/mentoria-cloud-devops", label: t("nav.mentorship") },
    { to: "/palestras", label: t("nav.talks") },
    { to: "/premiacoes", label: t("nav.awards") },
    { to: "/certificacoes", label: t("nav.certifications") },
    { to: "/certificados", label: t("nav.certificates") },
    { to: "/experiencias", label: t("nav.experiences") },
    { to: "/recomendacoes", label: t("nav.recommendations") },
  ];

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-heading font-bold text-lg mb-2">Rafael Ferreira</p>
            <p className="text-sm text-muted-foreground">Cloud & DevOps Specialist | Microsoft MVP</p>
          </div>
          {/* Navigation */}
          <nav aria-label={t("footer.navigation")}>
            <p className="font-medium text-sm mb-3">{t("footer.navigation")}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
              <li>
                <a href="/rss.xml" type="application/rss+xml" className="hover:text-primary transition-colors">{t("footer.rss")}</a>
              </li>
            </ul>
          </nav>
          {/* Social */}
          <div>
            <p className="font-medium text-sm mb-3">{t("footer.social")}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="https://www.linkedin.com/in/orafaelferreiraa/" target="_blank" rel="noopener noreferrer me" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/orafaelferreiraa" target="_blank" rel="noopener noreferrer me" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://www.youtube.com/@LowOps" target="_blank" rel="noopener noreferrer me" className="hover:text-primary transition-colors">YouTube</a></li>
              <li><a href="https://www.instagram.com/orafaelferreira1/" target="_blank" rel="noopener noreferrer me" className="hover:text-primary transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Rafael Ferreira. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
