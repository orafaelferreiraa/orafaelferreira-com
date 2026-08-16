import type { ComponentType, SVGProps } from "react";
import {
  SiTerraform,
  SiKubernetes,
  SiGithubactions,
  SiDocker,
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
  SiEnvoyproxy,
  SiThanos,
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

/** Logo oficial do Kyverno (mascote/wave mark, CNCF artwork repo) — bicolor: laranja + azul. */
const KyvernoIcon: IconComp = (props) => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#E87E5B" d="M85.978,159.12977,62.8,260.6758H86.6494l19.44481-85.18748c-3.67742-3.73171-7.44723-7.31243-11.34072-10.64083a10.63854,10.63854,0,0,1-2.57145-3.25561c-2.00621-.77007-4.09061-1.59534-6.204-2.46211M231.42381,67.34456,112.1119,124.80222c1.52162,2.13,2.97738,4.24159,4.34786,6.26969a10.64019,10.64019,0,0,1,3.75052,1.7744c3.83767,2.83657,7.86273,5.51845,12.00391,8.089l99.36786-47.85077c.55723-4.79743.95806-9.57158,1.12509-14.29529a10.66422,10.66422,0,0,1,.94635-4.03924C232.908,72.38443,232.15146,69.8955,231.42381,67.34456Zm161.27254,56.72785L274.88369,67.33715c-.72856,2.55341-1.48428,5.04528-2.23045,7.41284a10.67016,10.67016,0,0,1,.9465,4.03924c.16673,4.72171.56787,9.49415,1.12556,14.2902l98.02314,47.20224c4.15445-2.62574,8.1903-5.36392,12.0309-8.25678a10.68789,10.68789,0,0,1,3.7368-1.80756C389.8331,128.22825,391.23488,126.15989,392.69635,124.07241ZM443.51958,260.6758,420.01438,157.685c-2.37065,1.007-4.71138,1.95716-6.9554,2.8412a10.6927,10.6927,0,0,1-2.5423,3.27658c-3.65167,3.17757-7.19121,6.57908-10.6453,10.12063l19.802,86.75243Z" />
    <path fill="#3784C5" d="M310.80628,197.98424l2.82932,3.494c1.31341-11.17046,10.57992-21.88857,28.16752-31.49762,18.333-10.01513,35.45434-18.90162,49.41063-29.40875l1.85044,2.28243q16.36194-25.5555,25.41716-32.17314c8.11195-4.9367,15.60838-3.49975,21.43667,3.00345,5.15077,7.05348,4.99824,14.68455-1.51791,21.59368q-8.35657,7.48094-36.75573,18.1712l1.84812,2.28289c-13.17744,11.47105-25.43089,26.36813-39.04109,42.21865-13.05143,15.20616-25.46389,22.04018-36.66458,21.00423l2.83148,3.4945-11.00713,8.91256L309.8843,207.878l-7.47391-3.09521ZM175.161,222.7922l2.79832-3.517c-11.18851,1.1345-23.66-5.59048-36.846-20.68251-13.74561-15.73207-26.12754-30.52212-39.40815-41.87534l1.83008-2.30047Q75.044,143.97428,66.62113,136.56738c-6.57383-6.85144-6.79345-14.48174-1.70561-21.57949,5.77123-6.55409,13.25378-8.05643,21.41092-3.19176q9.1105,6.54145,25.69447,31.95182l1.83069-2.30032c14.04929,10.38421,31.24622,19.12264,49.66588,28.978,17.67181,9.45251,27.031,20.09165,28.44142,31.24977l2.79956-3.51918,8.461,6.73068-7.22282,2.99111-9.80909,23.68672Zm62.25216-45.00356H241.91c-7.85409-8.05057-10.35459-21.99822-6.753-41.712,3.75484-20.55125,7.62165-39.44856,8.24072-56.90815h2.94052q-9.56509-28.79985-9.01095-40.00039c1.26961-9.41025,7.10423-14.334,15.82538-14.7703,8.72255.43631,14.55748,5.36005,15.82755,14.7703q.55059,11.20047-9.01173,40.00039h2.94052c.61938,17.45959,4.48666,36.3569,8.24074,56.90815,3.6017,19.71379,1.101,33.66144-6.75289,41.712h4.49668v13.11374l-15.954-6.60715-15.52634,6.42963Z" />
    <polygon fill="#E87E5B" points="252.939 193.893 278.016 204.281 303.097 214.664 313.479 239.747 322.151 260.676 276.724 260.676 274.707 255.806 270.974 246.787 261.956 243.055 252.939 239.32 243.923 243.055 234.905 246.787 231.172 255.806 229.155 260.676 183.729 260.676 192.4 239.747 202.783 214.664 227.864 204.281 252.939 193.893" />
    <path fill="#3784C5" d="M68.2137,349.624a8.91449,8.91449,0,1,1-17.829,0V286.58912a8.91593,8.91593,0,0,1,8.91487-8.9141h384.218a8.91517,8.91517,0,0,1,8.91456,8.9141V349.624a8.91433,8.91433,0,1,1-17.82866,0v-54.12H260.32175v54.12a8.91433,8.91433,0,1,1-17.82866,0v-54.12H68.2137Z" />
    <path fill="#E87E5B" d="M241.91505,443.20813a1.18142,1.18142,0,0,0,.95652.48921h8.5364l8.53608-.00124a1.1742,1.1742,0,0,0,.92336-.44741l5.323-6.67131,5.322-6.67578a1.188,1.188,0,0,0,.22672-.99354l-3.7951-16.63169a1.16455,1.16455,0,0,0-.64144-.81571l-15.381-7.40682a1.17893,1.17893,0,0,0-1.02671,0l-15.381,7.40682a1.187,1.187,0,0,0-.63789.80337l-3.79,16.60146a1.18422,1.18422,0,0,0,.21808,1.03735ZM229.851,467.85723a2.68563,2.68563,0,0,0,2.174,1.10751H251.41l19.385-.00354a2.6692,2.6692,0,0,0,2.09736-1.01282l12.08719-15.15357,12.085-15.159a2.708,2.708,0,0,0,.51744-2.25806l-8.62075-37.76932a2.65084,2.65084,0,0,0-1.45654-1.85182l-34.93073-16.82278a2.67955,2.67955,0,0,0-2.32855,0l-34.9309,16.82278a2.6774,2.6774,0,0,0-1.44836,1.82375l-8.607,37.70054a2.68116,2.68116,0,0,0,.494,2.35614Z" />
    <path fill="#E87E5B" d="M48.64133,443.20813a1.17824,1.17824,0,0,0,.95653.48921h8.53639l8.53608-.00124a1.17715,1.17715,0,0,0,.92337-.44741l5.32335-6.67131,5.31965-6.67578a1.18728,1.18728,0,0,0,.22841-.99354l-3.7968-16.63169a1.16679,1.16679,0,0,0-.6402-.81571l-15.38228-7.40682a1.17622,1.17622,0,0,0-1.02547,0l-15.38028,7.40682a1.18185,1.18185,0,0,0-.63835.80337l-3.78955,16.60146a1.17623,1.17623,0,0,0,.21824,1.03735Zm-12.06375,24.6491a2.685,2.685,0,0,0,2.17308,1.10751H58.13425l19.38652-.00354a2.67635,2.67635,0,0,0,2.09812-1.01282l12.08627-15.15357,12.08365-15.159a2.69274,2.69274,0,0,0,.51743-2.25806l-8.61936-37.76932a2.64767,2.64767,0,0,0-1.45592-1.85182L59.30037,378.93387a2.6829,2.6829,0,0,0-2.33008,0L22.03877,395.75665a2.686,2.686,0,0,0-1.44866,1.82375l-8.60456,37.70054a2.67125,2.67125,0,0,0,.49414,2.35614Z" />
    <path fill="#E87E5B" d="M432.85945,443.20813a1.178,1.178,0,0,0,.95652.48921h8.5361l8.53622-.00124a1.17706,1.17706,0,0,0,.92321-.44741l5.32337-6.67131,5.31979-6.67578a1.18136,1.18136,0,0,0,.2281-.99354l-3.7951-16.63169a1.16472,1.16472,0,0,0-.64159-.81571l-15.381-7.40682a1.17853,1.17853,0,0,0-1.02653,0l-15.38107,7.40682a1.18977,1.18977,0,0,0-.638.80337l-3.79,16.60146a1.18425,1.18425,0,0,0,.21822,1.03735Zm-12.06422,24.6491a2.68578,2.68578,0,0,0,2.1734,1.10751h19.38344l19.38635-.00354a2.67442,2.67442,0,0,0,2.09828-1.01282l12.08642-15.15357,12.08349-15.159a2.69186,2.69186,0,0,0,.51667-2.25806l-8.61844-37.76932a2.6516,2.6516,0,0,0-1.45592-1.85182l-34.93136-16.82278a2.6829,2.6829,0,0,0-2.33008,0l-34.9309,16.82278a2.68376,2.68376,0,0,0-1.44851,1.82375l-8.60487,37.70054a2.67227,2.67227,0,0,0,.4943,2.35614Z" />
  </svg>
);

