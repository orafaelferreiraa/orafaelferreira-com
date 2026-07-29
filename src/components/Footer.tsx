import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

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
          <nav aria-label="Links do rodapé">
            <p className="font-medium text-sm mb-3">{t("nav.home")}</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/mentoria-cloud-devops" className="hover:text-primary transition-colors">{t("nav.mentorship")}</Link></li>
              <li><Link to="/palestras" className="hover:text-primary transition-colors">{t("nav.talks")}</Link></li>
              <li><Link to="/certificacoes" className="hover:text-primary transition-colors">{t("nav.certifications")}</Link></li>
              <li><Link to="/experiencias" className="hover:text-primary transition-colors">{t("nav.experiences")}</Link></li>
            </ul>
          </nav>
          {/* Social */}
          <div>
            <p className="font-medium text-sm mb-3">Social</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="https://www.linkedin.com/in/orafaelferreiraa/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://github.com/orafaelferreiraa" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://www.youtube.com/@LowOps" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a></li>
              <li><a href="https://www.instagram.com/orafaelferreira1/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a></li>
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
