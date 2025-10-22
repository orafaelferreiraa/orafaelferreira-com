import { useState } from "react";
import { Send, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Obrigado pelo contato. Responderei em breve.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "contato@rafaelferreira.dev",
      href: "mailto:contato@rafaelferreira.dev",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "/in/rafaelmartinferreira",
      href: "https://www.linkedin.com/in/rafaelmartinferreira/",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@rafaelmartinferreira",
      href: "https://github.com/rafaelmartinferreira",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
              Entre em <span className="text-primary">Contato</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vamos conversar sobre Cloud, DevOps, mentorias ou oportunidades de palestras
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8 animate-fade-in-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nome
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Como posso ajudar?"
                    rows={5}
                    className="w-full resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <Card className="p-6">
                <h3 className="text-xl font-heading font-semibold mb-6">Contato direto</h3>
                <div className="space-y-4">
                  {contactLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{link.label}</p>
                        <p className="font-medium">{link.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <h3 className="text-xl font-heading font-semibold mb-3">LowOpsCast</h3>
                <p className="text-muted-foreground mb-4">
                  Ouça meu podcast sobre Cloud, DevOps e Platform Engineering no Spotify
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a href="https://open.spotify.com/show/lowopscast" target="_blank" rel="noopener noreferrer">
                    Ouvir no Spotify
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