/** Logo oficial do OpenTelemetry (CNCF artwork repo) — bicolor: laranja + azul. */
const OpenTelemetryIcon: IconComp = (props) => (
  <svg viewBox="-12.70 -12.70 1024.40 1024.40" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#F5A800" d="M528.7 545.9c-42 42-42 110.1 0 152.1s110.1 42 152.1 0 42-110.1 0-152.1-110.1-42-152.1 0zm113.7 113.8c-20.8 20.8-54.5 20.8-75.3 0-20.8-20.8-20.8-54.5 0-75.3 20.8-20.8 54.5-20.8 75.3 0 20.8 20.7 20.8 54.5 0 75.3zm36.6-643l-65.9 65.9c-12.9 12.9-12.9 34.1 0 47l257.3 257.3c12.9 12.9 34.1 12.9 47 0l65.9-65.9c12.9-12.9 12.9-34.1 0-47L725.9 16.7c-12.9-12.9-34-12.9-46.9 0zM217.3 858.8c11.7-11.7 11.7-30.8 0-42.5l-33.5-33.5c-11.7-11.7-30.8-11.7-42.5 0L72.1 852l-.1.1-19-19c-10.5-10.5-27.6-10.5-38 0-10.5 10.5-10.5 27.6 0 38l114 114c10.5 10.5 27.6 10.5 38 0s10.5-27.6 0-38l-19-19 .1-.1 69.2-69.2z" />
    <path fill="#425CC7" d="M565.9 205.9L419.5 352.3c-13 13-13 34.4 0 47.4l90.4 90.4c63.9-46 153.5-40.3 211 17.2l73.2-73.2c13-13 13-34.4 0-47.4L613.3 205.9c-13-13.1-34.4-13.1-47.4 0zm-94 322.3l-53.4-53.4c-12.5-12.5-33-12.5-45.5 0L184.7 663.2c-12.5 12.5-12.5 33 0 45.5l106.7 106.7c12.5 12.5 33 12.5 45.5 0L458 694.1c-25.6-52.9-21-116.8 13.9-165.9z" />
  </svg>
);

