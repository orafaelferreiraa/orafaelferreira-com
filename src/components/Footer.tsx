import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Rafael Martin Alves Ferreira. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            Feito com <Heart className="h-4 w-4 text-destructive fill-destructive" /> para a comunidade tech
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
