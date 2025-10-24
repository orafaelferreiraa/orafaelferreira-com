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
const certificatesByYear: YearCertificates[] = [{
  year: "2025",
  certificates: [{
    title: "AZ-700 - Projetar e Implementar Soluções de Rede do Azure",
    link: "https://www.udemy.com/certificate/UC-49bfc006-aeb5-476d-8083-229aac73cd8f/"
  }, {
    title: "Palestrante Trilha ARQUITETURA CLOUD - TDC 2025 SÃO PAULO",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-09-PalestranteTrilhaARQUITETURACLOUD-TDC2025S%C3%83OPAULO.pdf"
  }, {
    title: "Palestrante Encontro AWS User Group Floripa",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-09-EncontroAWSUserGroupFloripa.pdf"
  }, {
    title: "Palestrante DevOpsDays Curitiba 2025",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-08-PalestranteDevOpsDaysCuritiba2025.pdf"
  }, {
    title: "Palestrante - Hacking na Web Day Florianópolis 2025",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-08-Palestrante-HNWDFlorianopolis2025.pdf"
  }, {
    title: "HashiCorp Certified: Terraform Associate (003)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-HashiCorpCertifiedTerraformAssociate(003).pdf"
  }, {
    title: "2025 Microsoft Most Valuable Professional (MVP)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-MostValuableProfessionalCertificate.pdf.pdf"
  }, {
    title: "DevOps Institute Ambassadors",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf"
  }, {
    title: "Fundamentals of Bicep",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-03-FundamentalsofBicep.pdf"
  }]
}, {
  year: "2024",
  certificates: [{
    title: "Code Island Cloud 2024",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-11-Code.Island.Cloud.2024.pdf"
  }, {
    title: "2º TECH CONNECTION FLORIPA",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-11-2TECHCONNECTIONFLORIPA.png"
  }, {
    title: "Flux CD Mastery: Automating Kubernetes with GitOps - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-10-FluxCDMasteryAutomatingKuberneteswithGitOps-Udemy.pdf"
  }, {
    title: "Imersão Azure - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-10-Imersão.Azure.TFTEC.pdf"
  }, {
    title: "Certification Flow AI Expert – CI&T",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-Certification-FLOW-AI-EXPERT.pdf"
  }, {
    title: "GitHub Foundations",
    link: "https://www.credly.com/badges/da03d2a7-58d7-49cc-af37-37cc055fb1ea/public_url"
  }, {
    title: "2024 Microsoft Most Valuable Professional (MVP)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-MostValuableProfessionalCertificate.pdf"
  }, {
    title: "Participação Codecon-Summit-2024",
    link: "https://eventos.codecon.dev/documentos/imprimir?i=18876251.82968047.6.8.88762518296804768&cc=F48AA107-91D5-4DFB-8918-4F252C79251D"
  }, {
    title: "Instrutor-DP-900",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-Instrutor-dp-900.jpeg"
  }, {
    title: "Security Academy 360",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-08-Security.Academy.360.jpeg"
  }, {
    title: "Agile Essentials - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-08-Agile.Essentials.pdf"
  }, {
    title: "Palestrante da Trilha Arquitetura de Dados - TDC 2024 FLORIANÓPOLIS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-Palestrante-Trilha-Arquitetura-Dados.pdf"
  }, {
    title: "Trilha Cloud - TDC 2024 FLORIANÓPOLIS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-Trilha-Cloud.pdf"
  }, {
    title: "Palestrante Tech Connection Balneario Camburiu",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-Palestrante-Tech-Connection-Balneario-Camburiu.png"
  }, {
    title: "Certification FLOW AI USER Exam – CI&T",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-certification-FLOW-AI-USER-Exam.pdf"
  }, {
    title: "Instrutor-Az-900",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-06-Instrutor-az-900.pdf"
  }, {
    title: "Uncomplicating Soft Skills - LINUXtips",
    link: "https://www.credential.net/29a3afb4-02bb-4b99-b112-b6c12d60f1b9#gs.86vovj"
  }, {
    title: "Sustainability Transformation With AWS - AWS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-03-SustainabilityTransformationwithAWS.pdf"
  }, {
    title: "Jornada ESG: Carreira em Sustentabilidade - Exame",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-02-Jornada.ESGCarreira.em.Sustentabilidade.pdf"
  }, {
    title: "Green Software for Practitioners LFC131 - The Linux Foundation",
    link: "https://www.credly.com/badges/11e2e57b-47a9-48ca-af23-41cbb45c01ef/public_url"
  }]
}, {
  year: "2023",
  certificates: [{
    title: "Codecon Feature",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-10-codecon.feature.pdf"
  }, {
    title: "Terraform no Azure - Infraestrutura como Código e DevOps - Udemy",
    link: "https://www.udemy.com/certificate/UC-188b512a-2690-40ee-a2e9-6a4c96f8090e/"
  }, {
    title: "Certificação MS-900 - TFTEC",
    link: "https://tftec.curseduca.pro/verify/Y2VydGlmaWNhdGVfNzZfMTcx"
  }, {
    title: "Mentoria de Carreira e Performance - TFTEC",
    link: "https://tftec.curseduca.pro/verify/Y2VydGlmaWNhdGVfNzZfMTc0/"
  }, {
    title: "Trilha DevOps e SRE - TDC 2023 BUSINESS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-09-Trilha.DevOps.SRE-TDC.2023.BUSINESS.pdf"
  }, {
    title: "Platform Engineer Immersive Experience - LINUXtips",
    link: "https://www.credential.net/b4feadda-bc7a-4951-8790-ee914b96a498"
  }, {
    title: "Uncomplicating Prometheus - LINUXtips",
    link: "https://www.credential.net/fcdb14d5-0f6d-4fa8-9464-28978e5d1e20"
  }, {
    title: "Uncomplicating AWS - LINUXtips",
    link: "https://www.credential.net/5ffcf2a6-821b-424b-9516-f16303c950b0"
  }, {
    title: "Uncomplicating Gitlab - LINUXtips",
    link: "https://www.credential.net/72e001a4-0060-4736-82ac-b86bd15494b4#gs.01ypty"
  }, {
    title: "Imersão DevOps & Cloud - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar/?cert=d575a80961a7cadea14cee922ff0eaca"
  }, {
    title: "Trilha Cloud - TDC 2023 INNOVATION",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-06-Trilha.Cloud-TDC.2023.INNOVATION.pdf"
  }, {
    title: "Trilha DevOps e SRE - TDC 2023 INNOVATION",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-06-Trilha.DevOps.SRE-TDC.2023.INNOVATION.pdf"
  }, {
    title: "Uncomplicating Vault - LINUXtips",
    link: "https://www.credential.net/fed05764-0c24-4561-8d83-333b6ce2992c"
  }, {
    title: "FinOps Certified Practitioner",
    link: "https://www.credly.com/badges/d77d284c-7992-4721-bc6f-e21df5183743/public_url"
  }, {
    title: "Uncomplicating Terraform - LINUXtips",
    link: "https://www.credential.net/8f101780-6520-4a93-8c88-866ff0aa65ed"
  }, {
    title: "Platform Engineer Summit - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-04-Platform.Engineer.Summit-LINUXtips.pdf"
  }, {
    title: "Oracle Cloud Infrastructure 2022 Certified Foundations Associate",
    link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=365D1B70B834CA0B784AFB708251CE1BCEFF94359157DBAD207ECBA047C5D46E"
  }, {
    title: "Datadog 101 Site Reliability Engineer",
    link: "https://learn.datadoghq.com/certificates/5vrddgjysf"
  }, {
    title: "Módulo Terraform - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=9e2af090318c002073bfb337bac1e302"
  }, {
    title: "DevOps - Mão na Massa! - Udemy",
    link: "https://www.udemy.com/certificate/UC-a142e93c-0cb6-438d-832f-436846859d8c/"
  }, {
    title: "Descomplicando o Docker - 2021 - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-03-Descomplicando.Docker-2021-LINUXtips.pdf/"
  }, {
    title: "Desafio ArgoCD 101 - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-03-Desafio.ArgoCD101-LINUXtips.pdf"
  }, {
    title: "Módulo Prometheus - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=c1359149f5ad5adcaebddac21b519bf9"
  }, {
    title: "Módulo Jenkins - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=d523ef4c23da0a5e31af38dbc60452ac"
  }, {
    title: "Módulo Kubernetes - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=03a08a1279f0a008612897c52a01358d"
  }, {
    title: "Módulo Jaeger - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=2342d8fe648b0caf0dd7893808d47b98"
  }, {
    title: "Módulo Introdução a DevOps - DevOpsPro",
    link: "https://www.udemy.com/"
  }, {
    title: "Módulo Grafana Loki - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=c1359149f5ad5adcaebddac21b519bf9"
  }, {
    title: "Módulo Git e Github - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=308999419601c5cfe0ca0298879f77e9"
  }, {
    title: "Módulo Fundamentos de Linux - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=a4bc2683df1eb93f97bc548323902829"
  }, {
    title: "Módulo Docker - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=8296eb59078b54c38b84757b6a550e2a"
  }, {
    title: "Microsoft Certified DevOps Engineer Expert",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/EA24867B521F82D8?sharingId=AF242064A982B1A4"
  }, {
    title: "Jornada DevOps de Elite - DevOpsPro",
    link: "https://gerarcertificado.com.br/validar.php?cert=8eddc0f24ba261589d77aaf5b9a7d0ed"
  }, {
    title: "AZ-400 - Azure DevOps Engineer Expert- TFTEC",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/EA24867B521F82D8?sharingId=AF242064A982B1A4"
  }]
}, {
  year: "2022",
  certificates: [{
    title: "Copa do Mundo Azure - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-11-Copa.do.Mundo.Azure-TFTEC.pdf"
  }, {
    title: "Docker para Desenvolvedores e Administradores de Redes - Udemy",
    link: "https://www.udemy.com/certificate/UC-a40bd06b-eff2-44e1-b5d7-20fabbd2bcbd/"
  }, {
    title: "AWS Certified Cloud Practitioner",
    link: "https://www.credly.com/badges/cc2090a8-2445-4cee-ba0a-ef398c636f33/linked_in_profile"
  }, {
    title: "Microsoft Certified Azure Security Engineer Associate",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/F760B4A83F6D292C?sharingId=AF242064A982B1A4"
  }, {
    title: "AZ-500 - Azure Security Engineer - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-09-AZ-500-Azure.Security.Engineer-TFTEC.pdf"
  }, {
    title: "AZ-700 - Azure Network Engineer - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-07-AZ-700-Azure.Network.Engineer-TFTEC.pdf"
  }, {
    title: "AZ-204 Developing Solutions for Microsoft Azure - Udemy",
    link: "https://www.udemy.com/certificate/UC-4a7510b6-416a-4401-ad99-c3f558ce6bed/"
  }, {
    title: "Microsoft Certified Azure Solutions Architect Expert",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/ECCBB4FB7DF76876?sharingId=AF242064A982B1A4"
  }, {
    title: "Desafio Azure 2.0 - TFTEC",
    link: "https://ead.tftec.com.br/verificar/qGLzG3bYoh/"
  }, {
    title: "DP 300 Administering Relational Databases Azure DBA - Udemy",
    link: "https://www.udemy.com/certificate/UC-57a7fb9b-6719-4efa-949a-80c3310cdd78/"
  }, {
    title: "Microsoft Certified Azure Data Fundamentals",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/AAA6537164EF3CD0?sharingId=AF242064A982B1A4"
  }, {
    title: "SC300 Course Microsoft Identity and Access Administrator - Udemy",
    link: "https://www.udemy.com/certificate/UC-53878b1d-c0b7-4884-ac50-2534360f8678/"
  }, {
    title: "Microsoft Certified Identity and Access Administrator Associate",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/D1E6BECF41B59C4?sharingId=AF242064A982B1A4"
  }, {
    title: "Azure - Programa de Certificação AZ-304 - TFTEC",
    link: "https://ead.tftec.com.br/verificar/TiZbkKz8Hn/"
  }, {
    title: "Azure - Programa de Certificação AZ-303 - TFTEC",
    link: "https://ead.tftec.com.br/verificar/zq8SX2AviR/"
  }, {
    title: "Azure - Programa de Certificação AZ-104 - TFTEC",
    link: "https://ead.tftec.com.br/verificar/wu3DLnvVbw/"
  }]
}, {
  year: "2021 e anteriores",
  certificates: [{
    title: "Oracle Cloud Infrastructure Foundations 2021 Certified Associate",
    link: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=20C72DE3B042CFAA43CF954993954CA8843A72C33E3C9F5283BDC4EE0C07055C"
  }, {
    title: "Microsoft Certified Trainer",
    link: "https://www.credly.com/badges/9f76b758-5134-4dbb-b138-35c61e7b4cbe/public_url"
  }, {
    title: "Microsoft Certified Azure Network Engineer Associate",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/BE1DAD21D266E213?sharingId=AF242064A982B1A4"
  }, {
    title: "Dropsuite - Backup Email, SharePoint, Google Drive, OneDrive - Udemy",
    link: "https://www.udemy.com/certificate/UC-f1e4cbc4-b985-4519-95bc-cc8be336233a/"
  }, {
    title: "Azure - Programa de Certificação AZ-900 - TFTEC",
    link: "https://ead.tftec.com.br/verificar/c1w1AYStJA/"
  }, {
    title: "Microsoft Certified Security, Compliance, and Identity Fundamentals",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/417A92FCA9FEB6DA?sharingId=AF242064A982B1A4"
  }, {
    title: "Microsoft 365 Certified Fundamentals",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/86D3DD0997461F93?sharingId=AF242064A982B1A4"
  }, {
    title: "Administrando o Microsoft Office 365 - Udemy",
    link: "https://www.udemy.com/certificate/UC-75c4576f-4df3-4973-a6cb-c9efdaaead0a/"
  }, {
    title: "Windows Server 2019 do Básico ao Avançado - Udemy",
    link: "https://www.udemy.com/certificate/UC-35d398d4-e5b5-440e-8f3e-564bbd044ccb/"
  }, {
    title: "MS 900 Microsoft 365 Fundamentals - Uni Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-08-MS.900.Microsoft.365.Fundamentals-UniAcademy.pdf"
  }, {
    title: "Microsoft Certified Azure Administrator Associate",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/13E2C5603C9C68C?sharingId=AF242064A982B1A4"
  }, {
    title: "Microsoft Azure AZ-104 Azure Administrator + AZ-900 - Udemy",
    link: "https://www.udemy.com/certificate/UC-a8a0cde3-2715-4627-ad44-1f06524fef90/"
  }, {
    title: "Microsoft Certified Solutions Associate Windows Server 2016",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/86D3DD0997461F93?sharingId=AF242064A982B1A4"
  }, {
    title: "Bootcamp Analista de Cibersecurity - IGTI",
    link: "https://www.udemy.com/"
  }, {
    title: "Microsoft Certified Azure Fundamentals",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/4C04CB1DEC8717F5?sharingId=AF242064A982B1A4"
  }, {
    title: "NSE 2 Network Security Associate Fortinet",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2020-05-NSE.2.Network.Security.Associate.Fortinet.pdf"
  }, {
    title: "NSE 1 Network Security Associate Fortinet",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2020-05-NSE.1.Network.Security.Associate.Fortinet.pdf"
  }, {
    title: "Cisco CCNA - Guia Para Iniciantes - Udemy",
    link: "https://www.udemy.com/certificate/UC-1d01ec18-2e36-4678-a7e8-1dc1bcd92292/"
  }, {
    title: "MCSA Windows Server 2016 – Exame 70 742 - Udemy",
    link: "https://www.udemy.com/certificate/UC-790ec924-55d1-4914-8fdb-cfbaa7c72784/"
  }, {
    title: "MCSA Windows Server 2016 – Exame 70 741 - Udemy",
    link: "https://www.udemy.com/certificate/UC-ba4cf474-9ca4-4e26-aa60-81ad19487fbd/"
  }, {
    title: "MCSA Windows Server 2016 - Exame 70 740 - Udemy",
    link: "https://www.udemy.com/certificate/UC-c1f3c2c0-1eff-416c-bda5-aa4e90357a24/"
  }, {
    title: "Rotas Estáticas IPv4 e IPv6 - DlteC",
    link: "https://www.dltec.com.br/painel/curso/48/certificado"
  }, {
    title: "RIPv2 - Config e Tshoot - DlteC",
    link: "https://www.dltec.com.br/painel/curso/49/certificado"
  }, {
    title: "Protocolo OSPF - DlteC",
    link: "https://www.dltec.com.br/painel/curso/46/certificado"
  }, {
    title: "Protocolo EIGRP - DlteC",
    link: "https://www.dltec.com.br/painel/curso/45/certificado"
  }, {
    title: "OSPF - Config e Tshoot - DlteC",
    link: "https://www.dltec.com.br/painel/curso/51/certificado"
  }, {
    title: "Internet - NAT, Proxy e BGP - DlteC",
    link: "https://www.dltec.com.br/painel/curso/47/certificado"
  }, {
    title: "EIGRP - Config e Tshoot - DlteC",
    link: "https://www.dltec.com.br/painel/curso/50/certificado"
  }, {
    title: "Switches Ethernet - Parte II - DlteC",
    link: "https://www.dltec.com.br/painel/curso/61/certificado"
  }, {
    title: "Switches Ethernet - Parte I - DlteC",
    link: "https://www.dltec.com.br/painel/curso/60/certificado"
  }, {
    title: "Roteamento IP e RIP - DlteC",
    link: "https://www.dltec.com.br/painel/curso/44/certificado"
  }, {
    title: "Protocolo Spanning Tree de A a Z - DlteC",
    link: "https://www.dltec.com.br/painel/curso/62/certificado"
  }, {
    title: "Microsoft 365 Certified Endpoint Administrator Associate",
    link: "https://learn.microsoft.com/api/credentials/share/en-us/rafaferreira11/73B0C88124A23C32?sharingId=AF242064A982B1A4"
  }, {
    title: "Windows 10 – Modern Desktop Administrator Associate MD-101 - Udemy",
    link: "https://www.udemy.com/certificate/UC-F049DD9K/"
  }, {
    title: "Sistemas de Cabeamento Estruturado Avançado - DlteC",
    link: "https://www.dltec.com.br/painel/curso/69/certificado"
  }, {
    title: "Sistemas de Cabeamento Estruturado - SCE - DlteC",
    link: "https://www.dltec.com.br/painel/curso/66/certificado"
  }, {
    title: "Simuladores de Redes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/23/certificado"
  }, {
    title: "Redes Ópticas Passivas Avançado - DlteC",
    link: "https://www.dltec.com.br/painel/curso/68/certificado"
  }, {
    title: "Redes Ópticas Passivas - PON - DlteC",
    link: "https://www.dltec.com.br/painel/curso/67/certificado"
  }, {
    title: "Wireless LAN (Redes sem fio) - DlteC",
    link: "https://www.dltec.com.br/painel/curso/70/certificado"
  }, {
    title: "Ipv6 - DlteC",
    link: "https://www.dltec.com.br/painel/curso/5/certificado"
  }, {
    title: "Inteligência Artificial Sistemas de Recomendação em Python - Udemy",
    link: "https://www.udemy.com/certificate/UC-DJP8QBRA/"
  }, {
    title: "Inteligência Artificial para Iniciantes - Udemy",
    link: "https://www.udemy.com/certificate/UC-7B3FSR2T/"
  }, {
    title: "Gerenciamento de Redes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/71/certificado"
  }, {
    title: "Endereçamento IPv6 e Sub-redes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/59/certificado"
  }, {
    title: "Redes Completo - DlteC",
    link: "https://www.dltec.com.br/painel/curso/4/certificado"
  }, {
    title: "ITIL Intermediate Operational Support and Analysis (OSA)",
    link: "https://tiexames.com.br/novoensino/certificado_pdf.php?COD=LzBsLzQvc3ovajRubGdDaXhmb2VhUT09&COD_CURSO=85"
  }, {
    title: "Itil v3 Foundation 2011 (credenciado) - TI Exames",
    link: "https://tiexames.com.br/novoensino/certificado_pdf.php?COD=S3lJUXNGemI3WDdwUHlXc0k3cGtTUT09&COD_CURSO=53"
  }, {
    title: "ITIL Foundation Certificate in IT Service Management",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-ITIL.Foundation.Certificate.in.IT.Service.Management.pdf"
  }, {
    title: "Endpoint Protection 12.1.5 Technical Education Course - Symantec",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-Endpoint.Protection.12.1.5.Technical.Education.Course-Symantec.pdf"
  }, {
    title: "Windows Server 2019 - Módulo Básico - Udemy",
    link: "https://www.udemy.com/certificate/UC-JXIPT2F1/"
  }, {
    title: "Windows 10 Avançado - Udemy",
    link: "https://www.udemy.com/certificate/UC-EYICAJRI/"
  }, {
    title: "Windows 10 – Modern Desktop Administrator Associate MD-100 - Udemy",
    link: "https://www.udemy.com/certificate/UC-FMI38M23/"
  }, {
    title: "Comunicação via Satélite - Começando (Telecomunicações) - Udemy",
    link: "https://www.udemy.com/certificate/UC-XWP6001Y/"
  }, {
    title: "Série Windows Server Update Services (WSUS) - Udemy",
    link: "https://www.udemy.com/certificate/UC-LNPZ2JFX/"
  }, {
    title: "Instalando e Configurando o Windows 10 - Udemy",
    link: "https://www.udemy.com/certificate/UC-H03OG7T6/"
  }, {
    title: "Cálculo de Sub-Redes Ninja - DlteC",
    link: "https://www.dltec.com.br/painel/curso/41/certificado"
  }, {
    title: "Wireshark Para Iniciantes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/42/certificado"
  }, {
    title: "Endereçamento IPv4 e Classes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/40/certificado"
  }, {
    title: "Configs de Rede em LinuxWindows - DlteC",
    link: "https://www.dltec.com.br/painel/curso/53/certificado"
  }, {
    title: "Básico de Redes - DlteC",
    link: "https://www.dltec.com.br/painel/curso/2/certificado"
  }, {
    title: "Preparatório para Exame 70-697 Configuring Windows Devices - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Preparatório.para.exame.70-697.Configuring.Windows.Devices-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Microsoft Azure Big Data and Business Analytics - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Microsoft.Azure.Big.Data.and.Business.Analytics-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Introdução em Inteligência Artificial - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Introdução.em.Inteligência.Artificial-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Introdução em Data Science - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Introdução.em.Data.Science-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Docker – Conceitos e Prática - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Docker–Conceitos.prática-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Azure Data Analytics para Programadores - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-01-Azure.Data.Analytics.para.programadores-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "ITILv3 - DlteC",
    link: "https://www.dltec.com.br/painel/curso/35/certificado"
  }, {
    title: "VIII Jornada - Universidade do Sagrado Coração",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-05-VIII.JORNADA-Universidade.do.Sagrado.Coracao.pdf"
  }, {
    title: "Python Fundamentos para Análise de Dados - Data Science Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-01-Python.Fundamentos.para.Análise.de.Dados-Data.Science.Academy.pdf"
  }, {
    title: "Introdução em Bots - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-01-Introdução.em.Bots-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Introdução à Ciência de Dados - Data Science Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-01-Introdução.Ciência.de.Dados-Data.Science.Academy.pdf"
  }, {
    title: "Big Data Fundamentos 2.0 - Data Science Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-01-Big.Data.Fundamentos.2.0-Data.Science.Academy.pdf"
  }, {
    title: "Big Data Fundamentos - Data Science Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2018-01-Big.Data.Fundamentos-Data.Science.Academy.pdf"
  }, {
    title: "Palestra sobre Liderança e Gestão de Pessoas - Finch",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-10-Palestra.sobre.Liderança.Gestão.de.Pessoas-Finch.pdf"
  }, {
    title: "Lógica de Programação e Algoritmos em Java - Udemy",
    link: "https://www.udemy.com/certificate/UC-7VA51MIQ/"
  }, {
    title: "Introdução Rápida ao Desenvolvimento em HTML5 com JavaScript e CSS3 - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-08-Introdução.rápida.ao.desenvolvimento.em.HTML5.com.JavaScript.CSS3-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Iniciando com TypeScript - Udemy",
    link: "https://www.udemy.com/certificate/UC-I4NR2U3X/"
  }, {
    title: "Aprenda PHP na Prática - Udemy",
    link: "https://www.udemy.com/certificate/UC-FA1GDKWP/"
  }, {
    title: "Curso Completo de Desenvolvimento Web 2018 - Crie 6 Projetos",
    link: "https://www.udemy.com/certificate/UC-MJFS4HMW/"
  }, {
    title: "Desenvolvimento de Jogos com Unity para Windows 8 e Windows Phone 8 – Introdução - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-07-Desenvolvimento.de.jogos.com.Unity.para.Windows.8.Windows.Phone.8–Introdução-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Curso de POO Java - CursoEmVideo",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-07-Curso.de.POO.Java-CursoEmVideo.pdf"
  }, {
    title: "SQL Completo - Softblue",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-06-SQL.Completo-Softblue.pdf"
  }, {
    title: "Lógica de Programação - Softblue",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-06-Lógica.de.Programação-Softblue.pdf"
  }, {
    title: "Xamarin para Iniciantes Absolutos - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Xamarin.para.Iniciantes.absolutos-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Treinamento de ASP.NET MVC 5 Conceitos Básicos - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Treinamento.de.ASP.NET.MVC.5.Conceitos.Básicos-.Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Novidades da Unity 5 - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Novidades.da.Unity.5-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Introdução ao Xamarin - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Introdução.ao.Xamarin-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Introdução ao JSON com C# - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Introdução.ao.JSON.com.Csharp-Microsoft.VirtualAcademy.pdf"
  }, {
    title: "Iniciando com Xamarin.Forms - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Iniciando.com.Xamarin.Forms-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Fundamentos de Rede - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-01-Conceitos.basicos.de.Csharp.para.iniciantes-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Aprendendo a Programar - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Aprendendo.a.Programar-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Conceitos Básicos de C# para Iniciantes - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-01-Conceitos.basicos.de.Csharp.para.iniciantes-Microsoft.Virtual.Academy.pdf"
  }]
}];
const Certificates = () => {
  return <section id="certificates" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Certificados de Treinamentos, Cursos e Eventos
          </h1>
        </div>

        <div className="mb-12">
          <Accordion type="single" collapsible defaultValue="2025" className="space-y-4">
            {certificatesByYear.map((yearData, index) => <AccordionItem key={yearData.year} value={yearData.year} className="border rounded-lg bg-card animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
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
                    {yearData.certificates.map((cert, certIndex) => <Card key={certIndex} className="group hover:scale-105 transition-all duration-300 hover:shadow-lg border-primary/20 bg-gradient-to-br from-background to-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug mb-2">{cert.title}</p>
                              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                <ExternalLink className="h-3 w-3" />
                                Ver certificado
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </AccordionContent>
              </AccordionItem>)}
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
    </section>;
};
export default Certificates;