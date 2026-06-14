import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
