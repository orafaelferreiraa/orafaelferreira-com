import { FileCheck, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Certificate {
  title: string;
  link: string;
}

interface YearCertificates {
  year: string;
  certificates: Certificate[];
}

const certificatesByYear: YearCertificates[] = [
  {
    year: "2025",
    certificates: [
      { title: "AZ-700 - Projetar e Implementar Soluções de Rede do Azure", link: "https://www.udemy.com/certificate/UC-49bfc006-aeb5-476d-8083-229aac73cd8f/" },
      { title: "Palestrante Trilha ARQUITETURA CLOUD - TDC 2025 SÃO PAULO", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-09-PalestranteTrilhaARQUITETURACLOUD-TDC2025S%C3%83OPAULO.pdf" },
      { title: "Palestrante Encontro AWS User Group Floripa", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-09-EncontroAWSUserGroupFloripa.pdf" },
      { title: "Palestrante DevOpsDays Curitiba 2025", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-08-PalestranteDevOpsDaysCuritiba2025.pdf" },
      { title: "Palestrante - Hacking na Web Day Florianópolis 2025", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-08-Palestrante-HNWDFlorianopolis2025.pdf" },
      { title: "HashiCorp Certified: Terraform Associate (003)", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-HashiCorpCertifiedTerraformAssociate(003).pdf" },
      { title: "2025 Microsoft Most Valuable Professional (MVP)", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-MostValuableProfessionalCertificate.pdf.pdf" },
      { title: "DevOps Institute Ambassadors", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf" },
      { title: "Fundamentals of Bicep", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-03-FundamentalsofBicep.pdf" }
    ]
  },
  {
    year: "2024",
    certificates: [
      { title: "Code Island Cloud 2024", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-11-Code.Island.Cloud.2024.pdf" },
      { title: "2º TECH CONNECTION FLORIPA", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-11-2TECHCONNECTIONFLORIPA.png" },
      { title: "Flux CD Mastery: Automating Kubernetes with GitOps - Udemy", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-10-FluxCDMasteryAutomatingKuberneteswithGitOps-Udemy.pdf" },
      { title: "Imersão Azure - TFTEC", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-10-Imersa%CC%83o.Azure.TFTEC.pdf" },
      { title: "Certification Flow AI Expert – CI&T", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-Certification-FLOW-AI-EXPERT.pdf" },
      { title: "GitHub Foundations", link: "https://www.credly.com/badges/da03d2a7-58d7-49cc-af37-37cc055fb1ea/public_url" },
      { title: "2024 Microsoft Most Valuable Professional (MVP)", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-MostValuableProfessionalCertificate.pdf" },
      { title: "Security Academy 360", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-08-Security.Academy.360.jpeg" },
      { title: "Agile Essentials - LINUXtips", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-08-Agile.Essentials.pdf" },
      { title: "Palestrante da Trilha Arquitetura de Dados - TDC 2024 FLORIANÓPOLIS", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-Palestrante-Trilha-Arquitetura-Dados.pdf" }
    ]
  },
  {
    year: "2023",
    certificates: [
      { title: "Codecon Feature", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-10-codecon.feature.pdf" },
      { title: "Terraform no Azure - Infraestrutura como Código e DevOps - Udemy", link: "https://www.udemy.com/certificate/UC-188b512a-2690-40ee-a2e9-6a4c96f8090e/" },
      { title: "Platform Engineer Immersive Experience - LINUXtips", link: "https://www.credential.net/b4feadda-bc7a-4951-8790-ee914b96a498" },
      { title: "Uncomplicating Prometheus - LINUXtips", link: "https://www.credential.net/fcdb14d5-0f6d-4fa8-9464-28978e5d1e20" },
      { title: "Uncomplicating AWS - LINUXtips", link: "https://www.credential.net/5ffcf2a6-821b-424b-9516-f16303c950b0" },
      { title: "FinOps Certified Practitioner", link: "https://www.credly.com/badges/d77d284c-7992-4721-bc6f-e21df5183743/public_url" },
      { title: "Uncomplicating Terraform - LINUXtips", link: "https://www.credential.net/8f101780-6520-4a93-8c88-866ff0aa65ed" },
      { title: "Microsoft Certified DevOps Engineer Expert", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/EA24867B521F82D8?sharingId=AF242064A982B1A4" }
    ]
  },
  {
    year: "2022",
    certificates: [
      { title: "Copa do Mundo Azure - TFTEC", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-11-Copa.do.Mundo.Azure-TFTEC.pdf" },
      { title: "Docker para Desenvolvedores e Administradores de Redes - Udemy", link: "https://www.udemy.com/certificate/UC-a40bd06b-eff2-44e1-b5d7-20fabbd2bcbd/" },
      { title: "AWS Certified Cloud Practitioner", link: "https://www.credly.com/badges/cc2090a8-2445-4cee-ba0a-ef398c636f33/linked_in_profile" },
      { title: "Microsoft Certified Azure Security Engineer Associate", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/F760B4A83F6D292C?sharingId=AF242064A982B1A4" },
      { title: "Microsoft Certified Azure Solutions Architect Expert", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/ECCBB4FB7DF76876?sharingId=AF242064A982B1A4" },
      { title: "Microsoft Certified Azure Data Fundamentals", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/AAA6537164EF3CD0?sharingId=AF242064A982B1A4" }
    ]
  },
  {
    year: "2021 e anteriores",
    certificates: [
      { title: "Microsoft Certified Trainer", link: "https://www.credly.com/badges/9f76b758-5134-4dbb-b138-35c61e7b4cbe/public_url" },
      { title: "Microsoft Certified Azure Network Engineer Associate", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/BE1DAD21D266E213?sharingId=AF242064A982B1A4" },
      { title: "Microsoft Certified Azure Administrator Associate", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/13E2C5603C9C68C?sharingId=AF242064A982B1A4" },
      { title: "Microsoft Certified Solutions Associate Windows Server 2016", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/86D3DD0997461F93?sharingId=AF242064A982B1A4" },
      { title: "Microsoft Certified Azure Fundamentals", link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/4C04CB1DEC8717F5?sharingId=AF242064A982B1A4" },
      { title: "ITIL Foundation Certificate in IT Service Management", link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-ITIL.Foundation.Certificate.in.IT.Service.Management.pdf" }
    ]
  }
];

const Certificates = () => {
  return (
    <section id="certificates" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Certificados de Treinamentos, Cursos e Eventos
          </h1>
          <div className="max-w-4xl mx-auto space-y-4 text-muted-foreground text-left md:text-center">
            <p>
              Em minha jornada profissional, ao longo dos anos, tive a incrível oportunidade de participar de diversos cursos, 
              treinamentos, eventos e palestras que moldaram o profissional que sou hoje. Cada certificado conquistado e cada 
              momento de aprendizado foram de imensa importância, não apenas para o meu crescimento na área, mas também para 
              a construção da minha identidade profissional.
            </p>
            <p>
              Cada curso frequentado foi um mergulho em novos conhecimentos, uma chance de aprimorar minhas habilidades e de 
              estar atualizado com as mais recentes tendências da minha área de atuação. As certificações, por sua vez, 
              representam a validação desses conhecimentos adquiridos, sendo um marco importante em minha carreira.
            </p>
            <p>
              Os eventos e palestras que participei me proporcionaram a oportunidade de interagir com profissionais brilhantes, 
              trocar experiências e adquirir insights valiosos. Foram momentos de inspiração que contribuíram significativamente 
              para o meu crescimento profissional e pessoal.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <Accordion type="single" collapsible defaultValue="2025" className="space-y-4">
            {certificatesByYear.map((yearData, index) => (
              <AccordionItem
                key={yearData.year}
                value={yearData.year}
                className="border rounded-lg bg-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{yearData.year}</span>
                    <span className="text-sm text-muted-foreground">
                      ({yearData.certificates.length} certificado{yearData.certificates.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {yearData.certificates.map((cert, certIndex) => (
                      <Card
                        key={certIndex}
                        className="group hover:scale-105 transition-all duration-300 hover:shadow-lg border-primary/20 bg-gradient-to-br from-background to-muted/20"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug mb-2">{cert.title}</p>
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Ver certificado
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed">
                Ao compartilhar essa coleção de certificados, cursos, eventos e palestras, meu objetivo é demonstrar o 
                comprometimento contínuo com o aprendizado e o desenvolvimento. Cada experiência representou um degrau em 
                minha jornada, e todas juntas formam o alicerce sólido sobre o qual construí minha carreira. À medida que 
                continuo avançando, estou ansioso para abraçar novas oportunidades de aprendizado e crescimento. Afinal, 
                a jornada de aprimoramento nunca termina, e estou comprometido em seguir aprendendo, evoluindo e 
                compartilhando o que aprendo com aqueles ao meu redor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
