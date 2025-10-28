import { Shield, Award, GraduationCap, Cloud, Server, Database, Terminal, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Certification {
  name: string;
  code?: string;
  image: string;
  link: string;
  provider: string;
}

const certifications: Certification[] = [
  {
    name: "HashiCorp Certified: Terraform Associate (003)",
    provider: "HashiCorp",
    image: "https://images.credly.com/size/340x340/images/0dc62494-dc94-469a-83af-e35309f27356/blob",
    link: "https://www.credly.com/badges/a2363246-1248-4028-a237-79b965fbcef3/public_url"
  },
  {
    name: "Microsoft Certified: DevOps Engineer Expert",
    code: "AZ-400",
    provider: "Microsoft",
    image: "https://images.credly.com/size/118x118/images/c3ab66f8-5d59-4afa-a6c2-0ba30a1989ca/CERT-Expert-DevOps-Engineer-600x600.png",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/EA24867B521F82D8?sharingId=AF242064A982B1A4"
  },
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    code: "AZ-305",
    provider: "Microsoft",
    image: "https://images.credly.com/size/118x118/images/987adb7e-49be-4e24-b67e-55986bd3fe66/azure-solutions-architect-expert-600x600.png",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/ECCBB4FB7DF76876?sharingId=AF242064A982B1A4"
  },
  {
    name: "MCSA: Windows Server 2016",
    provider: "Microsoft",
    image: "https://images.credly.com/size/104x104/images/ebc901fb-d403-4598-bfb7-da80289afdbd/MCSA-Windows_Server_2016-600x600.png",
    link: "https://www.credly.com/badges/3ee2d513-7c99-4961-9029-9a8f57c2fc59/public_url"
  },
  {
    name: "Microsoft Certified Trainer 2023-2024",
    provider: "Microsoft",
    image: "https://images.credly.com/size/104x104/images/fd6bb2af-2f05-4d9b-a23e-39f8e309a82d/image.png",
    link: "https://www.credly.com/badges/9f76b758-5134-4dbb-b138-35c61e7b4cbe/public_url"
  },
  {
    name: "Microsoft Certified: Azure Security Engineer Associate",
    code: "AZ-500",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/1ad16b6f-2c71-4a2e-ae74-ec69c4766039/azure-security-engineer-associate600x600.png",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/F760B4A83F6D292C?sharingId=AF242064A982B1A4"
  },
  {
    name: "Microsoft Certified: Azure Network Engineer Associate",
    code: "AZ-700",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/c3a2e51d-7984-48cc-a4cb-88d4e8487037/azure-network-engineer-associate-600x600.png",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/BE1DAD21D266E213?sharingId=AF242064A982B1A4"
  },
  {
    name: "Microsoft Certified: Azure Administrator Associate",
    code: "AZ-104",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/336eebfc-0ac3-4553-9a67-b402f491f185/azure-administrator-associate-600x600.png",
    link: "https://www.credly.com/badges/b1855e31-b3f7-4b11-a8a0-bce0b1e5744a/public_url"
  },
  {
    name: "Microsoft Certified: Identity and Access Administrator Associate",
    code: "SC-300",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/91295436-0704-4b98-8e1a-ef5f937bda21/identity-and-access-administrator-associate-600x600.png",
    link: "https://www.credly.com/badges/5d8c1270-be3f-4fd2-a7df-d7cd6f030b05/public_url"
  },
  {
    name: "Microsoft 365 Certified: Endpoint Administrator Associate",
    code: "MD-102",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/dbc3530b-af8c-4fa1-8d9c-cdfbd9edf462/microsoft365-modern-desktop-administrator-associate-600x600.png",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/73B0C88124A23C32?sharingId=AF242064A982B1A4"
  },
  {
    name: "GitHub Foundations",
    provider: "GitHub",
    image: "https://images.credly.com/size/112x112/images/024d0122-724d-4c5a-bd83-cfe3c4b7a073/image.png",
    link: "https://www.credly.com/badges/da03d2a7-58d7-49cc-af37-37cc055fb1ea/public_url"
  },
  {
    name: "Microsoft Certified: Security, Compliance, and Identity Fundamentals",
    code: "SC-900",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/fc1352af-87fa-4947-ba54-398a0e63322e/security-compliance-and-identity-fundamentals-600x600.png",
    link: "https://www.credly.com/badges/c6060f7e-32fd-4006-851f-1e46a566234d/public_url"
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    code: "AZ-900",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png",
    link: "https://www.credly.com/badges/39a0fb81-c702-4235-a2d4-4e28ad7651ea/public_url"
  },
  {
    name: "Microsoft Certified: Azure Data Fundamentals",
    code: "DP-900",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/70eb1e3f-d4de-4377-a062-b20fb29594ea/azure-data-fundamentals-600x600.png",
    link: "https://www.credly.com/badges/03eb9d53-60cf-48ff-851d-868b5815f147/public_url"
  },
  {
    name: "Microsoft 365 Certified: Fundamentals",
    code: "MS-900",
    provider: "Microsoft",
    image: "https://images.credly.com/size/112x112/images/0c6d9839-f468-4adc-987d-5cfae4a9ee67/image.png",
    link: "https://www.credly.com/badges/a66bba22-3ec0-4812-9521-fde9d60c12dd/public_url"
  },
  {
    name: "AWS Certified Cloud Practitioner",
    provider: "AWS",
    image: "https://images.credly.com/size/112x112/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png",
    link: "https://www.credly.com/badges/cc2090a8-2445-4cee-ba0a-ef398c636f33/public_url"
  },
  {
    name: "Oracle Cloud Infrastructure 2022 Certified Foundations Associate",
    provider: "Oracle",
    image: "https://brm-workforce.oracle.com/pdf/certview/images/OCIF2022CA.png",
    link: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=365D1B70B834CA0B784AFB708251CE1BCEFF94359157DBAD207ECBA047C5D46E"
  },
  {
    name: "FOCP: FinOps Certified Practitioner",
    provider: "FinOps Foundation",
    image: "https://images.credly.com/size/112x112/images/08a5010a-0c0a-448c-981e-c116fedd380c/image.png",
    link: "https://www.credly.com/badges/d77d284c-7992-4721-bc6f-e21df5183743/public_url"
  },
  {
    name: "ITIL v3 Foundation",
    provider: "AXELOS",
    image: "https://images.credly.com/size/88x88/images/6c9b2a4b-91d5-4093-919a-7eb81cfe74ba/ITIL_Foundation.png",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-ITIL.Foundation.Certificate.in.IT.Service.Management.pdf"
  }
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Minhas Certificações
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Certificações são marcos importantes na minha jornada profissional. Elas representam o compromisso com a excelência 
            e a busca constante por conhecimento. Aqui estão algumas das certificações que conquistei ao longo dos anos, 
            cada uma delas refletindo o desejo de me aprimorar e oferecer o melhor em cada projeto. 
            
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-primary/20 bg-gradient-to-br from-background to-muted/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
                <CardTitle className="text-base text-center leading-tight min-h-[3rem] flex items-center justify-center">
                  {cert.name}
                </CardTitle>
                {cert.code && (
                  <CardDescription className="text-center font-mono text-xs">
                    {cert.code}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{cert.provider}</span>
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verificar
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certifications;
