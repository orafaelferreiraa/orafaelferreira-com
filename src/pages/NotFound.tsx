import { useLocation } from "react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Página não encontrada | Rafael Ferreira</title>
        <meta name="description" content="A página que você procura não existe. Volte para a página inicial." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-heading font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Página não encontrada</p>
          <a href="/" className="text-primary underline hover:text-primary/80 font-medium">
            Voltar para a página inicial
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