/** Logo oficial do KEDA (hexágono/nós ao estilo Kubernetes, CNCF artwork repo) — azul Kubernetes. */
const KedaIcon: IconComp = (props) => (
  <svg viewBox="0 0 625 625" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="none"
      stroke="#326DE6"
      strokeWidth="30"
      d="M522.24,172.9c-1.86-5.44-6.28-10.35-12.36-13.63L318.77,68.71l-.11-.06c-2.07-1-5.08-1.55-9-1.55-3.56,0-5.14,0-7,.13a34.57,34.57,0,0,0-3.85.42L109.09,158.16l-.17.08A18.47,18.47,0,0,0,98.41,171L51.47,374.84a23.88,23.88,0,0,0,4.13,17.75l131.48,161a31,31,0,0,0,18.28,8.21h211.1l.82.09c5.8.64,11.32-1.88,15.16-7.06l.21-.28L564.91,392.59a27,27,0,0,0,4.65-18.18Z"
    />
    <circle fill="#326DE6" cx="438" cy="553" r="39" />
    <circle fill="#326DE6" cx="196" cy="553" r="39" />
    <circle fill="#326DE6" cx="307" cy="73" r="39" />
    <circle fill="#326DE6" cx="518" cy="165" r="39" />
    <circle fill="#326DE6" cx="100" cy="165" r="39" />
    <circle fill="#326DE6" cx="567" cy="384" r="39" />
    <circle fill="#326DE6" cx="59" cy="384" r="39" />
  </svg>
);

