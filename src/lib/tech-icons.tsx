import type { ComponentType, SVGProps } from "react";
import {
  SiTerraform,
  SiKubernetes,
  SiGithubactions,
  SiArgo,
  SiHelm,
  SiPrometheus,
  SiGrafana,
  SiJenkins,
  SiSplunk,
  SiPuppet,
  SiElasticsearch,
  SiVmware,
  SiMysql,
  SiLinux,
  SiVirtualbox,
  SiFlux,
} from "react-icons/si";
import { VscAzure, VscAzureDevops, VscTerminalPowershell } from "react-icons/vsc";
import { FaWindows, FaJava, FaServer, FaPrint, FaNetworkWired } from "react-icons/fa";
import {
  Network,
  Cloud,
  Shield,
  DollarSign,
  Database,
  Mail,
  HardDrive,
  Layers,
  Globe,
  Lock,
  Workflow,
  Infinity as InfinityIcon,
  Box,
  Terminal,
  CreditCard,
  BookOpen,
  Save,
  RotateCcw,
  Wrench,
  Activity,
  ShieldCheck,
  Package,
} from "lucide-react";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

/** Logo oficial do Python com as duas cores (azul + amarelo). */
const PythonIcon: IconComp = (props) => (
  <svg viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="py-blue" x1="12.96%" x2="79.64%" y1="12.04%" y2="78.2%">
        <stop offset="0" stopColor="#387EB8" />
        <stop offset="1" stopColor="#366994" />
      </linearGradient>
      <linearGradient id="py-yellow" x1="19.13%" x2="90.74%" y1="20.58%" y2="88.43%">
        <stop offset="0" stopColor="#FFE052" />
        <stop offset="1" stopColor="#FFC331" />
      </linearGradient>
    </defs>
    <path fill="url(#py-blue)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" />
    <path fill="url(#py-yellow)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" />
  </svg>
);

interface TechIcon {
  Icon: IconComp;
  /** Brand color (hex). When omitted, uses currentColor (primary). */
  color?: string;
}

/** Mapeamento case-insensitive de nome de tecnologia para ícone + cor da marca. */
const MAP: Record<string, TechIcon> = {
  // ── Cloud / Azure family ──
  "azure": { Icon: VscAzure, color: "#0078D4" },
  "azure devops": { Icon: VscAzureDevops, color: "#0078D7" },
  "azure policy": { Icon: VscAzure, color: "#0078D4" },
  "azure cli": { Icon: VscAzure, color: "#0078D4" },
  "azure front door": { Icon: VscAzure, color: "#0078D4" },
  "azure site recovery": { Icon: VscAzure, color: "#0078D4" },
  "azure file sync": { Icon: VscAzure, color: "#0078D4" },
  "azure sql": { Icon: VscAzure, color: "#0078D4" },
  "azure ad": { Icon: VscAzure, color: "#0078D4" },
  "azure workbooks": { Icon: VscAzure, color: "#0078D4" },
  "api management": { Icon: VscAzure, color: "#0078D4" },
  "application gateway": { Icon: VscAzure, color: "#0078D4" },
  "bicep": { Icon: VscAzure, color: "#0078D4" },
  "aks": { Icon: SiKubernetes, color: "#326CE5" },
  "kubernetes (aks)": { Icon: SiKubernetes, color: "#326CE5" },
  "kubernetes": { Icon: SiKubernetes, color: "#326CE5" },

  // ── IaC / Automation ──
  "terraform": { Icon: SiTerraform, color: "#7B42BC" },
  "terragrunt": { Icon: SiTerraform, color: "#7B42BC" },
  "github actions": { Icon: SiGithubactions, color: "#2088FF" },
  "gitops": { Icon: Workflow, color: "#16A34A" },
  "argo cd": { Icon: SiArgo, color: "#EF7B4D" },
  "fluxcd": { Icon: SiFlux, color: "#5468FF" },
  "helm": { Icon: SiHelm, color: "#0F1689" },
  "puppet": { Icon: SiPuppet, color: "#FFAE1A" },
  "jenkins": { Icon: SiJenkins, color: "#D24939" },

  // ── Observability ──
  "prometheus": { Icon: SiPrometheus, color: "#E6522C" },
  "grafana": { Icon: SiGrafana, color: "#F46800" },
  "splunk": { Icon: SiSplunk, color: "#65A637" },
  "zabbix": { Icon: Activity, color: "#DC1E2D" },
  "elasticsearch": { Icon: SiElasticsearch, color: "#005571" },
  "nagios": { Icon: Activity, color: "#C7240D" },
  "sonarqube": { Icon: ShieldCheck, color: "#4E9BCD" },
  "nexus": { Icon: Package, color: "#1B75BA" },

  // ── Languages / Shells ──
  "python": { Icon: PythonIcon },
  "java": { Icon: FaJava, color: "#E76F00" },
  "powershell": { Icon: VscTerminalPowershell, color: "#5391FE" },

  // ── OS / Virtualization ──
  "linux": { Icon: SiLinux, color: "#FCC624" },
  "windows": { Icon: FaWindows, color: "#0078D4" },
  "windows server": { Icon: FaWindows, color: "#0078D4" },
  "vmware": { Icon: SiVmware, color: "#607078" },
  "hyper-v": { Icon: FaWindows, color: "#0078D4" },
  "virtualbox": { Icon: SiVirtualbox, color: "#183A61" },

  // ── Databases ──
  "mysql": { Icon: SiMysql, color: "#4479A1" },
  "sql server": { Icon: Database, color: "#CC2927" },

  // ── Microsoft 365 / Identity ──
  "office 365": { Icon: FaWindows, color: "#D83B01" },
  "microsoft 365": { Icon: FaWindows, color: "#D83B01" },
  "microsoft intune": { Icon: VscAzure, color: "#0078D4" },
  "active directory": { Icon: Lock, color: "#0078D4" },

  // ── Networking / Concepts (lucide fallback) ──
  "networking": { Icon: Network },
  "dns": { Icon: Globe },
  "dhcp": { Icon: Network },
  "tcp/ip": { Icon: Network },
  "firewalls": { Icon: Shield },
  "switches": { Icon: FaNetworkWired },
  "vpn s2s": { Icon: Lock },

  // ── Governance / Frameworks ──
  "rbac": { Icon: Shield },
  "caf": { Icon: BookOpen },
  "well-architected": { Icon: BookOpen },
  "landing zones": { Icon: Layers },
  "hub-spoke": { Icon: Workflow },
  "finops": { Icon: DollarSign, color: "#16A34A" },
  "itil": { Icon: BookOpen },

  // ── Skill aliases (Home · Áreas de Especialização) ──
  "cloud azure": { Icon: VscAzure, color: "#0078D4" },
  "devops & iac": { Icon: InfinityIcon, color: "#2088FF" },
  "platform engineering": { Icon: Layers, color: "#8B5CF6" },

  // ── Misc ──
  "ssh": { Icon: Terminal },
  "tef": { Icon: CreditCard },
  "pbm": { Icon: CreditCard },
  "email": { Icon: Mail },
  "printers": { Icon: FaPrint },
  "hardware": { Icon: Wrench },
  "backup": { Icon: Save },
  "data recovery": { Icon: RotateCcw },
};

/** Ícone genérico quando a tech não está mapeada. */
export const FALLBACK_ICON: IconComp = Box;

export function getTechIcon(name: string): TechIcon {
  const key = name.trim().toLowerCase();
  return MAP[key] ?? { Icon: FALLBACK_ICON };
}
