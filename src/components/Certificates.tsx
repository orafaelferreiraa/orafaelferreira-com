import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, FileCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
interface Certificate {
  title: string;
  link: string;
}
interface YearCertificates {
  year: string;
  certificates: Certificate[];
}
export const certificatesByYear: YearCertificates[] = [{
  year: "2026",
  certificates: [{
       title: "Palestrante da Trilha Software Security, do evento TDC 2026 FLORIANÓPOLIS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-08-PalestranteTDC2026.pdf"
  },{
       title: "2026 Microsoft Most Valuable Professional (MVP)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-07-MVP.pdf"
  },{
       title: "Introduction to Claude Cowork",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Introduction.to.Claude.Cowork.pdf"
  },{
       title: "Claude Code in Action",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Claude.Code.in.Action.pdf"
  },{
       title: "Model Context Protocol: Advanced Topics",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Model.Context.Protocol.Advanced.Topics.pdf"
  },{
       title: "Claude Platform 101",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Claude.Platform.101.pdf"
  },{
       title: "AI Fluency for educators",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-AI.Fluency.for.educators.pdf"
  },{
       title: "AI Fluency for students",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-AI.Fluency.for.students.pdf"
  },{
       title: "AI Fluency: Framework & Foundations",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-AI.Fluency.Framework.%26.Foundations.pdf"
  },{
       title: "AI Capabilities and Limitations",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-AI.Capabilities.and.Limitations.pdf"
  },{
       title: "Introduction to subagents",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Introduction.to.subagents.pdf"
  },{
       title: "Introduction to Model Context Protocol",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Introduction.to.Model.Context.Protocol.pdf"
  },{
       title: "Introduction to agent skills",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Introduction.to.agent.skills.pdf"
  },{
       title: "Claude Code 101",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Claude.Code.101.pdf"
  },{
       title: "Claude 101",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Claude.101.pdf"
  },{
       title: "Azure Kubernetes Service - Orquestração de Containers no AKS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Azure.Kubernetes.Service.-.Orquestra%C3%A7%C3%A3o.de.Containers.no.AKS.pdf"
  },{
       title: "Onboarding: criando cursos na Alura",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2026-Onboarding.criando.cursos.na.Alura.pdf"
  }]
}, {
  year: "2025",
  certificates: [{
       title: "Certified Kubernetes Administrator (CKA)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-12-CKA.pdf"
  }, {
     title: "Ultimate Certified Kubernetes Administrator (CKA) Mock Exam Series",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-12-UltimateCertifiedKubernetesAdministrator(CKA)MockExamSeries.png"
  }, {
    title: "Udemy Labs - Certified Kubernetes Administrator with Practice Tests",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-11-UdemyLabs-CertifiedKubernetesAdministratorwithPracticeTests.pdf"
  }, {
    title: "Certified Kubernetes Administrator (CKA) with Practice Tests",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-Certified.Kubernetes.Administrator.(CKA).with.Practice.Tests.pdf"
  }, {
    title: "Palestrante MVP CONF 2025 Brasil",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-10-PalestranteMVPCONF2025Brasil.pdf"
  }, {
    title: "Palestrante MVP CONF - Curitiba",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-09-PalestranteMVPCONF-Curitiba.pdf"
  }, {
    title: "AZ-700 - Projetar e Implementar Soluções de Rede do Azure",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-AZ-700.-.Projetar.e.Implementar.Solu%C3%A7%C3%B5es.de.Rede.do.Azure.pdf"
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
    title: "Terrafom Associate - TFTec",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-TerrafomAssociate.png"
  }, {
    title: "2025 Microsoft Most Valuable Professional (MVP)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-07-MostValuableProfessionalCertificate.pdf"
  }, {
    title: "Módulo Inteligência Artificial - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-M%C3%B3dulo.Intelig%C3%AAncia.Artificial.-.DevOpsPro.pdf"
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
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-GitHub.Foundations.pdf"
  }, {
    title: "2024 Microsoft Most Valuable Professional (MVP)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-09-MostValuableProfessionalCertificate.pdf"
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
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-Uncomplicating.Soft.Skills.-.LINUXtips.pdf"
  }, {
    title: "Sustainability Transformation With AWS - AWS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-03-SustainabilityTransformationwithAWS.pdf"
  }, {
    title: "Jornada ESG: Carreira em Sustentabilidade - Exame",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-02-Jornada.ESGCarreira.em.Sustentabilidade.pdf"
  }, {
    title: "Green Software for Practitioners LFC131 - The Linux Foundation",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2024-Green.Software.for.Practitioners.LFC131.-.The.Linux.Foundation.pdf"
  }]
}, {
  year: "2023",
  certificates: [{
    title: "Codecon Feature",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-10-codecon.feature.pdf"
  }, {
    title: "Terraform no Azure - Infraestrutura como Código e DevOps - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Terraform.no.Azure.-.Infraestrutura.como.C%C3%B3digo.e.DevOps.-.Udemy.pdf"
  }, {
    title: "Certificação MS-900 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Azure.-.Programa.de.Certifica%C3%A7%C3%A3o.AZ-900.-.TFTEC.pdf"
  }, {
    title: "Mentoria de Carreira e Performance - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Mentoria.de.Carreira.e.Performance.-.TFTEC.pdf"
  }, {
    title: "Trilha DevOps e SRE - TDC 2023 BUSINESS",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-09-Trilha.DevOps.SRE-TDC.2023.BUSINESS.pdf"
  }, {
    title: "Platform Engineer Immersive Experience - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Platform.Engineer.Immersive.Experience.-.LINUXtips.pdf"
  }, {
    title: "Uncomplicating Prometheus - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Uncomplicating.Prometheus.-.LINUXtips.pdf"
  }, {
    title: "Uncomplicating AWS - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Uncomplicating.AWS.-.LINUXtips.pdf"
  }, {
    title: "Uncomplicating Gitlab - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Uncomplicating.Gitlab.-.LINUXtips.pdf"
  }, {
    title: "Imersão DevOps & Cloud - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Imers%C3%A3o.DevOps.%26.Cloud.-.DevOpsPro.pdf"
  }, {
    title: "Trilha Cloud - TDC 2023 INNOVATION",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-06-Trilha.Cloud-TDC.2023.INNOVATION.pdf"
  }, {
    title: "Trilha DevOps e SRE - TDC 2023 INNOVATION",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-06-Trilha.DevOps.SRE-TDC.2023.INNOVATION.pdf"
  }, {
    title: "Uncomplicating Vault - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Uncomplicating.Vault.-.LINUXtips.pdf"
  }, {
    title: "FinOps Certified Practitioner",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-FinOps.Certified.Practitioner.pdf"
  }, {
    title: "Uncomplicating Terraform - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Uncomplicating.Terraform.-.LINUXtips.pdf"
  }, {
    title: "Platform Engineer Summit - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-04-Platform.Engineer.Summit-LINUXtips.pdf"
  }, {
    title: "Oracle Cloud Infrastructure 2022 Certified Foundations Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Oracle.Cloud.Infrastructure.2022.Certified.Foundations.Associate.pdf"
  }, {
    title: "Datadog 101 Site Reliability Engineer",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Datadog.101.Site.Reliability.Engineer.pdf"
  }, {
    title: "Módulo Terraform - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Terraform.-.DevOpsPro.pdf"
  }, {
    title: "DevOps - Mão na Massa! - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-DevOps.-.M%C3%A3o.na.Massa!.-.Udemy.pdf"
  }, {
    title: "Descomplicando o Docker - 2021 - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-03-Descomplicando.Docker-2021-LINUXtips.pdf"
  }, {
    title: "Desafio ArgoCD 101 - LINUXtips",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-03-Desafio.ArgoCD101-LINUXtips.pdf"
  }, {
    title: "Módulo Prometheus - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Prometheus.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Jenkins - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Jenkins.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Kubernetes - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Kubernetes.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Jaeger - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Jaeger.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Grafana Loki - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Grafana.Loki.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Git e Github - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Git.e.Github.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Fundamentos de Linux - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Fundamentos.de.Linux.-.DevOpsPro.pdf"
  }, {
    title: "Módulo Docker - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-M%C3%B3dulo.Docker.-.DevOpsPro.pdf"
  }, {
    title: "Microsoft Certified DevOps Engineer Expert",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Microsoft.Certified.DevOps.Engineer.Expert.pdf"
  }, {
    title: "Jornada DevOps de Elite - DevOpsPro",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-Jornada.DevOps.de.Elite.-.DevOpsPro.pdf"
  }, {
    title: "AZ-400 - Azure DevOps Engineer Expert- TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2023-AZ-400.-.Azure.DevOps.Engineer.Expert-.TFTEC.pdf"
  }]
}, {
  year: "2022",
  certificates: [{
    title: "Copa do Mundo Azure - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-11-Copa.do.Mundo.Azure-TFTEC.pdf"
  }, {
    title: "Docker para Desenvolvedores e Administradores de Redes - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Docker.para.Desenvolvedores.e.Administradores.de.Redes.-.Udemy.pdf"
  }, {
    title: "AWS Certified Cloud Practitioner",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-AWS.Certified.Cloud.Practitioner.pdf"
  }, {
    title: "Microsoft Certified Azure Security Engineer Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Microsoft.Certified.Azure.Security.Engineer.Associate.pdf"
  }, {
    title: "AZ-500 - Azure Security Engineer - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-09-AZ-500-Azure.Security.Engineer-TFTEC.pdf"
  }, {
    title: "AZ-700 - Azure Network Engineer - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-07-AZ-700-Azure.Network.Engineer-TFTEC.pdf"
  }, {
    title: "AZ-204 Developing Solutions for Microsoft Azure - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-AZ-204.Developing.Solutions.for.Microsoft.Azure.-.Udemy.pdf"
  }, {
    title: "Microsoft Certified Azure Solutions Architect Expert",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Microsoft.Certified.Azure.Solutions.Architect.Expert.pdf"
  }, {
    title: "Desafio Azure 2.0 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Desafio.Azure.2.0.-.TFTEC.pdf"
  }, {
    title: "DP 300 Administering Relational Databases Azure DBA - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-DP.300.Administering.Relational.Databases.Azure.DBA.-.Udemy.pdf"
  }, {
    title: "Microsoft Certified Azure Data Fundamentals",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Microsoft.Certified.Azure.Data.Fundamentals.pdf"
  }, {
    title: "SC300 Course Microsoft Identity and Access Administrator - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-SC300.Course.Microsoft.Identity.and.Access.Administrator.-.Udemy.pdf"
  }, {
    title: "Microsoft Certified Identity and Access Administrator Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Microsoft.Certified.Identity.and.Access.Administrator.Associate.pdf"
  }, {
    title: "Azure - Programa de Certificação AZ-304 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Azure.-.Programa.de.Certifica%C3%A7%C3%A3o.AZ-304.-.TFTEC.pdf"
  }, {
    title: "Azure - Programa de Certificação AZ-303 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Azure.-.Programa.de.Certifica%C3%A7%C3%A3o.AZ-303.-.TFTEC.pdf"
  }, {
    title: "Azure - Programa de Certificação AZ-104 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2022-Azure.-.Programa.de.Certifica%C3%A7%C3%A3o.AZ-104.-.TFTEC.pdf"
  }]
}, {
  year: "2021 e anteriores",
  certificates: [{
    title: "Oracle Cloud Infrastructure Foundations 2021 Certified Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Oracle.Cloud.Infrastructure.Foundations.2021.Certified.Associate.pdf"
  }, {
    title: "Microsoft Certified Trainer",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Trainer.pdf"
  }, {
    title: "Microsoft Certified Azure Network Engineer Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Azure.Network.Engineer.Associate.pdf"
  }, {
    title: "Dropsuite - Backup Email, SharePoint, Google Drive, OneDrive - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Dropsuite.-.Backup.Email%2C.SharePoint%2C.Google.Drive%2C.OneDrive.-.Udemy.pdf"
  }, {
    title: "Azure - Programa de Certificação AZ-900 - TFTEC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Azure.-.Programa.de.Certifica%C3%A7%C3%A3o.AZ-900.-.TFTEC.pdf"
  }, {
    title: "Microsoft Certified Security, Compliance, and Identity Fundamentals",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Security%2C.Compliance%2C.and.Identity.Fundamentals.pdf"
  }, {
    title: "Microsoft 365 Certified Fundamentals",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.365.Certified.Fundamentals.pdf"
  }, {
    title: "Administrando o Microsoft Office 365 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Administrando.o.Microsoft.Office.365.-.Udemy.pdf"
  }, {
    title: "Windows Server 2019 do Básico ao Avançado - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Windows.Server.2019.do.B%C3%A1sico.ao.Avan%C3%A7ado.-.Udemy.pdf"
  }, {
    title: "MS 900 Microsoft 365 Fundamentals - Uni Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-08-MS.900.Microsoft.365.Fundamentals-UniAcademy.pdf"
  }, {
    title: "Microsoft Certified Azure Administrator Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Azure.Administrator.Associate.pdf"
  }, {
    title: "Microsoft Azure AZ-104 Azure Administrator + AZ-900 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Azure.AZ-104.Azure.Administrator.%2B.AZ-900.-.Udemy.pdf"
  }, {
    title: "Microsoft Certified Solutions Associate Windows Server 2016",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Solutions.Associate.Windows.Server.2016.pdf"
  }, {
    title: "Bootcamp Analista de Cibersecurity - IGTI",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2020-08-Bootcamp.Analista.Cibersecurity-IGTI.pdf"
  }, {
    title: "Microsoft Certified Azure Fundamentals",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.Certified.Azure.Fundamentals.pdf"
  }, {
    title: "NSE 2 Network Security Associate Fortinet",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2020-05-NSE.2.Network.Security.Associate.Fortinet.pdf"
  }, {
    title: "NSE 1 Network Security Associate Fortinet",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2020-05-NSE.1.Network.Security.Associate.Fortinet.pdf"
  }, {
    title: "Cisco CCNA - Guia Para Iniciantes - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Cisco.CCNA.-.Guia.Para.Iniciantes.-.Udemy.pdf"
  }, {
    title: "MCSA Windows Server 2016 – Exame 70 742 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-MCSA.Windows.Server.2016.%E2%80%93.Exame.70.742.-.Udemy.pdf"
  }, {
    title: "MCSA Windows Server 2016 – Exame 70 741 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-MCSA.Windows.Server.2016.%E2%80%93.Exame.70.741.-.Udemy.pdf"
  }, {
    title: "MCSA Windows Server 2016 - Exame 70 740 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-MCSA.Windows.Server.2016.-.Exame.70.740.-.Udemy.pdf"
  }, {
    title: "Rotas Estáticas IPv4 e IPv6 - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Rotas.Est%C3%A1ticas.IPv4.e.IPv6.-.DlteC.pdf"
  }, {
    title: "RIPv2 - Config e Tshoot - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-RIPv2.-.Config.e.Tshoot.-.DlteC.pdf"
  }, {
    title: "Protocolo OSPF - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Protocolo.OSPF.-.DlteC.pdf"
  }, {
    title: "Protocolo EIGRP - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Protocolo.EIGRP.-.DlteC.pdf"
  }, {
    title: "OSPF - Config e Tshoot - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-OSPF.-.Config.e.Tshoot.-.DlteC.pdf"
  }, {
    title: "Internet - NAT, Proxy e BGP - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Internet.-.NAT%2C.Proxy.e.BGP.-.DlteC.pdf"
  }, {
    title: "EIGRP - Config e Tshoot - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-EIGRP.-.Config.e.Tshoot.-.DlteC.pdf"
  }, {
    title: "Switches Ethernet - Parte II - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Switches.Ethernet.-.Parte.I.-.DlteC.pdf"
  }, {
    title: "Switches Ethernet - Parte I - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Switches.Ethernet.-.Parte.I.-.DlteC.pdf"
  }, {
    title: "Roteamento IP e RIP - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Roteamento.IP.e.RIP.-.DlteC.pdf"
  }, {
    title: "Protocolo Spanning Tree de A a Z - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Protocolo.Spanning.Tree.de.A.a.Z.-.DlteC.pdf"
  }, {
    title: "Microsoft 365 Certified Endpoint Administrator Associate",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Microsoft.365.Certified.Endpoint.Administrator.Associate.pdf"
  }, {
    title: "Windows 10 – Modern Desktop Administrator Associate MD-101 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Windows.10.%E2%80%93.Modern.Desktop.Administrator.Associate.MD-101.-.Udemy.pdf"
  }, {
    title: "Sistemas de Cabeamento Estruturado Avançado - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Sistemas.de.Cabeamento.Estruturado.Avan%C3%A7ado.-.DlteC.pdf"
  }, {
    title: "Sistemas de Cabeamento Estruturado - SCE - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Sistemas.de.Cabeamento.Estruturado.-.SCE.-.DlteC.pdf"
  }, {
    title: "Simuladores de Redes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Simuladores.de.Redes.-.DlteC.pdf"
  }, {
    title: "Redes Ópticas Passivas Avançado - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Redes.%C3%93pticas.Passivas.Avan%C3%A7ado.-.DlteC.pdf"
  }, {
    title: "Redes Ópticas Passivas - PON - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Redes.%C3%93pticas.Passivas.-.PON.-.DlteC.pdf"
  }, {
    title: "Wireless LAN (Redes sem fio) - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Wireless.LAN.(Redes.sem.fio).-.DlteC.pdf"
  }, {
    title: "Ipv6 - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Endere%C3%A7amento.IPv6.e.Sub-redes.-.DlteC.pdf"
  }, {
    title: "Inteligência Artificial Sistemas de Recomendação em Python - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Intelig%C3%AAncia.Artificial.Sistemas.de.Recomenda%C3%A7%C3%A3o.em.Python.-.Udemy.pdf"
  }, {
    title: "Inteligência Artificial para Iniciantes - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Intelig%C3%AAncia.Artificial.para.Iniciantes.-.Udemy.pdf"
  }, {
    title: "Gerenciamento de Redes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Gerenciamento.de.Redes.-.DlteC.pdf"
  }, {
    title: "Endereçamento IPv6 e Sub-redes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Endere%C3%A7amento.IPv6.e.Sub-redes.-.DlteC.pdf"
  }, {
    title: "Redes Completo - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Redes.Completo.-.DlteC.pdf"
  }, {
    title: "ITIL Intermediate Operational Support and Analysis (OSA)",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-ITIL.Intermediate.Operational.Support.and.Analysis.(OSA).pdf"
  }, {
    title: "Itil v3 Foundation 2011 (credenciado) - TI Exames",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Itil.v3.Foundation.2011.(credenciado).-.TI.Exames.pdf"
  }, {
    title: "ITIL Foundation Certificate in IT Service Management",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-ITIL.Foundation.Certificate.in.IT.Service.Management.pdf"
  }, {
    title: "Endpoint Protection 12.1.5 Technical Education Course - Symantec",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2019-07-Endpoint.Protection.12.1.5.Technical.Education.Course-Symantec.pdf"
  }, {
    title: "Windows Server 2019 - Módulo Básico - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Windows.Server.2019.-.M%C3%B3dulo.B%C3%A1sico.-.Udemy.pdf"
  }, {
    title: "Windows 10 Avançado - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Windows.10.Avan%C3%A7ado.-.Udemy.pdf"
  }, {
    title: "Windows 10 – Modern Desktop Administrator Associate MD-100 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Windows.10.%E2%80%93.Modern.Desktop.Administrator.Associate.MD-100.-.Udemy.pdf"
  }, {
    title: "Comunicação via Satélite - Começando (Telecomunicações) - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Comunica%C3%A7%C3%A3o.via.Sat%C3%A9lite.-.Come%C3%A7ando.(Telecomunica%C3%A7%C3%B5es).-.Udemy.pdf"
  }, {
    title: "Série Windows Server Update Services (WSUS) - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-S%C3%A9rie.Windows.Server.Update.Services.(WSUS).-.Udemy.pdf"
  }, {
    title: "Instalando e Configurando o Windows 10 - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Instalando.e.Configurando.o.Windows.10.-.Udemy.pdf"
  }, {
    title: "Cálculo de Sub-Redes Ninja - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-C%C3%A1lculo.de.Sub-Redes.Ninja.-.DlteC.pdf"
  }, {
    title: "Wireshark Para Iniciantes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Wireshark.Para.Iniciantes.-.DlteC.pdf"
  }, {
    title: "Endereçamento IPv4 e Classes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Endere%C3%A7amento.IPv4.e.Classes.-.DlteC.pdf"
  }, {
    title: "Configs de Rede em LinuxWindows - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Configs.de.Rede.em.LinuxWindows.-.DlteC.pdf"
  }, {
    title: "Básico de Redes - DlteC",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-B%C3%A1sico.de.Redes.-.DlteC.pdf"
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
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-ITILv3.-.DlteC.pdf"
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
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-L%C3%B3gica.de.Programa%C3%A7%C3%A3o.e.Algoritmos.em.Java.-.Udemy.pdf"
  }, {
    title: "Introdução Rápida ao Desenvolvimento em HTML5 com JavaScript e CSS3 - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-08-Introdução.rápida.ao.desenvolvimento.em.HTML5.com.JavaScript.CSS3-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Iniciando com TypeScript - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Iniciando.com.TypeScript.-.Udemy.pdf"
  }, {
    title: "Aprenda PHP na Prática - Udemy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Aprenda.PHP.na.Pr%C3%A1tica.-.Udemy.pdf"
  }, {
    title: "Curso Completo de Desenvolvimento Web 2018 - Crie 6 Projetos",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2021-Curso.Completo.de.Desenvolvimento.Web.2018.-.Crie.6.Projetos.pdf"
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
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Fundamentos.de.Rede-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Aprendendo a Programar - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-05-Aprendendo.a.Programar-Microsoft.Virtual.Academy.pdf"
  }, {
    title: "Conceitos Básicos de C# para Iniciantes - Microsoft Virtual Academy",
    link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2017-01-Conceitos.basicos.de.Csharp.para.iniciantes-Microsoft.Virtual.Academy.pdf"
  }]
}];
/* ───────────── Certificate Card ───────────── */
const CertificateCard = ({ cert, index }: { cert: Certificate; index: number }) => {
  const { t } = useTranslation();
  return (
    <a
      href={cert.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-primary/10 bg-card/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.08)] hover:-translate-y-0.5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <FileCheck className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {cert.title}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary/70 group-hover:text-primary transition-colors">
              <ExternalLink className="h-3 w-3" />
              {t("certificates.view")}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

/* ───────────── Year Section ───────────── */
const YearSection = ({ yearData, index }: { yearData: YearCertificates; index: number }) => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08, rootMargin: "-30px" });

  return (
    <div ref={ref} className={`scroll-fade-in ${isVisible ? "visible" : ""}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <AccordionItem
        value={yearData.year}
        className="border border-primary/10 rounded-2xl bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/20"
      >
        <AccordionTrigger className="px-6 py-5 hover:no-underline group/trigger">
          <div className="flex items-center gap-4 w-full">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover/trigger:scale-110">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground">
                {yearData.year}
              </span>
              <Badge variant="secondary" className="bg-primary/[0.07] text-primary/80 text-xs font-medium border border-primary/10">
                {t("certificates.count", { count: yearData.certificates.length })}
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {yearData.certificates.map((cert, certIndex) => (
              <CertificateCard key={certIndex} cert={cert} index={certIndex} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

/* ───────────── Main Component ───────────── */
const Certificates = () => {
  const { t } = useTranslation();


  return (
    <section id="certificates" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative">
        {/* ── Header ── */}
        <div className="mb-12 animate-fade-in text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-foreground">
            {t("certificates.heading")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("certificates.description")}
          </p>
        </div>

        <Separator className="mb-10 opacity-50" />

        {/* ── Accordion timeline ── */}
        <Accordion type="single" collapsible defaultValue="2026" className="space-y-4">
          {certificatesByYear.map((yearData, index) => (
            <YearSection key={yearData.year} yearData={yearData} index={index} />
          ))}
        </Accordion>

        {/* ── Closing message ── */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="relative max-w-3xl mx-auto rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-muted-foreground leading-relaxed">
              {t("certificates.closing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;