/** Logo oficial do OPA/Gatekeeper (CNCF artwork repo) — tons de cinza/slate. */
const OpaGatekeeperIcon: IconComp = (props) => (
  <svg viewBox="16.37 -1.63 395.51 435.76" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#BFBFBF" d="M71 214.5c7.5-26.7 20.9-50.1 38.4-68.8-5.9-4.4-29.3-22.6-30.4-36.9C77.3 85.4 100.7 6.7 100.7 6.7S30 92.8 25.1 127.6c-3.9 27.3 40.8 81.5 45.5 87v-.1h.4zm287.7-1.4v.2c0 .1.1.2.1.3 7.8-9.4 48.3-59.9 44.6-86-4.9-34.8-75.6-120.9-75.6-120.9s23.4 78.7 21.7 102.1c-1 13.7-22.3 30.8-29.4 36.2 17.5 18.4 31 41.6 38.6 68.1z" />
    <path fill="#566366" d="M358.7 213.2v-.2c-7.6-26.4-21.1-49.6-38.6-68.1-27.5-29-64.9-46.4-105.2-46.4v93h.1c9.9.1 17.9 8.2 17.9 18.1 0 1.2-.1 2.3-.3 3.4-1.6 8.3-8.8 14.6-17.6 14.7h-.3v34.5l-.2 163.4h3.5s38-55 58.5-70.7c24-18.4 82.2-41.2 82.2-41.2v-99.4l.3-.1c-.1-.2-.1-.5-.2-.7 0-.1 0-.2-.1-.3z" />
    <path fill="#7D9199" d="M214.7 262.3v-34.5c-8.3-.1-15.2-5.7-17.3-13.3-.4-1.5-.7-3.1-.7-4.8 0-10 8.1-18.1 18.1-18.1h.1V98.9c-40.5 0-78 17.5-105.5 46.8-17.5 18.6-30.9 42.1-38.4 68.8h-.3v100.7s58.2 22.8 82.2 41.2c19.9 15.3 58.3 69.4 58.3 69.4h3.6v-.1h-.2l.1-163.4z" />
    <path fill="#FFFFFF" d="M196.7 209.7c0 1.7.2 3.3.7 4.8 2.1 7.6 9 13.2 17.3 13.3h.3c8.7-.1 16-6.4 17.6-14.7.2-1.1.3-2.2.3-3.4 0-9.9-8-18-17.9-18.1h-.2c-10 0-18.1 8.1-18.1 18.1z" />
  </svg>
);

/** Ícone cubo isométrico da PerfectScale, na cor turquesa oficial da marca (perfectscale.io). */
const PerfectScaleIcon: IconComp = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#32C2BD" {...props}>
    <path d="M50.1,17.1l22.7,13.2l0,13.1L50.1,30.1V17.1z" />
    <path d="M38.4,49.9v12.9l-11.4-7l0.1-12.5L38.4,49.9z" />
    <path d="M73,69.8L49.9,83V69.8L73,56.6V69.8z" />
    <path d="M50.1,17l-23,13.2l11.4,6.5l11.6-6.6V17z" />
    <path d="M49.9,69.8l-7.7-4.7v13.5l7.7,4.4V69.8z" />
    <path d="M50.3,56.7L61.6,50l-11.5-6.7l-11.7,6.6L50.3,56.7z" />
    <path d="M72.9,43.4V30.2l-11.2,6.6l-11.5,6.5L61.6,50L72.9,43.4z" />
    <path d="M73,56.6L61.6,50l-11.2,6.7L73,69.9V56.6z" />
    <path d="M50.1,17.1l-23,13.2l0,13.1l23-13.2V17.1z" />
    <path d="M38.4,49.9v12.9l-11.4-7l0.1-12.5L38.4,49.9z" />
    <path d="M46.7,45.3l3.4-1.9l-23-13.1l0,13.1l11.3,6.6" />
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
  "docker": { Icon: SiDocker, color: "#2496ED" },

  // ── Kubernetes admission control / GitOps hardening ──
  "kyverno": { Icon: KyvernoIcon },
  "opa gatekeeper": { Icon: OpaGatekeeperIcon },
  "keda": { Icon: KedaIcon },
  "envoy gateway": { Icon: SiEnvoyproxy, color: "#AC6199" },

  // ── Observability ──
  "prometheus": { Icon: SiPrometheus, color: "#E6522C" },
  "grafana": { Icon: SiGrafana, color: "#F46800" },
  "splunk": { Icon: SiSplunk, color: "#65A637" },
  "zabbix": { Icon: Activity, color: "#DC1E2D" },
  "elasticsearch": { Icon: SiElasticsearch, color: "#005571" },
  "nagios": { Icon: Activity, color: "#C7240D" },
  "sonarqube": { Icon: ShieldCheck, color: "#4E9BCD" },
  "nexus": { Icon: Package, color: "#1B75BA" },
  "thanos": { Icon: SiThanos, color: "#8B2FC9" },
  "opentelemetry": { Icon: OpenTelemetryIcon },

  // ── FinOps tooling ──
  "perfectscale": { Icon: PerfectScaleIcon },

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
  "devsecops": { Icon: ShieldCheck, color: "#0EA5E9" },
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
