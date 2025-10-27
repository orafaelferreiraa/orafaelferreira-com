import { Presentation, ExternalLink, Calendar, MapPin, Youtube, Linkedin, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Talk {
  title: string;
  event: string;
  date: string;
  location: string;
  image?: string;
  siteUrl?: string;
  linkedinUrl?: string;
  slidesUrl?: string;
  videoUrl?: string;
  blogUrl?: string;
}

const Talks = () => {
  const upcomingTalks: Talk[] = [
    {
      title: "GreenOps: Da Fundação à Inovação Sustentável na Cloud Azure",
      event: "MVP Conf SP",
      date: "2025-10-26",
      location: "São Paulo, SP",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/mvp25/01.png",
      siteUrl: "https://mvpconf.com.br/",
    },
    {
      title: "Como aplicar Segurança em Camadas na sua arquitetura Cloud Native com Open Source",
      event: "DevOpsDays Porto Alegre 2025",
      date: "2025-11-29",
      location: "Porto Alegre, RS",
      siteUrl: "https://devopsdays.org/events/2025-porto-alegre/welcome/",
    },
  ];

  const inPersonTalks: Talk[] = [
    {
      title: "Antes de Estudar Ferramentas, bora entender Sobre a cultura DevOps",
      event: "8ª Edição Cultura DevOps - White Stone Dev Pedra Branca",
      date: "2025-10-02",
      location: "Pedra Branca, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/wsd-devops/01.png",
      siteUrl: "https://whitestonedev.com.br/#/eventos/8edicao",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_whitestonedev-meetup-cultura-devops-activity-7376941063523106818-xC-n",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/dod-wsd.pdf",
      blogUrl: "https://orafaelferreira.com/posts/wsd-devops/",
    },
    {
      title: "DevOps além da hype: Pessoas, cultura e prática",
      event: "Esquenta MVP CONF - Curitiba",
      date: "2025-09-27",
      location: "Curitiba, PR",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/EsquentaMVPCuritiba/EsquentaMVPCuritiba.png",
      siteUrl: "https://www.hubingressos.com.br/evento/mvpconfcuritiba",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_mvpconf2025-esquentamvpconf-curitiba-activity-7371148321295503360-lnq1",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/mvpcrtb25.pdf",
      blogUrl: "https://orafaelferreira.com/posts/mvp-crtb/",
    },
    {
      title: "GreenOps na Cloud: Arquitetando um Futuro Sustentável",
      event: "TDC São Paulo - Trilha ARQUITETURA CLOUD",
      date: "2025-09-17",
      location: "São Paulo, SP",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/TDCSP25/01.png",
      siteUrl: "https://thedevconf.com/tdc/2025/sao-paulo/trilha-arquitetura-cloud",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_greenops-devops-cloudcomputing-activity-7363895133244637186-TJTO",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/tdc-greenops-25.pdf",
      blogUrl: "https://orafaelferreira.com/posts/tdc-greenops/",
    },
    {
      title: "Explorando a cultura DevOps: Por que tanto se fala de cultura por trás da entrega contínua?",
      event: "Encontro AWS User Group Floripa + DevOps Floripa",
      date: "2025-09-03",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/EncontroDOD/01.jpeg",
      siteUrl: "https://www.meetup.com/aws-user-group-floripa/events/310698392/",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_no-pr%C3%B3ximo-0309-vou-estar-no-audit%C3%B3rio-da-activity-7368611769486864386-6CjO",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/dod-meetup25.pdf",
      blogUrl: "https://orafaelferreira.com/posts/dod-meetupaws/",
    },
    {
      title: "DevOps Além da Hype: Pessoas, Cultura e Prática",
      event: "DevOpsDays Curitiba 2025",
      date: "2025-08-30",
      location: "Curitiba, PR",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/DOD-Curitiba/1.png",
      siteUrl: "https://devopsdays.org/events/2025-curitiba/welcome/",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_devopsdayscuritiba-devops-teamtopologies-activity-7363170324114300930-K1WS",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/DevOps-CRTB.pdf",
      blogUrl: "https://orafaelferreira.com/posts/dod-crtb25/",
    },
    {
      title: "Cloud Moderna ANTI Ataque: blindagem DevOps que você PRECISA conhecer",
      event: "HNWD Florianópolis 2025",
      date: "2025-08-16",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/HNWD/1.jpeg",
      siteUrl: "https://www.sympla.com.br/evento/hnwd-florianopolis-2025/2960275",
      linkedinUrl: "https://www.linkedin.com/posts/orafaelferreiraa_hnwd-hnwd25-hnwdsc-activity-7358096889168154624-AeFY",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/CloudModernaANTIAtaque.pdf",
      blogUrl: "https://orafaelferreira.com/posts/hack/",
    },
    {
      title: "Os 6Rs que Você Precisa Conhecer para Migrar para a Cloud; O sétimo R é de Rivotril?!",
      event: "Esquenta MVP Conf Blumenau",
      date: "2025-04-26",
      location: "Blumenau, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/mvpconfblu24/01.jpeg",
      siteUrl: "https://www.hubingressos.com.br/evento/mvpconfb",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_esquentamvp-azure-cloudcomputing-activity-7320416693091024898-RaLI",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/mvp-conf.pdf",
      blogUrl: "https://orafaelferreira.com/posts/mvp-conf-blu/",
    },
    {
      title: "Pipelines com Azure DevOps: Automatizando o Provisionamento Seguro da sua infraestrutura na nuvem",
      event: "SQL Saturday 2025 by Comunidado",
      date: "2025-04-05",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sqlsaturday/01.jpg",
      siteUrl: "https://sqlsaturday.com/2025-04-05-sqlsaturday1104/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_azuredevops-sqlsaturday-techbr-activity-7313160824561270785-EQtM",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/SQLSaturday.pdf",
      blogUrl: "https://orafaelferreira.com/posts/sqlsat25/",
    },
    {
      title: "Pipelines com Azure DevOps: Automatizando o (im)possível",
      event: "Code Island Cloud 2024",
      date: "2024-11-23",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/code.island/0.jpg",
      siteUrl: "https://cloud.codeisland.com.br/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_ol%C3%A1-pessoal-estarei-palestrando-na-code-activity-7262434108855767041-Ky8U",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/code.island.pdf",
      blogUrl: "https://orafaelferreira.com/posts/code.island24/",
    },
    {
      title: "Estratégias de Cloud Foundation em Larga Escala: Garantindo que Você Não Retorne para On-Premise",
      event: "Tech Connection Floripa 2 Edição",
      date: "2024-11-09",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/tc.floripa.2024/1.jpeg",
      siteUrl: "https://talkfloripa.com.br/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_techconnection2024-palestra-cloudcomputing-activity-7259897365203959809-ZGW4",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/TC-Floripa.pdf",
      blogUrl: "https://orafaelferreira.com/posts/tc-floripa24/",
    },
    {
      title: "Architecting a Secure Landing Zone for AI Workloads in the Cloud",
      event: "MVP TALKS CI&T",
      date: "2024-10-24",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/mvp.talks/1.png",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_mvp-talks-cit-conex%C3%A3o-conhecimento-e-inova%C3%A7%C3%A3o-activity-7259535011341631489-j6IA",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/CIT.pdf",
      blogUrl: "https://orafaelferreira.com/posts/mvp.day/",
    },
    {
      title: "Deploy de um Futuro com Sustentabilidade: GreenOps na Cloud",
      event: "#27 Cloud Native São Paulo - Sustainability Day na AWS",
      date: "2024-10-22",
      location: "São Paulo, SP",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/sustentability.day/01.jpeg",
      siteUrl: "https://community.cncf.io/events/details/cncf-cloud-native-sao-paulo-presents-27-cloud-native-sao-paulo-sustainability-day-na-aws/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_27-cloud-native-s%C3%A3o-paulo-sustainability-activity-7258090638800289792-r0r4",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/cncn-sp.pdf",
      videoUrl: "https://www.youtube.com/live/mIgEJseOt0U",
      blogUrl: "https://orafaelferreira.com/posts/sustentability.day/",
    },
    {
      title: "Curso DP-900 Fundamentos de Dados do Azure",
      event: "Curso Presencial",
      date: "2024-08-31",
      location: "São José, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/dp-900/1.jpeg",
      siteUrl: "https://www.eventbrite.com.br/e/curso-dp-900-em-sao-josesc-tickets-947904667377",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_curso-dp-900-em-s%C3%A3o-jos%C3%A9sc-activity-7221484277182402560-mdRO",
      blogUrl: "https://orafaelferreira.com/posts/curso-dp-900/",
    },
    {
      title: "Plataformização de Arquitetura de Dados com Backstage.io e IAC",
      event: "TDC Florianópolis - Trilha Arquitetura de Dados",
      date: "2024-06-14",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/floripa.png",
      siteUrl: "https://thedevconf.com/tdc/2024/florianopolis/trilha-arquitetura-de-dados",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_tdc-tdcfloripa-tdc2024-activity-7214614002457276416-r9qB",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/TDC.pdf",
      blogUrl: "https://orafaelferreira.com/posts/talk-tdc/",
    },
    {
      title: "Plataformização da Cloud Foundation com Backstage: Desvendando os Segredos da Eficiência na Nuvem",
      event: "KuberTENes Birthday Bash Santa Catarina",
      date: "2024-06-11",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/CloudNativeSC-KuberTENes/00.png",
      siteUrl: "https://community.cncf.io/events/details/cncf-cloud-native-santa-catarina-presents-kubertenes-birthday-bash-santa-catarina/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_kubernetes-cloudnative-devops-activity-7209180344233668608-4Xrc",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/KuberTENes.pdf",
      videoUrl: "https://www.youtube.com/watch?v=iACjUNbhnaM",
      blogUrl: "https://orafaelferreira.com/posts/KuberTENes/",
    },
    {
      title: "Curso AZ-900 - Fundamentos da Azure",
      event: "Curso Presencial",
      date: "2024-06-08",
      location: "São José, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/az-900/0.jpeg",
      siteUrl: "https://www.eventbrite.com.br/e/az-900-tickets-885187528727",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_ai900-fundamentos-az900-activity-7205901535577300992-nB1S",
      blogUrl: "https://orafaelferreira.com/posts/curso-az-900/",
    },
    {
      title: "GreenOps na Cloud: Construindo o Futuro com Sustentabilidade",
      event: "Tech Connection Balneário Camburiú",
      date: "2024-06-01",
      location: "Balneário Camburiú, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/tc.bc.jpg",
      siteUrl: "https://talkfloripa.com.br/grade",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_no-%C3%BAltimo-s%C3%A1bado-participei-do-evento-tech-activity-7203412108322025472-Di9q",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/tech-connection-balneario-camboriu.pdf",
      blogUrl: "https://orafaelferreira.com/posts/tc.bc24/",
    },
    {
      title: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem Impactando um Futuro Sustentável",
      event: "KCD São Paulo - Brasil 2024",
      date: "2024-02-24",
      location: "São Paulo, SP",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/kcdsp24/00.jpg",
      siteUrl: "https://community.cncf.io/events/details/cncf-kcd-brasil-presents-kcd-brasil-sao-paulo-2024/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_tbt-kdc-tecnologia-activity-7168974563542839297-qpOK",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/KCD.2024.pdf",
      blogUrl: "https://orafaelferreira.com/posts/kcdsp24/",
    },
    {
      title: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem Impactando um Futuro Sustentável",
      event: "2º Cloud Native Floripa Meetup",
      date: "2024-02-21",
      location: "Florianópolis, SC",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/kcdsp24/00.jpg",
      siteUrl: "https://community.cncf.io/events/details/cncf-cloud-native-floripa-presents-2o-cloud-native-floripa-meetup/",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_um-pouco-do-meetup-de-ontem-da-cloud-native-activity-7166602764209397760-58XY",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/Cloud-Native-Floripa2Edição.pdf",
      blogUrl: "https://orafaelferreira.com/posts/2meetcncf/",
    },
  ];

  const onlineTalks: Talk[] = [
    {
      title: "DevOps Além do Hype",
      event: "Deploy Conference",
      date: "2025-06-08",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/devops-deploy.pdf",
      videoUrl: "https://www.youtube.com/watch?v=6EF8IgFxRfc",
    },
    {
      title: "Mas afinal, o que é DevOps? Tudo o que Você Precisa Saber!",
      event: "DevOps Heroes",
      date: "2025-05-29",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/devopsheroes0529.png",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/devops-heroes0525.pdf",
    },
    {
      title: "Arquitetando uma Landing Zone Segura para Workloads de IA na Nuvem",
      event: "Global Azure",
      date: "2025-05-10",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/globalaz-sntoad.pdf",
      videoUrl: "https://www.youtube.com/watch?v=nA39QsO4H78",
    },
    {
      title: "Arquitetando uma Landing Zone Segura para Workloads de IA na Nuvem",
      event: "Global AI Bootcamp",
      date: "2025-03-01",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/globalIA.jpg",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_globalaibootcamp-ia-cloudcomputing-activity-7300484797653565440-bESq",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/GlobalIA.pdf",
      videoUrl: "https://www.youtube.com/watch?v=bTHiAolXg9k",
    },
    {
      title: "Azure Workbooks para Otimização de Custos com FinOps",
      event: "Webinar",
      date: "2024-09-22",
      location: "Online",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_azure-workbooks-para-otimiza%C3%A7%C3%A3o-de-custos-activity-7243952243849220096-cPez",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/Workbooks.pdf",
      videoUrl: "https://www.youtube.com/watch?v=TWGizKIBOXc",
    },
    {
      title: "Observabilidade, além do alcance",
      event: "ConFLOSS",
      date: "2024-08-24",
      location: "Online",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_confloss-linux-opensource-activity-7214961215465242626-jfLe",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/confloss.pdf",
      videoUrl: "https://www.youtube.com/watch?v=-Q906efT7x0",
    },
    {
      title: "Os 6Rs que Você Precisa Conhecer para Migrar para a Cloud",
      event: "DevOps4Dev",
      date: "2024-08-21",
      location: "Online",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_os-6rs-que-voc%C3%AA-precisa-conhecer-para-migrar-activity-7231631063507218432-jm1H",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/devops4dev.pdf",
      videoUrl: "https://www.youtube.com/watch?v=46ourn9dLjM",
    },
    {
      title: "Uma Visão Abrangente do Gerenciamento Moderno de Endpoints",
      event: "INTUNE WEEK",
      date: "2024-08-12",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/intuneweek.jpeg",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_intuneweek-lowops-mvp-activity-7228820716995899392-27r_",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/IntuneWeek.pdf",
    },
    {
      title: "GreenOps na Cloud: Construindo o Futuro com Sustentabilidade",
      event: "DevOps Experience",
      date: "2024-06-27",
      location: "Online",
      linkedinUrl: "https://www.linkedin.com/posts/devopsheroes_greenops-na-cloud-construindo-o-futuro-com-activity-7206724813476765696-wwN9",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/devops-heroes.pdf",
      videoUrl: "https://www.youtube.com/watch?v=qT1Uo-tiBjE",
    },
    {
      title: "Corrente Solidária - Todos pelo RS",
      event: "Evento Beneficente",
      date: "2024-05-11",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/todos.por.rs.pdf",
      videoUrl: "https://www.youtube.com/watch?v=VzykJi_qqDI",
    },
    {
      title: "Azure Pipelines",
      event: "Global Azure",
      date: "2024-04-21",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/global.azure-Pipelines.pdf",
      videoUrl: "https://www.youtube.com/watch?v=LzkdUu6sgys",
    },
    {
      title: "GreenOps: Da Fundação à Inovação Sustentável na Cloud Azure",
      event: "Global Azure feat Azure Floripa",
      date: "2024-04-20",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/Global.Azure.pdf",
      videoUrl: "https://www.youtube.com/watch?v=etnQCHbIg2I",
      blogUrl: "https://orafaelferreira.com/posts/global-azure/",
    },
    {
      title: "Azure Cloud Foundation",
      event: "TechTalk CI&T",
      date: "2024-03-07",
      location: "Online",
      image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/TechTalk-CI&T-Azure-Cloud-Foundation.jpeg",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_cit-microsoftazure-techtalk-activity-7171125818843250688-CADu",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/TechTalk1.pdf",
    },
    {
      title: "DEVOPS - EP 11 - Monitoramento e Observabilidade",
      event: "Unicast Cloud Lab",
      date: "2023-09-23",
      location: "Online",
      linkedinUrl: "https://www.linkedin.com/posts/rafaelmaferreira_devops-monitoramento-observabilidade-activity-7134873516364943362-sFy2",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/Observability-alem-do-alcance.pdf",
      videoUrl: "https://www.youtube.com/watch?v=-rYhXprMJO4",
      blogUrl: "https://orafaelferreira.com/posts/mentoria/",
    },
    {
      title: "DEVOPS - EP 10 - CI/CD com Azure DevOps ou GitHub Actions",
      event: "Unicast Cloud Lab",
      date: "2023-09-16",
      location: "Online",
      slidesUrl: "https://stoblobcertificados011.blob.core.windows.net/palestras/pipelines-com-azureDevOps.pdf",
      videoUrl: "https://www.youtube.com/watch?v=hxiluSC8E_U",
      blogUrl: "https://orafaelferreira.com/posts/mentoria/",
    },
  ];

  const renderTalkCard = (talk: Talk, index: number) => {
    const getYouTubeId = (url: string): string | null => {
      try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtube.com")) {
          return parsed.searchParams.get("v");
        }
        if (parsed.hostname.includes("youtu.be")) {
          return parsed.pathname.replace("/", "");
        }
        return null;
      } catch {
        return null;
      }
    };

    const imageSrc =
      talk.image ||
      (talk.videoUrl
        ? (() => {
            const id = getYouTubeId(talk.videoUrl);
            return id ? `https://img.youtube.com/vi/${id}/0.jpg` : null;
          })()
        : null);

    return (
      <Card
        key={`${talk.title}-${talk.date}`}
        className="group p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {imageSrc && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={imageSrc}
              alt={talk.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {talk.title}
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Presentation className="w-4 h-4" />
            <span className="text-sm">{talk.event}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(talk.date).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{talk.location}</span>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-2">
            {talk.siteUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={talk.siteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Site do Evento
                </a>
              </Button>
            )}
            
            {talk.slidesUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  Slides
                </a>
              </Button>
            )}
            
            {talk.videoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4 mr-2" />
                  Vídeo
                </a>
              </Button>
            )}
            
            {talk.linkedinUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={talk.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            
            {talk.blogUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={talk.blogUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Blog Post
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Palestras
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compartilho insights, experiências e conhecimentos sobre os mais diversos temas do universo da tecnologia.
          </p>
        </div>

        {upcomingTalks.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-primary" />
              Próximos Eventos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTalks.map((talk, index) => renderTalkCard(talk, index))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-primary" />
            Palestras Presenciais
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inPersonTalks.map((talk, index) => renderTalkCard(talk, index))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            Palestras Online
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineTalks.map((talk, index) => renderTalkCard(talk, index))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Talks;
