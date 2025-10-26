export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  mediumUrl: string;
}

export const articles: Article[] = [
  {
    slug: "azure-backup-virtual-machines",
    title: "Azure Backup should be enabled for Virtual Machines",
    excerpt: "Exploramos por que a policy 'Azure Backup should be enabled for Virtual Machines' é essencial em ambientes corporativos, detalhando os riscos de não ter backup automático em VMs.",
    content: `![Azure Backup](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/00.png)

## Visão Geral
Vamos explorar por que a policy **"Azure Backup should be enabled for Virtual Machines"** (ID: 013e242c-8828-4970-87b3-ab247555486d) é essencial em ambientes corporativos. Como continuação dos fundamentos de Azure Policy, vamos detalhar os riscos de não ter backup automático em VMs, o funcionamento técnico dessa policy, sua relação com boas práticas e compliance (Azure Security Benchmark, ISO 27001, LGPD, GDPR, CMMC) e como aplicá-la na prática para melhorar a continuidade de negócios. Também abordaremos mecanismos de remediação – desde habilitar backup manualmente, com IAC (Infraestrutura como código) e via Azure Policy.

## Riscos de não habilitar backup em máquinas virtuais
Não realizar backups automáticos de máquinas virtuais pode ocasionar riscos significativos. Em caso de falhas, erro humano ou ataque cibernético, uma VM sem backup pode resultar em **perda irreversível de dados**, comprometendo a integridade e disponibilidade das informações e interrompendo operações críticas do negócio. Por exemplo, se um servidor de banco de dados em produção for perdido e não possuia backup, a empresa irá enfrentar **horas (ou dias) de indisponibilidade** e perda de dados transacionais importantes.

**Alguns riscos reais de não ter backup habilitado em VMs incluem:**
- **Perda de Dados e Impacto Financeiro:** Dados armazenados apenas no disco da VM ficam suscetíveis a falhas. Um colapso de disco ou exclusão acidental pode significar perda permanente de informações valiosas, gerando prejuízos financeiros e operacionais.
- **Continuidade do Negócio Comprometida:** Sem backups, a recuperação de uma VM crítica pode ser inviável, resultando em **downtime prolongado** e possíveis violações de SLAs.
- **Ataques de Ransomware:** VMs sem backup tornam a empresa mais vulnerável. Em um ataque de ransomware, se não houver cópias de segurança recentes, a única opção pode ser pagar resgate (sem garantia de sucesso) ou perder os dados. Com backups, é possível restaurar o sistema ao estado pré-ataque. Além disso, o Azure Backup oferece recursos de segurança como *Soft Delete* e *MFA* no ato da exclusão, protegendo as cópias contra tentativas maliciosas de apagá-las.
- **Compliance e Reputação:** A ausência de backup pode gerar não-conformidade com normas de proteção de dados e continuidade. Um incidente de perda definitiva de informações pode resultar em multas regulatórias e danificar a reputação da empresa.

## Como funciona a Azure Policy "Azure Backup should be enabled for Virtual Machines"
Essa Azure Policy é uma definição *built-in* da Microsoft criada para garantir que as VMs tenham backup habilitado. Trata-se de uma policy do tipo **AuditIfNotExists** (modo **Indexed**), ou seja, **não** impede a criação da VM, mas **audita** o ambiente e **marca como não conformes** as VMs que não possuam item de backup registrado em um **Recovery Services Vault**.

### Detalhes técnicos principais
- **Modo e Efeito:** Funciona em modo Indexed e o efeito padrão é AuditIfNotExists. Para cada recurso do tipo Microsoft.Compute/virtualMachines, a policy verifica a existência de um recurso de backup (Microsoft.RecoveryServices/vaults/backupProtectedItems). Se não houver, marca a VM como não conforme.
- **Condição (rule):** Aplica-se a todas as VMs, **exceto** VMs geradas por serviços gerenciados como Azure Databricks e Azure OpenShift, onde o backup tradicional do Azure VM não se aplica.
- **Checagem de Compliance:** Caso a VM não esteja em um cofre de backup, a policy gera a não-conformidade. A severidade é listada como "Low" no portal, mas, do ponto de vista de continuidade de negócios, o risco é alto.
- **Aplicação em Escala:** Ao atribuí-la no nível de *Subscription* ou *Resource Group*, a policy auditará continuamente VMs novas e existentes. Se a VM for criada sem backup, aparecerá como **non-compliant**.

Em um ambiente corporativo enterprise, com muitas VMs, essa Azure Policy dá visibilidade proativa, permitindo identificar instâncias não protegidas pelo Azure Backup.

## Alinhamento com melhores práticas e benchmarks de segurança
Habilitar backups automáticos em VMs é tanto uma recomendação de boas práticas quanto um requisito em diversos frameworks de segurança e conformidade. Confira alguns exemplos:

| **Padrão/Benchmark** | **Controle/Norma** | **Requisito relacionado a backup** |
|----------------------|-------------------|-------------------------------------|
| **Azure Security Benchmark (v3)** | **BR-1 – Backup and Recovery** | "Ensure backup of business-critical resources, either during resource creation or enforced through policy." O ASB recomenda habilitar backup em VMs e cita Azure Policy. |
| **ISO/IEC 27001:2013** | **A.12.3.1 – Backup de informações** | Requer cópias de segurança periódicas e testadas regularmente. O backup de VMs garante disponibilidade de dados após incidentes. |
| **LGPD (Lei 13.709/2018)** | **Art. 46 – Segurança da Informação** | Exige medidas para proteger dados pessoais contra destruição ou perda acidental/ilícita. Manter backups de VMs que tratam dados pessoais ajuda a prevenir perda total. |
| **GDPR (Regulamento Geral de Proteção de Dados)** | **Art. 32(1)(c)** – Segurança do Processamento | Determina a capacidade de restabelecer a disponibilidade de dados pessoais em caso de incidente. Backups de VMs são essenciais para cumprir essa obrigação. |
| **CMMC (Cybersecurity Maturity Model)** | **RE.2.137 & RE.3.139** – Recovery | Exigem backups regulares e testados (Nível 2) e backups completos e resilientes (Nível 3). A Azure Policy garante que nenhuma VM fique sem backup. |

Manter backups automáticos suporta diretamente controles de continuidade de negócio e proteção de dados em vários âmbitos. Frameworks adicionais, como *CIS Controls v8* e *NIST SP 800-53 (CP-9)*, também exigem backups. Logo, habilitar backup em VMs contribui para uma postura de segurança robusta e alinhada aos principais padrões de segurança.

## Continuidade de negócios e recuperação de desastres
Em termos de **Disaster Recovery (DR)** e **Business Continuity (BC)**, ter backups habilitados para VMs é essencial. Essa policy automatiza a garantia de que as VMs tenham backup, alinhando-se a **RTO** (Recovery Time Objective) e **RPO** (Recovery Point Objective) definidos pela empresa.

- **RPO (Recovery Point Objective):** Quantidade aceitável de perda de dados em termos de tempo. Com backups regulares, você mantém um RPO baixo, pois nenhum servidor fica fora do ciclo de backup.
- **RTO (Recovery Time Objective):** Tempo necessário para restaurar um sistema após falha. Com backups ativos, a restauração é mais rápida, reduzindo downtime.
- **Recuperação Granular vs. Completa:** O Azure Backup para VMs gera pontos de recuperação armazenados em cofres *Recovery Services*. É possível restaurar a VM inteira ou apenas arquivos específicos.
- **Cross-Region Restore:** O Azure Backup suporta restauração cruzada entre regiões (quando habilitado com GRS), garantindo recuperação mesmo se uma região inteira estiver indisponível.

**Backups regulares e testados** são parte de qualquer plano de continuidade de negócios. A policy "Backup should be enabled for VMs" garante a existência de backup, mas cabe à empresa testar as restaurações e validar RPO/RTO.

## Aplicação prática e remediação (habilitando os backups)
Identificar VMs sem backup é só o primeiro passo. O próximo é **habilitar o Azure Backup**:

### 1. Habilitando Policy via Portal (manual):
- Acesse a VM no portal Azure e clique em *Policy*.
- Vá até Definitions, Procure *Azure Backup should be enabled for Virtual Machines*.

![Policy Definition](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/1.png)

- Clique em *Assign policy*.
- Selecione *Escopo* e a Subscription.

![Assign Policy](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/2.png)

- Review + Create.

![Review Create](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/3.png)

Ai só esperar e ir verificar:

![Verify](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/4.png)

### 2. Habilitando backup via Portal (manual):
- Acesse a VM no portal Azure e clique em *Backup*.

![Enable Backup](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/5.png)

- Escolha (ou crie) um *Recovery Services Vault*.
- Configure a frequência e retenção (política de backup).
- Clique em *Enable Backup*.

![Configure Backup](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/6.png)

Agora o vault vai ser criado, porém a policy ainda não estará em compliance, será necessário executar o job do backup:

![Vault Created](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/7.png)

![Job Status](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/8.png)

![Job Complete](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/9.png)

Agora ficando compliance:

![Compliance](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/11.png)

### 3. Habilitando backup via Azure Policy (automatizado):
Use políticas do tipo **DeployIfNotExists** para configurar automaticamente o backup em VMs não protegidas. Exemplos:
- *Configure backup on VMs of a location to an existing central vault*
- *Configure backup on VMs with a given tag to a new Recovery Services vault*

Ao atribuir essas políticas, o Azure habilita o backup conforme o cofre definido.

### 4. Terraform:

No exemplo usando Terraform, dividimos a configuração em duas etapas. Primeiro, criamos a máquina virtual sem backup habilitado (para mostrar que a Azure Policy com efeito AuditIfNotExists não bloqueia a criação, apenas audita a conformidade). Em seguida, adicionamos os recursos de backup (Recovery Services Vault e a associação da VM a esse vault).

#### Etapa 1: Criando VM sem backup habilitado

Nesta etapa, definimos os recursos básicos: grupo de recursos, rede virtual, interface de rede e a máquina virtual em si, sem configurar backup. A Azure Policy de tipo AuditIfNotExists irá permitir a criação da VM, mas marcará esse recurso como não conforme por não ter backup habilitado. E vamos para os passos com terraform

OBS: lembre-se de estar autenticado com azure:

\`\`\`bash
az login
\`\`\`

Vamos criar o seguinte arquivo: "main.tf"

\`\`\`hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

# Definição do Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "rg-exemplo-backup"
  location = "eastus"
}

# Rede virtual com uma sub-rede
resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-exemplo"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet-exemplo"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Interface de rede para a VM
resource "azurerm_network_interface" "nic" {
  name                = "nic-exemplo"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "nic-ipcfg"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

# Máquina Virtual (Linux) sem backup habilitado
resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-exemplo"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = "Standard_B1s"
  
  admin_username      = "azureuser"
  admin_password      = "P@ssw0rd12345!"
  
  disable_password_authentication = false

  network_interface_ids = [
    azurerm_network_interface.nic.id
  ]

  os_disk {
    name                = "osdisk-exemplo"
    caching             = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
\`\`\`

Executar os seguintes comandos:

\`\`\`bash
terraform init
\`\`\`

\`\`\`bash
terraform validate
\`\`\`

\`\`\`bash
terraform plan
\`\`\`

\`\`\`bash
terraform apply --auto-approve
\`\`\`

![Terraform Apply](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/10.png)

Podemos ver que ela ficou 'Non-compliant':

![Non Compliant](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/12.png)

#### Etapa 2: Habilitando backup na VM (Recovery Services Vault + Protected Item)

Agora, adicionamos os recursos de backup via IaC. Vamos criar um Recovery Services Vault (cofre de backup) e então habilitar o backup da VM criando um Backup Protected Item. Esse item associa a VM ao vault, aplicando uma política de backup definida.

\`\`\`hcl
# Recovery Services Vault para armazenar os backups
resource "azurerm_recovery_services_vault" "vault" {
  name                = "vault-backups-exemplo"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
}

# Política de backup para VMs (diária às 23:00, retenção de 7 dias)
resource "azurerm_backup_policy_vm" "policy" {
  name                = "policy-diaria"
  resource_group_name = azurerm_resource_group.rg.name
  recovery_vault_name = azurerm_recovery_services_vault.vault.name

  backup {
    frequency = "Daily"
    time      = "23:00"
  }

  retention_daily {
    count = 7
  }
}

# Habilitando o backup na VM
resource "azurerm_backup_protected_vm" "backup_associacao" {
  resource_group_name = azurerm_resource_group.rg.name
  recovery_vault_name = azurerm_recovery_services_vault.vault.name
  source_vm_id        = azurerm_linux_virtual_machine.vm.id
  backup_policy_id    = azurerm_backup_policy_vm.policy.id
}
\`\`\`

No trecho acima, azurerm_backup_protected_vm cria a associação de backup. Ao aplicar essas configurações, a VM passa a ter backup ativado no cofre especificado, atendendo à exigência da Azure Policy.

Primeiro executamos:

\`\`\`bash
terraform plan
\`\`\`

Para validar se nada vai quebrar ou destruir a VM:

![Terraform Plan](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/13.png)

Depois executamos:

\`\`\`bash
terraform apply --auto-approve
\`\`\`

AGORA podemos ter certeza que não irá destruir nossa vm beta tester:

![Terraform Apply Success](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/14.png)

**Por que estamos fazendo isso?**

Imagine ter um ambiente com 10 vms, talvez seja simples. Mas em um caso onde temos mais de mil VMs? E se modificarmos o nosso "módulo" das VMs sem antes testar. Por isso é importante existir um versionamento de módulo, geração de TAGs!

Porém ela ainda vai ficar com status de 'Non-compliant', precisamos executar o job de backup:

![Execute Backup Job](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/15.png)

Podemos forçar o assessment da policy, para isso podemos usar o comando:

\`\`\`bash
az policy state trigger-scan --subscription <subscription-id>
\`\`\`

E assim depois podemos analisar que ela ficou em compliance:

![Compliance Achieved](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/17.png)

### 5. Bicep 💪🏻

A seguir, temos o mesmo cenário implementado em Bicep. Assim como no exemplo Terraform, primeiro definimos a VM sem backup e depois incluímos o Recovery Services Vault e a configuração de backup da VM. A sintaxe do Bicep permite aninhar recursos do Azure de forma declarativa.

#### Etapa 1: Criando VM sem backup habilitado

Nesta etapa inicial do Bicep, criamos a infraestrutura básica sem nenhum backup configurado para a VM. Novamente, a policy AuditIfNotExists apenas auditará a VM (não impedirá a criação).

\`\`\`bicep
@description('Local da implantação')
param location string = resourceGroup().location

@description('Nome de usuário administrador para a VM')
param adminUsername string = 'azureuser'

@description('Senha de administrador')
@secure()
param adminPassword string

// Rede virtual e sub-rede
resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: 'vnet-exemplo'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'subnet-exemplo'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}

resource nic 'Microsoft.Network/networkInterfaces@2021-02-01' = {
  name: 'nic-exemplo'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'nic-ipcfg'
        properties: {
          subnet: {
            id: vnet.properties.subnets[0].id
          }
          privateIPAllocationMethod: 'Dynamic'
        }
      }
    ]
  }
}

resource virtualMachine 'Microsoft.Compute/virtualMachines@2022-03-01' = {
  name: 'vm-exemplo'
  location: location
  properties: {
    hardwareProfile: {
      vmSize: 'Standard_B1s'
    }
    osProfile: {
      computerName: 'vm-exemplo'
      adminUsername: adminUsername
      adminPassword: adminPassword
      linuxConfiguration: {
        disablePasswordAuthentication: false
      }
    }
    storageProfile: {
      osDisk: {
        createOption: 'FromImage'
        name: 'osdisk-exemplo'
        caching: 'ReadWrite'
        managedDisk: {
          storageAccountType: 'Standard_LRS'
        }
      }
      imageReference: {
        publisher: 'Canonical'
        offer: 'UbuntuServer'
        sku: '18.04-LTS'
        version: 'latest'
      }
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: nic.id
        }
      ]
    }
  }
}
\`\`\`

Para fazer o deploy, primeiro criamos o RG pelo portal, e depois:

\`\`\`powershell
New-AzResourceGroupDeployment -Name main -TemplateFile main.bicep
\`\`\`

Precisamos passar o nome do ResourceGroup e adminPassword:

![Bicep Deploy](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/16.png)

E podemos atualizar a página de 'Compliance':

![Bicep Non Compliant](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/18.png)

#### Etapa 2: Habilitando backup na VM (Recovery Services Vault + Protected Item)

\`\`\`bicep
// Recovery Services Vault para armazenar os backups
resource vault 'Microsoft.RecoveryServices/vaults@2024-10-01' = {
  name: 'vault-backups-exemplo'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}

// Política de backup para VMs
resource backupPolicy 'Microsoft.RecoveryServices/vaults/backupPolicies@2024-10-01' = {
  name: 'policy-diaria'
  parent: vault
  properties: {
    backupManagementType: 'AzureIaasVM'
    schedulePolicy: {
      schedulePolicyType: 'SimpleSchedulePolicy'
      scheduleRunFrequency: 'Daily'
      scheduleRunTimes: [
        '2023-01-01T23:00:00Z'
      ]
    }
    retentionPolicy: {
      retentionPolicyType: 'LongTermRetentionPolicy'
      dailySchedule: {
        retentionTimes: [
          '2023-01-01T23:00:00Z'
        ]
        retentionDuration: {
          count: 7
          durationType: 'Days'
        }
      }
    }
  }
}

// Associação da VM ao backup
var containerName = 'iaasvmcontainer;iaasvmcontainerv2;\${resourceGroup().name};\${virtualMachine.name}'
var protectedItemName = 'vm;iaasvmcontainerv2;\${resourceGroup().name};\${virtualMachine.name}'

resource vmBackup 'Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems@2024-10-01' = {
  name: '\${vault.name}/Azure/\${containerName}/\${protectedItemName}'
  properties: {
    protectedItemType: 'Microsoft.Compute/virtualMachines'
    policyId: backupPolicy.id
    sourceResourceId: virtualMachine.id
  }
}
\`\`\`

Agora vamos executar o backup da VM manualmente para podermos ver a Policy em conformidade:

![Manual Backup](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/AzureBackupshouldbeenabledforVirtualMachines/19.png)

### 6. Exceções e cenários especiais:
Se VMs não precisam de backup (por design ou custo), use filtros ou *Not Scopes*. Porém, cada VM fora do backup é um ponto de falha em potencial; avalie bem as exceções.

Conforme as VMs passam a ter backup, a **postura de compliance** melhora. Você pode monitorar no *Azure Policy* ou no *Azure Security/Defender for Cloud* a métrica de conformidade subindo.

## Conclusão
A Azure Policy **"Azure Backup should be enabled for Virtual Machines"** age como o famoso "dedo duro", evitando que VMs fiquem desprotegidas. Ela permite que times de engenharia de nuvem e DevOps **implementem de forma consistente a prática de backup**, reduzindo riscos de perda de dados, interrupções prolongadas e exposição a ataques.

Para a empresa, ter essa política ativa **facilita auditorias e compliance**, evidenciando controles de continuidade alinhados a frameworks reconhecidos (Azure Security Benchmark, ISO 27001 etc.). Em auditorias ou certificações, backups ativos em todas as VMs indicam maturidade em **governança de nuvem**.

Lembre-se: **backup não substitui outras camadas de segurança** (replicação, failover, etc.), mas é a base de **uma estratégia sólida de recuperação de desastres**. Habilitar o Azure Backup em VMs (e usar Azure Policy para garantir isso) é uma decisão de **baixo esforço** e **alto impacto** para aumentar a resiliência.

### Fontes e Referências
- [Azure Backup](https://learn.microsoft.com/azure/backup/)
- [Azure Policy](https://learn.microsoft.com/azure/governance/policy/)
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html)
- [LGPD](https://jusbrasil.com.br/artigos/731613780/lei-geral-de-protecao-de-dados)
- [GDPR](https://privacy-regulation.eu/)
- [CMMC](https://www.cmmcab.org/)`,
    date: "2024-01-15",
    category: "Azure Policy",
    readTime: "25 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/azure-backup-should-be-enabled-for-virtual-machines-013e242c-8828-4970-87b3-ab247555486d"
  },
  {
    slug: "azure-policy-visao-completa",
    title: "O que é Azure Policy? Uma Visão Completa",
    excerpt: "O Azure Policy é um recurso da Microsoft Azure que ajuda organizações a implementar governança e compliance de forma automatizada e em escala.",
    content: `![Azure Policy](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/az-policy/01.png)

O [**Azure Policy**](https://learn.microsoft.com/pt-br/azure/governance/policy/) é um recurso da Microsoft Azure que ajuda organizações a implementar governança e compliance de forma automatizada e em larga escala. Ele garante que os recursos na nuvem estejam em conformidade com as diretrizes corporativas, padrões de segurança e requisitos regulatórios. 
Imagine que, toda vez que você vê uma placa — seja no shopping ou no trânsito — ela funciona como uma policy (política). A placa tem a função de te alertar sobre regras e comportamentos esperados. Caso você não siga essas orientações e um segurança perceba a irregularidade, ele pode te abordar, corrigir sua ação ou até mesmo te impedir de continuar no local.

## O que o Azure Policy Faz?
O Azure Policy avalia continuamente os recursos e as ações no Azure com base em **definições de política**. Essas definições, escritas em formato JSON, descrevem regras que determinam se os recursos estão ou não em conformidade com os padrões estabelecidos.

### Principais Benefícios e Casos de Uso:
- **Conformidade em Larga Escala:** Avalia recursos e toma ações automáticas para garantir conformidade.
- **Automação e Consistência:** Implementa políticas de maneira consistente em todas as suas assinaturas e grupos de recursos.
- **Segurança e Gerenciamento:** Reforça políticas de segurança, como restringir SKUs de VMs, impor criptografia e definir regiões específicas para implantação de recursos.
- **Conformidade Regulatória:** Auxilia no cumprimento de normas como GDPR, ISO 27001 e SOC 2.

![Azure Policy Benefits](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/az-policy/02.png)

## Como o Azure Policy Funciona?

O **Azure Policy** funciona criando e aplicando **definições de política** e **iniciativas** para controlar como os recursos são implantados e gerenciados. Esses componentes incluem:

### Definições de Política
Uma **definição de política** é uma regra individual que descreve um critério para conformidade, como:
- Permitir a criação de recursos apenas em uma região específica.
- Garantir que todas as VMs utilizem discos criptografados.

Exemplo de definição de política em JSON:

\`\`\`json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "field": "location",
      "notIn": ["eastus", "westus"]
    },
    "then": {
      "effect": "deny"
    }
  }
}
\`\`\`

### Iniciativas
Uma **iniciativa** é uma coleção de múltiplas definições de políticas agrupadas com um propósito comum, como:
- Garantir conformidade regulatória (por exemplo: GDPR, ISO 27001).
- Padronizar a segurança de uma aplicação.

### Atribuições
Uma **atribuição de política** aplica uma definição ou iniciativa a um escopo específico, como:
- Assinatura Azure.
- Grupo de Recursos.
- Recurso Individual.

### Efeitos das Políticas
As políticas podem ter diferentes efeitos, como:
- **Deny:** Impede a criação ou modificação de recursos não conformes.
- **Audit:** Apenas registra a não conformidade sem bloquear a ação.
- **Modify:** Faz modificações automáticas nos recursos para garantir conformidade.
- **DeployIfNotExists:** Implanta recursos adicionais para garantir conformidade.

## Imagine a Situação: Ser Bloqueado por uma Política do Azure

Imagine que você está tentando implantar uma nova máquina virtual no Azure para testar uma aplicação. Você escolhe uma região aleatória, digamos **South India**, porque parece conveniente no momento. No entanto, ao tentar concluir a criação da VM, você recebe um erro: 

**"A criação de recursos nesta região não está permitida pela política da empresa."**

O que aconteceu? Você foi impedido por uma **Azure Policy** aplicada em sua organização! Essa política foi configurada pelo time de governança de TI para garantir que todos os recursos sejam criados apenas em regiões específicas, como **East US** e **West Europe**, por razões de conformidade e segurança.

![Policy Blocking](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/az-policy/04.png)

### Frustração? Sim. Mas por uma Boa Razão.

Parece frustrante ser bloqueado quando você só queria testar uma VM, certo? No entanto, o propósito dessa **regra** não é atrapalhar seu trabalho, mas sim proteger o ambiente da empresa e manter padrões consistentes. Veja o porquê:

- ✅ **Conformidade Legal:** Algumas empresas precisam armazenar dados apenas em regiões específicas por leis como a LGPD (Lei Geral de Proteção de Dados).
- ✅ **Otimização de Custos:** Restringir o uso de regiões mais caras pode reduzir significativamente os gastos.

### Como Resolver?

Se você precisar de uma exceção para essa política, você pode:

1. **Solicitar uma Isenção (Exemption):** Um administrador pode criar uma isenção temporária para um recurso específico.
2. **Testar em um Sandbox:** Se for um teste, você pode pedir acesso a um ambiente separado sem restrições.
3. **Propor uma Revisão da Política:** Se a necessidade for frequente, pode ser o caso de revisar a política e flexibilizar as regiões permitidas.

Essa experiência mostra como o **Azure Policy** ajuda a manter o controle e a segurança, mesmo quando parece um bloqueio.

## Azure Policy vs Azure RBAC (Controle de Acesso Baseado em Função)

Embora ambos estejam relacionados à governança e controle no Azure, eles têm propósitos diferentes:

| Aspecto                     | Azure Policy                        | Azure RBAC                      |
|-----------------------------|-------------------------------------|---------------------------------|
| **Objetivo Principal**      | Garantir conformidade de recursos  | Controlar permissões de acesso  |
| **Escopo de Aplicação**     | Regras de conformidade e segurança | Controle de ações de usuários   |
| **Exemplo de Uso**          | Negar criação de VMs não criptografadas | Restringir quem pode criar VMs |

![Policy vs RBAC](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/az-policy/03.png)

## Melhores Práticas ao Utilizar Azure Policy

- **Inicie com o Efeito Audit:** Antes de bloquear recursos, use \`Audit\` para monitorar o impacto das políticas.
- **Use Iniciativas:** Agrupe políticas relacionadas para facilitar a gestão.
- **Automatize com IAC:** Implemente Azure Policy como infraestrutura como código (IAC) para aplicar políticas de forma automatizada em pipelines CI/CD.
- **Exclua Recursos Sensíveis:** Utilize \`notScopes\` para excluir recursos ou grupos de recursos específicos de políticas rígidas.

## Conclusão

O **Azure Policy** é uma ferramenta essencial para garantir governança e conformidade no Azure. Ele proporciona controle robusto para organizações que buscam proteger seus ambientes de nuvem e manter padrões de segurança e conformidade regulatória.

Implementando boas práticas e monitoramento contínuo, sua organização pode manter um ambiente seguro e alinhado às políticas corporativas.

Ao estudar **Azure Policy** você estará se preparando para as certificações:

- [**Microsoft Certified: Azure Administrator Associate (AZ-104)**](https://learn.microsoft.com/pt-br/credentials/certifications/azure-administrator/?practice-assessment-type=certification)
- [**Microsoft Certified: Azure Security Engineer Associate (AZ-500)**](https://learn.microsoft.com/pt-br/credentials/certifications/azure-security-engineer/?practice-assessment-type=certification)  

Nos próximos artigos, irei demonstrar de forma prática projetos que implementei em organizações de nível enterprise.`,
    date: "2025-01-11",
    category: "Azure Policy",
    readTime: "15 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/o-que-%C3%A9-azure-policy-uma-vis%C3%A3o-completa-d51a274679d4"
  },
  {
    slug: "automatizando-infraestrutura-metodologias-ageis",
    title: "Automatizando Infraestrutura Moderna com Metodologias Ágeis",
    excerpt: "No mundo altamente competitivo em todas as áreas (iremos focar na tecnologia), a agilidade tornou-se uma característica indispensável, especialmente para profissionais de DevOps.",
    content: `No mundo altamente competitivo em todas as áreas (iremos focar na tecnologia), a agilidade tornou-se uma característica indispensável, especialmente para profissionais de DevOps (assim como eu). A implementação de metodologias ágeis, como o Scrum, transformou a maneira como projetos de infraestrutura são gerenciados e executados. Com o uso de ferramentas modernas como Terraform, Ansible, Puppet, ferramentas de Infraestrutura como Código (IaC), Azure DevOps, GitHub Actions e players de nuvem Azure e AWS, as equipes podem provisionar e migrar aplicativos de maneira eficiente e adaptável.

## Metodologias Ágeis em DevOps

As metodologias ágeis promovem uma abordagem iterativa e incremental, permitindo que as equipes respondam rapidamente às mudanças e entreguem valor continuamente. Em DevOps, isso se traduz em uma colaboração mais eficaz entre equipes de desenvolvimento e operações, facilitando a integração contínua e a entrega contínua (CI/CD).

![Metodologias Ágeis](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/agil/agil1.png)

**Componentes Chave do Scrum:**

- **Papéis:** Product Owner, ScrumMaster e Equipe de Desenvolvimento.
- **Ritos:** Sprint Planning, Daily Scrum, Sprint Review e Sprint Retrospective.
- **Artefatos:** Product Backlog, Sprint Backlog e Incremento.

Essa estrutura ajuda a garantir que todos os membros da equipe estejam alinhados e trabalhando de forma coesa para alcançar os objetivos do projeto.

## Provisionamento Ágil de Infraestrutura

O provisionamento ágil de infraestrutura é essencial para suportar a migração de aplicativos de forma segura e veloz, garantindo que o provisionamento seja executado de maneira eficiente. Utilizando IaC, as equipes podem definir, provisionar e gerenciar.

**Benefícios do Terraform e IaC:**

- **Consistência:** Garantia de que a infraestrutura seja provisionada de maneira idêntica em diferentes ambientes.
- **Automação:** Redução de erros humanos e aumento da eficiência operacional.
- **Versão de Controle:** Capacidade de rastrear mudanças na infraestrutura ao longo do tempo.

## Ciclo de Vida do Projeto Ágil

1. **Planejamento Inicial:** No Sprint Planning, a equipe define as necessidades de infraestrutura e divide o trabalho em histórias claras e gerenciáveis.
2. **Desenvolvimento Iterativo:** Durante os Sprints, a equipe trabalha em ciclos curtos, entregando incrementos de infraestrutura provisionada, testada e validada.
3. **Feedback Contínuo:** O Sprint Review permite que o PO e outros stakeholders forneçam feedback imediato, garantindo que a infraestrutura atenda às expectativas.
4. **Adaptação e Melhoria Contínua:** A Sprint Retrospective ajuda a equipe a identificar áreas de melhoria, ajustando processos e práticas para futuros Sprints.

![Ciclo Ágil](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/agil/agil2.png)

## Casos de Uso e Exemplos Práticos

Um exemplo prático da aplicação dessas metodologias pode ser visto em uma equipe DevOps responsável por migrar uma aplicação crítica para a nuvem Azure. Utilizando Scrum, Terraform e GitHub Actions, a equipe pode definir e automatizar a infraestrutura necessária, garantindo que cada parte do sistema esteja funcionando corretamente antes de avançar.

**Exemplo de Histórias de Usuário:**

- "Como administrador de sistema, quero provisionar servidores no Azure para garantir a migração contínua do aplicativo."
- "Como desenvolvedor, quero configurar pipelines CI/CD com GitHub Actions para automatizar testes e implementações."

## Conclusão

A integração de metodologias ágeis com ferramentas modernas como Terraform, GitHub Actions e Azure transforma a maneira como os profissionais de DevOps gerenciam projetos de provisionamento de infraestrutura. A abordagem ágil permite que as equipes naveguem pelas complexidades do provisionamento de infraestrutura com confiança, mantendo a flexibilidade necessária para adaptar-se às mudanças e garantindo a entrega contínua de valor. Em um ambiente de TI em constante evolução, a agilidade, juntamente com a automação e a colaboração, é a chave para o sucesso sustentado.

![Logo](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png)`,
    date: "2024-10-29",
    category: "Metodologias Ágeis",
    readTime: "12 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/automatizando-infraestrutura-moderna-com-metodologias-%C3%A1geis-a89cccade631"
  },
  {
    slug: "explorando-ia-generativa",
    title: "Explorando a Inteligência Artificial Generativa",
    excerpt: "Desde o lançamento do ChatGPT pela OpenAI, a IA generativa ganhou destaque global. Descubra o que é, suas aplicações e as implicações éticas e econômicas dessa tecnologia emergente.",
    content: `
## Introdução

A inteligência artificial (IA) tem transformado diversos setores e aspectos da vida cotidiana, e a chegada da IA generativa marca uma nova era de inovação e possibilidades. Desde o lançamento do ChatGPT pela OpenAI, em novembro de 2022, a IA generativa ganhou destaque global, impactando tanto o mercado quanto a sociedade. Este artigo explora o que é a IA generativa, suas aplicações e as implicações éticas e econômicas que acompanham essa tecnologia emergente.

## O Que é IA Generativa?

IA generativa refere-se a sistemas de inteligência artificial capazes de criar conteúdo de alta qualidade, como texto, imagens e áudio. Esses sistemas utilizam modelos avançados, conhecidos como grandes modelos de linguagem (LLMs), para prever e gerar conteúdo com base em grandes volumes de dados. O ChatGPT, por exemplo, pode gerar respostas detalhadas e contextualizadas para perguntas, criar textos criativos e até mesmo produzir recomendações personalizadas.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/IA-Gen/1.png)

## Aplicações e Impacto Econômico

As aplicações de IA generativa são vastas e variadas. Empresas como Google e Microsoft possuem seus produtos, como o Gemini e o Copilot, respectivamente. Essas ferramentas permitem que os usuários gerem textos e imagens a partir de comandos simples, chamados de prompts. Além disso, a IA generativa está revolucionando o desenvolvimento de software, tornando a criação de aplicações de IA mais velozes e menos custosa.

Estudos indicam que a IA generativa pode adicionar entre 2,6 a 4,4 trilhões de dólares à economia global anualmente. [A Goldman Sachs estima que essa tecnologia pode aumentar o Produto Interno Bruto (PIB) global em 7% na próxima década](https://blog.mackenzie.br/vestibular/3-carreiras-para-trabalhar-com-inteligencia-artificial-ia/). Contudo, também há preocupações sobre o impacto na força de trabalho, [com estimativas de que cerca de 10% das tarefas realizadas por mais de 80% dos trabalhadores nos Estados Unidos poderiam ser afetadas pela IA generativa](https://pt.euronews.com/next/2023/03/24/estes-sao-os-postos-de-trabalho-que-poderao-ser-mais-afetados-pela-inteligencia-artificial).

## Como a IA Generativa Funciona?

O funcionamento da IA generativa é baseado em aprendizado supervisionado, onde modelos são treinados para prever a próxima palavra ou imagem em uma sequência com base em dados anteriores. Este processo envolve grandes volumes de dados textuais e de imagens que ajudam os modelos a aprender padrões e gerar conteúdo coerente e relevante.

Por exemplo, ao solicitar a criação de uma imagem de "uma maçã vermelha", o modelo usa técnicas de aprendizado profundo para gerar uma imagem que corresponde à descrição fornecida. Este processo pode ser refinado através de ajustes nos prompts e parâmetros do modelo, permitindo a geração de conteúdos altamente específicos e detalhados.

## Desafios e Limitações

Apesar do potencial, a IA generativa enfrenta desafios significativos. Um dos principais problemas é a questão das "alucinações", onde o modelo pode gerar informações incorretas ou fictícias de forma convincente. Além disso, a IA tem limitações de conhecimento, pois só pode acessar dados até o momento em que foi treinada, o que pode levar à desatualização de informações.

Outro aspecto crucial é a questão ética, especialmente no que diz respeito ao viés e ao uso responsável da tecnologia. Como os modelos são treinados com dados disponíveis na internet, eles podem refletir e perpetuar preconceitos existentes na sociedade. Portanto, é fundamental que desenvolvedores e usuários estejam cientes dessas questões e trabalhem para mitigá-las.

## Aplicando IA Generativa em Aplicações de Software

A construção de aplicações de software com IA generativa tem se tornado mais fácil e eficaz, graças aos avanços dessa tecnologia. Por exemplo, a criação de sistemas para leitura de avaliações de restaurantes para monitoramento de reputação antes exigia um grande esforço de engenharia de machine learning, incluindo a coleta de dados, o treinamento de modelos e a implantação em nuvem. Esse processo, que poderia levar meses, agora pode ser simplificado com a IA generativa.

Hoje, com o desenvolvimento baseado em prompts, a criação de um classificador de sentimentos pode ser reduzida a apenas algumas linhas de código. Um exemplo clássico é o uso de prompts para classificar uma avaliação de restaurante como positiva ou negativa. Anteriormente, esse processo envolvia rotular centenas ou milhares de exemplos para treinar um modelo. Agora, com uma simples chamada a um grande modelo de linguagem (LLM), é possível obter uma classificação de sentimento com precisão e eficiência.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/IA-Gen/4.png)

## Impacto na Produtividade e Desenvolvimento

A redução da barreira para a construção de aplicações com IA generativa está permitindo uma alta demanda de novos aplicativos. Tarefas que antes levavam de 6 a 12 meses para serem desenvolvidas agora podem ser concluídas em dias ou semanas. Isso é especialmente benéfico para empresas que precisam de soluções rápidas e eficazes para problemas complexos.

## Desafios e Soluções

Apesar das vantagens, a IA generativa ainda enfrenta desafios, como a precisão em cálculos e a execução de ações críticas. Por exemplo, ao responder a uma pergunta sobre juros compostos, um LLM pode não fornecer uma resposta precisa sem o auxílio de ferramentas adicionais, como uma calculadora. Nesse contexto, a utilização de ferramentas auxiliares se torna essencial para aumentar a precisão e a funcionalidade das respostas.

Além disso, a verificação das ações sugeridas pela IA é crucial para evitar erros custosos. Em sistemas de atendimento ao cliente, por exemplo, é importante implementar mecanismos de confirmação antes de concluir transações, garantindo assim que as respostas geradas sejam precisas e seguras.

## Avanços Futuramente Possíveis

O futuro da IA generativa em software está repleto de possibilidades empolgantes. Pesquisadores estão explorando o uso de agentes baseados em LLMs que podem tomar decisões complexas e executar sequências de ações. Embora essa tecnologia ainda esteja em fase experimental, ela promete transformar a maneira como interagimos com sistemas de IA, possibilitando uma automação ainda mais avançada e personalizada.

## Objetivos de Aprendizagem

1. Analisar fluxos de trabalho e identificar novas oportunidades de negócios que surgem do potencial da IA generativa para melhorar a eficiência, produtividade e geração de valor.
2. Reconhecer que a IA automatiza principalmente tarefas dentro dos trabalhos, não funções inteiras, e avaliar tarefas para o potencial da IA generativa com base em dois critérios principais: viabilidade técnica e valor comercial.
3. Discutir as principais preocupações que surgem da adoção da IA generativa e dos grandes modelos de linguagem (LLMs), incluindo perda de empregos, amplificação dos piores impulsos da humanidade e extinção humana.
4. Listar os princípios da IA responsável, incluindo justiça, transparência, privacidade, segurança e uso ético, e aprender estratégias para garantir o desenvolvimento e a implantação de IA de forma ética e socialmente responsável.

## Uso Cotidiano de LLMs em Interfaces Web

Com o avanço da IA generativa, muitas profissões têm integrado essa tecnologia em suas atividades diárias, utilizando interfaces web para acessar LLMs. Profissionais de marketing, por exemplo, utilizam essas ferramentas para gerar ideias de campanhas de e-mail, enquanto recrutadores podem resumir avaliações de candidatos. Programadores também se beneficiam ao gerar rascunhos iniciais de códigos, embora muitas vezes seja necessário corrigir erros. A versatilidade dos LLMs permite sua aplicação em diversas funções, servindo como assistentes de escrita ou editores de texto, e até mesmo como parceiros de pensamento para explorar ideias e soluções.

## Análise de Tarefas de Trabalhos

Uma abordagem eficaz para implementar a IA generativa é identificar tarefas específicas dentro de funções de trabalho que podem ser automatizadas ou aprimoradas. Em vez de substituir empregos inteiros, a IA geralmente se concentra em automatizar tarefas. A viabilidade técnica e o valor comercial dessas tarefas são critérios fundamentais para avaliar o potencial da IA generativa. Por exemplo, a automatização de respostas de chat pode ser viável e valiosa, enquanto a realização de conversas telefônicas complexas ainda pode ser desafiadora.

## Exemplos de Análise de Tarefas em Diferentes Funções

Ao analisar diferentes funções de trabalho, pode-se descobrir que as melhores oportunidades para a IA generativa não são necessariamente as mais óbvias. Programadores, por exemplo, fazem mais do que apenas escrever código; eles também documentam e revisam códigos. Cada tarefa tem diferente grau de potencial para automação ou aprimoramento com IA, e uma análise sistemática pode ajudar a identificar onde a IA pode ser mais útil.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/IA-Gen/2.png)

## Novos Fluxos de Trabalho e Oportunidades de Crescimento

A implementação da IA generativa não só pode economizar custos, mas também criar novas oportunidades de crescimento. Por exemplo, ao tornar a redação de cópias para websites mais eficiente, os profissionais de marketing podem testar múltiplas versões de conteúdo para identificar a mais eficaz. Além disso, empresas podem explorar a automatização de tarefas realizadas por seus clientes, oferecendo produtos ou serviços mais eficazes e personalizados. Este replanejamento de fluxos de trabalho pode resultar em modelos de negócios inovadores e maior valor agregado.

## Preocupações com a IA e Implicações Éticas

Com o uso crescente da IA, surgem preocupações sobre seu impacto na sociedade. Isso inclui o potencial de amplificação dos piores impulsos humanos, como preconceitos e desinformação, bem como a ameaça de perda de empregos devido à automação. A questão ética é central, destacando a necessidade de desenvolver e usar IA de maneira justa, transparente, segura e ética. Técnicas como o aprendizado por reforço com feedback humano (RLHF) estão sendo usadas para tornar os LLMs menos tendenciosos e mais alinhados com valores humanos.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/IA-Gen/3.png)

## Inteligência Artificial Geral (AGI) e o Futuro da IA

A IA Geral (AGI) é um conceito de inteligência artificial capaz de realizar qualquer tarefa intelectual que um humano possa. Apesar do entusiasmo, estamos ainda longe de alcançar a AGI. Entretanto, a IA generativa já está provocando transformações significativas, especialmente entre trabalhadores do conhecimento. As estimativas indicam que a AGI poderá revolucionar setores inteiros, criando novos empregos e oportunidades de crescimento, ao mesmo tempo em que levanta questões sobre seu impacto potencial na sociedade e na economia.

## Conclusão

A IA generativa oferece vastas oportunidades para melhorar a eficiência e criar novos valores nos negócios. No entanto, é crucial abordar suas implicações éticas e sociais para garantir que a tecnologia seja usada de maneira responsável e benéfica. Empresas e profissionais devem se preparar para integrar a IA generativa em seus processos, aproveitando seu potencial para inovação e crescimento, ao mesmo tempo em que garantem o desenvolvimento responsável e ético da IA.
`,
    date: "2023-10-27",
    category: "Inteligência Artificial",
    readTime: "7 min",
    mediumUrl: "https://orafaelferreiraa.medium.com/explorando-a-intelig%C3%AAncia-artificial-generativa-154bd7aa96cf"
  },
  {
    slug: "estrategias-modernizacao-6rs",
    title: "Estratégias de Modernização de Aplicações: Aplicando os 6Rs com o Cloud Adoption Framework",
    excerpt: "A modernização de aplicações na nuvem é extremamente importante para que as organizações maximizem suas capacidades oferecidas pela computação em nuvem.",
    content: `## Introdução

A modernização de aplicações na nuvem é extremamente importante para que as organizações maximizem suas capacidades oferecidas pela computação em nuvem. No contexto do Microsoft Azure, as estratégias de modernização podem ser categorizadas em quatro grandes abordagens: **Innovate**, **Migrate**, **Modernize** e **Retire**. Cada uma dessas abordagens oferece diferentes caminhos para otimizar, reestruturar ou descontinuar aplicações, de acordo com as necessidades específicas de negócios e tecnologia. Neste artigo, exploraremos essas estratégias detalhadamente, utilizando o framework dos 6Rs como base para a tomada de decisões.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/1.png)

### 1. Innovate

**Inovar na nuvem** vai além da simples migração de aplicações existentes. Trata-se de reimaginar e reconstruir aplicações para explorar as capacidades e possibilidades únicas que a nuvem oferece. A inovação envolve transformações profundas, como a reestruturação da arquitetura ou até a reconstrução completa das aplicações. As abordagens dentro da categoria **Innovate** incluem:

#### Rearchitect (Rearquitetar):

Rearquitetar consiste em uma reestruturação significativa da arquitetura da aplicação, visando otimizar seu desempenho e funcionalidade no ambiente de nuvem. Esse processo pode envolver a adoção de abordagens modernas, como microsserviços, computação serverless e arquiteturas orientadas a eventos. Essas abordagens melhoram a escalabilidade granular e aumentam a resiliência da aplicação, permitindo que ela responda de forma eficiente a variações de demandas e falhas.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/Rearchitect.png)

**Quando usar Rearquitetar:**

- **Alta Escalabilidade e Resiliência:** Use quando a aplicação precisa escalar e resistir a variações na demanda.
- **Limitações Estruturais:** Quando a arquitetura atual impede a adoção de novas tecnologias ou cenários modernos.

#### Rebuild (Reconstruir):

Reconstruir é a abordagem ideal quando a aplicação atual não pode ser adaptada para atender às necessidades futuras ou novas demandas de negócios. Ao reconstruir uma aplicação do zero utilizando, por exemplo, tecnologias cloud native, é possível introduzir novas funcionalidades, melhorar a escalabilidade e flexibilidade, e alinhar a aplicação com as melhores práticas de desenvolvimento moderno. Essa abordagem facilita a criação de soluções compatíveis com as capacidades avançadas da nuvem, como inteligência artificial (IA), machine learning e análises em tempo real.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/Rebuild.png)

**Quando usar Reconstruir:**

- Inadequação Tecnológica: Use quando a aplicação não acompanha as demandas tecnológicas atuais ou futuras.
- Aproveitamento Máximo da Nuvem: Quando o objetivo é explorar ao máximo capacidades como IA e machine learning.

#### Replace (Substituir):

A abordagem **Replace** consiste em substituir uma aplicação existente por uma solução de **Software as a Service (SaaS)** ou outra solução comercial pronta. Essa estratégia permite à empresa evitar os custos e o tempo envolvidos na modificação ou manutenção de uma aplicação legada, optando por uma solução que já atende de forma mais eficiente às necessidades do negócio. Ao adotar uma solução SaaS, a organização também se beneficia de atualizações contínuas, suporte especializado e a possibilidade de escalabilidade sem a complexidade de gerenciar a infraestrutura subjacente.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/Replace.png)

**Quando usar Replace:**

- SaaS como Solução Ideal: Quando uma solução SaaS moderna atende melhor às necessidades do negócio e pode ser implementada facilmente.
- Custo-Benefício: Quando os custos de manter ou modernizar a aplicação atual superam os benefícios, tornando a substituição por uma solução pronta mais econômica e estratégica.

#### Inovação Relacionada à Adoção da Nuvem

A inovação na nuvem é um diferencial competitivo, vai além da migração ou modernização, desbloqueando novas capacidades técnicas e expandindo as possibilidades de negócios. No **Cloud Adoption Framework**, o foco é entender profundamente as necessidades dos clientes e criar inovações que transformem a forma como eles interagem com os produtos da empresa.

Para saber mais sobre o CAF, [confira esse artigo](https://orafaelferreira.com/posts/foundation-cloud/) no meu blog.

**Implementação de Inovação com MVPs**

Uma abordagem eficaz é começar com um Produto Mínimo Viável (MVP), que é uma versão inicial de um novo recurso ou aplicação. O MVP oferece funcionalidade suficiente para coletar feedback dos usuários e validar a possibilidade da inovação. Esse processo de construir, medir e aprender permite ajustes rápidos para atender melhor às necessidades dos clientes.

### 2. Migrate

A migração para a nuvem é a maneira mais rápida de levar aplicações ao Azure, permitindo que as organizações operem na nuvem da mesma forma que estava no onpremise. Essa abordagem é especialmente vantajosa para empresas que buscam agilidade na transição, aproveitando rapidamente os benefícios da escalabilidade, flexibilidade e redução de custos operacionais, o famoso OPEX . A principal estratégia dentro da categoria **Migrate** é o **Rehost**, também conhecido como "vai do jeito que dá", traduzido do lift-and-shift.

#### Rehost (Reospedagem):

O Rehost envolve mover aplicações para a nuvem sem modificar o código ou a arquitetura existente, um exemplo prático é mover uma virtual machine do jeito que ela se encontra no onpremise para a cloud. Essa abordagem é ideal para empresas que desejam desativar rapidamente datacenters locais ou que precisam migrar urgentemente, mas cujas aplicações já atendem aos requisitos de negócios e não necessitam de mudanças significativas no curto prazo.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/Rehost.png)

**Quando Usar Migrate:**

- **Migração Urgente:** Move aplicações para a nuvem rapidamente, com mínima complexidade.
- **Preservação de Funcionalidade:** Mantém as aplicações inalteradas enquanto as transfere para a nuvem.

#### Visão Geral da Migração no Azure

O processo de migração para o Azure é estruturado para garantir uma transição suave e eficaz, minimizando riscos e maximizando os benefícios da nuvem. A migração segue a metodologia do **Cloud Adoption Framework (CAF)**, dividida em quatro estágios principais: **Preparação**, **Avaliação**, **Implantação** e **Liberação**.

1. **Preparação:** Garante que todos os pré-requisitos sejam atendidos e que as equipes estejam prontas para o projeto. Inclui o alinhamento organizacional, a seleção de regiões do Azure e a preparação da infraestrutura necessária.
2. **Avaliação:** Analisa as cargas de trabalho e o ambiente existente para identificar a melhor abordagem de migração, documentando a complexidade do cenário.
3. **Implantação:** Replicação e modernização das cargas de trabalho na nuvem, preparando-as para a gestão contínua.
4. **Liberação:** Testes, otimização e liberação das cargas de trabalho para as operações, com documentação completa do processo.

#### Ferramentas para Migração:

| **Ferramenta**                                | **Funcionalidade**                          | **Descrição**                                                                                       |
|-----------------------------------------------|---------------------------------------------|------------------------------------------------------------------------------------------------------|
| Migrações para Azure: Descoberta e Avaliação  | Avaliar servidores locais (SQL, Web)        | Avalia servidores VMware, Hyper-V e físicos para migração para o Azure.                               |
| Migração e Modernização                       | Migrar servidores                           | Migra VMs de VMware, Hyper-V, servidores físicos e VMs públicas para Azure.                           |
| Assistente de Migração de Dados               | Avaliar bancos de dados SQL Server          | Avalia e identifica bloqueadores e melhorias para migração de SQL Server.                             |
| Serviço de Migração de Banco de Dados do Azure| Migrar bancos de dados                      | Migra bancos de dados locais para SQL Server no Azure.                                                |
| Migration Assistant de Aplicativo Web         | Avaliar e migrar aplicativos Web            | Avalia e migra aplicativos .NET e PHP para o Serviço de Aplicativo do Azure.                          |
| Azure Data Box                                | Migrar dados offline                        | Transfere grandes volumes de dados offline para o Azure.                                              |


### 3. Modernize

Modernizar aplicações é um algo fundamental para extrair o máximo valor dos recursos nativos da nuvem. Diferente de uma simples migração, a modernização envolve ajustes na arquitetura ou na plataforma da aplicação, sem necessidade de reestruturação completa. A principal abordagem dentro da categoria **Modernize** é o **Replatform**.

#### Replatform (Replataforma):

O Replatform envolve pequenas alterações na aplicação para que ela execute de maneira mais eficiente no ambiente de nuvem. Isso pode incluir a migração de um banco de dados para uma solução gerenciada ou a adaptação da infraestrutura para utilizar serviços de Plataforma como Serviço (PaaS). Essa abordagem melhora a eficiência operacional e reduz o custo total de propriedade (TCO), mantendo a integridade das funcionalidades principais.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/Replatform.png)

**Quando Usar Modernize:**

- **Aproveitamento de Recursos Nativos da Nuvem:** Quando a aplicação pode se beneficiar significativamente dos recursos nativos da nuvem, como serviços gerenciados e automação, sem grandes mudanças estruturais.
- **Foco em Eficiência e Redução de Custos:** Quando o objetivo principal é melhorar a eficiência operacional e reduzir o TCO, aproveitando os serviços gerenciados da nuvem.

#### Modernização na Nuvem: Uma Abordagem Estruturada

A modernização é estruturada em duas fases principais:

1. **Alinhamento de Negócios:** Identifica as cargas de trabalho que mais irão se beneficiar da modernização e estabelece um roteiro detalhado para alcançar esses objetivos.
2. **Estratégias de Modernização:** Adota novas tecnologias e metodologias, como DevOps e PaaS, para aprimorar processos, aplicativos e bancos de dados.

**Benefícios da Modernização:**

- **Maximização da Produtividade:** Libera as equipes para focarem na inovação, reduzindo a sobrecarga de gerenciamento.
- **Redução de Custos:** Adotar soluções PaaS e modernizar processos operacionais, diminuindo os custos de manutenção de infraestrutura.
- **Aumento da Agilidade:** Agiliza a resposta às mudanças de mercado, permitindo lançamentos rápidos de novas funcionalidades.

#### Implementação de PaaS para Modernização

A modernização pode ser realizada através de várias soluções de PaaS, cada uma oferecendo um equilíbrio diferente entre controle e produtividade:

- **Container PaaS:** Como o Azure Kubernetes Service (AKS) e Azure Red Hat OpenShift, oferecem maior controle sobre cargas de trabalho, gerenciando todo o cluster, manutenção e implementação.

- **Application PaaS:** Recursos como Azure App Service, Azure Spring Cloud e Azure Functions proporcionam um facilidade entre controle e produtividade, onde a plataforma gerencia a disponibilidade e a implementação.

- **Low/No Code PaaS:** Ferramentas como Power Apps e Power Automate permitem a construção rápida de aplicações com pouca ou nenhuma codificação, maximizando a produtividade e o tempo de mercado.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/3.png)

Se ainda estiver em dúvida, confira a árvore de decisões abaixo para identificar qual serviço de computação na Azure melhor atende às suas necessidades

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/4.png)

#### Modernização de Bancos de Dados na Nuvem

A modernização de bancos de dados pode melhorar significativamente a forma como você armazena, processa e utiliza dados. O objetivo é aumentar a confiabilidade, o desempenho e reduzir custos. Existem soluções de **PaaS** e **IaaS** disponíveis para modernizar qualquer tipo de banco de dados na nuvem.

**Categorias de Soluções de Banco de Dados:**

- **Azure SQL**: Soluções para SQL Server e outros bancos de dados SQL de código fechado.
- **Open-source e NoSQL**: Soluções para bancos de dados SQL de código aberto e NoSQL.

Cada categoria de banco de dados oferece três soluções: duas de **PaaS** e uma de **IaaS**. Essas opções permitem um equilíbrio entre controle e produtividade, suportando diferentes origens de bancos de dados.

**Azure SQL:**

- **SQL Server em máquinas virtuais (IaaS)**
- **Azure SQL Managed Instance (PaaS)**
- **Banco de Dados Azure SQL totalmente gerenciado (PaaS)**

**Open-source SQL & NoSQL:**

- **MySQL, MariaDB ou PostgreSQL em máquinas virtuais (IaaS)**
- **Azure Cosmos DB e Azure Managed Instance para Apache Cassandra (PaaS)**
- **Bancos de dados MySQL, MariaDB e PostgreSQL totalmente gerenciados (PaaS)**

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/5.png)

### 4. Retire (Desativar)

À medida que as organizações evoluem, nem todas as aplicações continuam a agregar valor. Em alguns casos, a estratégia mais eficiente é desativar ou aposentar uma aplicação. O processo de **Retire** envolve a desativação de aplicações que não são mais necessárias ou que foram substituídas por soluções mais modernas e eficientes. Essa abordagem simplifica a infraestrutura de TI e otimiza os recursos, redirecionando esforços e investimentos para áreas que realmente necessitam de suporte.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/retire.png)

**Quando usar Retire:**

- **Substituição por Alternativas Modernas:** Quando a aplicação foi substituída por uma solução mais moderna que oferece maior eficiência e alinhamento com as metas de negócios.
- **Manutenção Injustificável:** Quando a aplicação exige um esforço de manutenção desproporcional aos benefícios que oferece.
- **Redução de Complexidade:** Quando a simplificação da infraestrutura é uma prioridade, aposentando sistemas legados para melhorar a agilidade da TI.

#### Processo de Retire: Passos para Desativação Eficiente

1. **Avaliação de Aplicações:** Análise da relevância e do custo de manutenção da aplicação para o negócio.
2. **Planejamento de Desativação:** Documentação completa e comunicação clara com stakeholders sobre o processo de desativação.
3. **Execução da Desativação:** Realização de backups, arquivamento de dados e desativação controlada da aplicação.
4. **Revisão Pós-Desativação:** Monitoramento do ambiente após a desativação e preparação de um relatório final.

**Benefícios de Retirar Aplicações:**

- **Simplificação da Infraestrutura:** Reduz a complexidade operacional e os custos associados.
- **Otimização Financeira (FinOps):** Otimiza a utilização e o custo dos recursos na nuvem.
- **Sustentabilidade (GreenOps):** Reduz o consumo de energia e promove práticas de TI mais verdes.

## Conclusão

A modernização de aplicações na nuvem é um processo que exige uma análise cuidadosa de cada aplicação em relação às necessidades do negócio e às capacidades da nuvem. As estratégias agrupadas em **Innovate**, **Migrate**, **Modernize** e **Retire** fornecem um framework flexível para orientar as decisões de modernização. Ao aplicar essas estratégias, as organizações não apenas migram para a nuvem, mas também garantem que suas aplicações estejam otimizadas para o futuro, oferecendo o máximo valor ao negócio.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/6rs/2.png)

Este artigo oferece uma visão clara das opções disponíveis para a modernização de aplicações, auxiliando você a tomar decisões importantes e a planejar uma transição bem-sucedida para a nuvem.`,
    date: "2024-08-22",
    category: "Cloud Adoption Framework",
    readTime: "35 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/estrat%C3%A9gias-de-moderniza%C3%A7%C3%A3o-de-aplica%C3%A7%C3%B5es-aplicando-os-6rs-com-o-cloud-adoption-framework-01ad6bf88ed8"
  },
  {
    slug: "azure-workbooks-finops",
    title: "Utilizando Azure Workbooks para Otimização de Custos com FinOps",
    excerpt: "Explore como Azure Workbooks se torna um aliado essencial para práticas de FinOps, fornecendo dashboards interativos para monitoramento de custos, identificação de recursos órfãos e otimização financeira na nuvem Azure.",
    content: `![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/Arte-Logo.png)

## Introdução

A gestão eficaz dos custos na nuvem é um algo real e impactante para muitas organizações que adotaram a computação em nuvem. O FinOps ([Caso queira saber mais sobre FinOps, visite o meu artigo anterior](https://orafaelferreira.com/posts/finops-foundation-cloud/)), ou Operações Financeiras, é um conjunto de práticas que combinam Finanças e DevOps para otimizar a utilização e o custo dos recursos na nuvem. Uma ferramenta poderosa que a Microsoft Azure oferece para ajudar nessa tarefa é o Azure Workbooks. Neste artigo, irei utilizar o Azure Workbooks. Mas o que são Azure Workbooks?

## O que são [Azure Workbooks](https://learn.microsoft.com/pt-br/azure/azure-monitor/visualize/workbooks-overview)?

Azure Workbook são dashboards interativos e modulares que são usados para criar relatórios e visualizações no Azure Monitor. Eles permitem criar visões personalizadas que podem incluir métricas, logs e dados de outras fontes do Azure, proporcionando uma visão consolidada e interativa do ambiente de nuvem.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/15.webp)

## Principais Benefícios do Azure Workbooks

- **Visualizações Interativas:** Crie gráficos, tabelas e relatórios interativos que podem ser personalizados para atender às necessidades específicas do negócios e operações.
- **Integração com Dados do Azure:** Combine dados de várias fontes do Azure, incluindo logs de atividades, métricas de desempenho e informações de faturamento.
- **Compartilhamento e Colaboração:** Os Workbooks podem ser compartilhados com diferentes equipes, facilitando a colaboração entre finanças, operações e TI.
- **Automação e Atualização Contínua:** Configure atualizações automáticas para garantir que os dados exibidos estejam sempre atualizados.

## Como Azure Workbooks Apoia o FinOps

1. **Monitoramento de Custos em Tempo Real**
   - Utilize Azure Workbooks para criar dashboards que monitoram os custos em tempo real. Isso permite uma resposta rápida a quaisquer desvios ou aumentos inesperados de custo.

2. **Análise de Tendências de Consumo**
   - Análises históricas de consumo de recursos podem ser visualizadas através de gráficos de tendência. Isso ajuda a identificar padrões de uso que podem ser otimizados.

3. **Alocação de Custos**
   - Crie relatórios detalhados para alocação de custos entre diferentes departamentos ou projetos. Isso é essencial para entender quais áreas estão consumindo mais recursos e como otimizar a alocação.

4. **Identificação de Recursos Subutilizados**
   - Utilize relatórios de utilização de recursos para identificar instâncias e serviços subutilizados que podem ser redimensionados ou desligados para economizar custos.

5. **Planejamento e Orçamentação**
   - Utilize dados históricos e previsões para ajudar no planejamento de orçamentos futuros. Azure Workbooks pode integrar dados de várias fontes para fornecer uma visão abrangente para o planejamento financeiro.

6. **Gerenciamento de Recursos Órfãos**
   - Recursos órfãos são aqueles que não estão mais sendo utilizados ativamente, mas continuam a gerar custos. Identificar e gerenciar recursos órfãos ajuda a economizar dinheiro, prevenir configurações incorretas e simplificar a gestão operacional do ambiente Azure.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/12.webp)


## Exemplo Prático 1: Cost Optimization Workbook

### Configuração Inicial
   - [Deploy to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.costmanagement%2Foptimization-workbook%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.costmanagement%2Foptimization-workbook%2FcreateUiDefinition.json)
   - Acesse o Azure Portal e navegue até o Monitor.
   - Selecione "Workbooks" no menu e verifique se a sua assinatura está selecionada no filtro de assinaturas.
   - Selecione o "Cost Optimization Workbook".

![ Cost Optimization Workbook](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/1.png)


### Principais Componentes do Workbook

- **Visão Geral:** Baseado no Microsoft Azure Well-Architected Framework (WAF) ([Caso queira saber mais sobre o WAF, visite o meu artigo anterior](https://orafaelferreira.com/posts/well-architect-foundation-cloud/)), fornece princípios para equilibrar objetivos de negócios com necessidades tecnológicas, reduzindo desperdícios e melhorando a eficiência operacional.
- **Recursos e Governança:** Indica funcionalidades implementadas que seguem os princípios de Otimização de Custos e Governança de Custos.
- **Pré-requisitos:** Requer funções mínimas de Reader e Workbook Contributor para importar e salvar o workbook, além de ações de "Quick Fix" documentadas com permissões específicas.

Na aba Usage optimization, temos a opção Top 10 services:

![Top 10 services](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/2.png)

## Exemplo Prático 2: Azure Orphaned Resources Workbook

O Azure Orphaned Resources Workbook centraliza recursos órfãos em ambientes Azure, ajudando a melhorar a eficiência através da economia de dinheiro, prevenção de configurações incorretas e simplificação operacional.

### Como Utilizar o [Azure Orphaned Resources Workbook](https://github.com/dolevshor/azure-orphan-resources)

1. **Importação do Workbook**
   - Acesse o Azure Portal e vá para 'Azure Workbooks'.
   - Clique em '+ Create' e depois em '+ New'.
   - Abra o Editor Avançado usando o botão '</>' na barra de ferramentas.
   - Selecione o 'Gallery Template'.
   - Substitua o código JSON pelo código fornecido para ['Azure Orphaned Resources v2.0'](https://github.com/dolevshor/azure-orphan-resources/tree/main/Workbook) **OBS: Deixei o link para você copiar o código e sempre utilizar a versão mais atual**
   - Clique em 'Apply' e depois em 'Save'.
   - Insira um título, assinatura, grupo de recursos e localização para o workbook.
   - Clique em 'Save'.

2. **Visualização do Workbook**
   - Navegue até 'Workbooks' e clique no workbook 'Orphaned Resources'.

![Orphaned App Service Plans](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/3.png)

### Principais Componentes do Workbook

- **Tipos de Recursos Incluídos:**
  - Compute
  - App Service Plans
  - Storage
  - Managed Disks
  - Public IPs
  - Load Balancers
  - Application Gateways
  - Virtual Networks
  - Private Endpoints
  - Virtual Network Gateways
  - Outros (Resource Groups, API Connections, Certificates)

### Benefícios do Workbook

- **Economia de Dinheiro:** Identifica recursos órfãos que ainda geram custos desnecessários.
- **Prevenção de Misconfiguração:** Ajuda a evitar configurações incorretas mantendo a infraestrutura organizada.
- **Simplificação Operacional:** Centraliza a visualização de recursos órfãos, facilitando a gestão e manutenção do ambiente Azure.

### Abaixo seguem alguns exemplos:

Orphaned App Service Plans:
![Orphaned App Service Plans](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/4.png)
Orphaned Application Gateway:
![Orphaned Application Gateway](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/5.png)
Orphaned Managed Disks, podemos fazer o download do conteúdo conforme imagem: 
![Orphaned Managed Disks](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/6.png)

Esse é um exemplo da planilha que é exportada, podemos então apresentar aos times responsáveis para possível exclusão dos recursos.
![export_data](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/7.png)

## Exemplo Prático 3: Azure FinOps Workbook

O Azure FinOps Workbook fornece insights, documentos chaves e orientações sobre a implementação de FinOps e otimização de custos no Azure. Ele visualiza os dados do seu ambiente Azure junto com recomendações e guias relevantes, incentivando uma abordagem orientada por dados.

### Como Utilizar o [Azure FinOps Workbook](https://github.com/ms-sambell/azure-finops-workbook/tree/main?tab=readme-ov-file)

1. **Importação do Workbook**
   - Copie o [conteúdo](https://github.com/ms-sambell/azure-finops-workbook/blob/main/workbook.json) do arquivo \`workbook.json\`.
   - Acesse a página de Azure Workbooks e clique em "New".
   - Clique no botão de código \`</>\`.
   - Cole o conteúdo copiado na página e clique em "Apply".
   - Salve o workbook (se tiver permissões) e clique em "Done Editing".

### Principais Componentes do Workbook

- **Inclusões:**
  - Auditoria de Licença Híbrida
  - Auditoria de Tagging
  - Exemplos práticos de FinOps / Automação
  - Insights de otimização de custos para Storage Accounts, AKS, Log Analytics, recursos órfãos, Recovery Services, App Services e VMs.

### Requisitos para Utilização

- **Permissões:** Acesso de leitura aos recursos que você está investigando no Azure. Para salvar o workbook, você precisa de permissões para criar um Azure Workbook.
- **AKS:** Informações de AKS requerem o uso do Container Insights.
- **Recomendação:** Acesso de leitura sobre toda a assinatura/grupos de gerenciamento para ativar todos os painéis do workbook.

![FinOps Insights - Workbook](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/8.png)

Na sessão de Governance temos Tag:

![Tags](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/9.png)

![Tags](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/10.png)

E essa que considere uma das melhoras melhor: Cost Optimization

![Recursos órfãos](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-workbooks/11.png)

## Reflexão
Mas você deve estar se perguntando, a mas vou utilizar somente um, por exemplo, o último do FinOps que possui todas as informações. Mas lembre-se sempre, nenhum remédio irá te curar de todas as dores, nada melhor que usar algo específico para a sua dor!

## GreenOps: Como Azure Workbooks é um Aliado na Gestão Sustentável

Azure Workbooks pode ser um aliado poderoso para práticas de GreenOps, fornecendo dashboards e insights que facilitam a gestão sustentável nas operações de TI. Para mais informações sobre GreenOps, visite meu artigo completo [aqui](https://orafaelferreira.com/posts/green-computing-foundation-cloud/). Aqui estão algumas formas de como Azure Workbooks pode ajudar:

1. **Identificação de Recursos Subutilizados**
   - Azure Workbooks ajuda a identificar recursos subutilizados, permitindo ajustes ou desativações para reduzir o consumo de energia e os custos operacionais.

2. **Análise de Padrões de Uso**
   - Fornece gráficos e análises que permitem observar padrões de uso, possibilitando ajustes operacionais para otimizar o uso de energia.

3. **Otimização de Custos e Recursos**
   - Facilita a identificação de áreas para redução de custos, alinhando a gestão de recursos com os objetivos de sustentabilidade.

4. **Implementação de Práticas Sustentáveis**
   - Com os insights obtidos, é possível implementar práticas que promovam a sustentabilidade, como a escolha de recursos energeticamente eficientes.

Ao integrar Azure Workbooks em suas práticas de GreenOps, você pode melhorar a sustentabilidade e a eficiência de suas operações de TI.

## Conclusão

Azure Workbooks é uma ferramenta poderosa que pode ser utilizada para apoiar práticas de FinOps, proporcionando uma melhor visibilidade e controle sobre os custos na nuvem. Ao integrar dados de diversas fontes e criar visualizações interativas, as organizações podem otimizar sua utilização de recursos, melhorar o planejamento financeiro e garantir uma operação de nuvem mais eficiente e econômica.`,
    date: "2024-08-04",
    category: "FinOps",
    readTime: "28 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/utilizando-azure-workbooks-para-otimiza%C3%A7%C3%A3o-de-custos-com-finops-f38bdcb4bb77"
  },
  {
    slug: "guia-criacao-vms-azure",
    title: "Guia de Criação de Máquinas Virtuais no Microsoft Azure",
    excerpt: "Este artigo é uma base introdutória essencial para criar máquinas virtuais no Azure, explorando os passos para criar VMs Linux e Windows, incluindo Resource Groups, Virtual Networks e NSGs.",
    content: `## Introdução

Este artigo será uma base introdutória essencial para os próximos conteúdos que virão, onde exploraremos mais a fundo a criação e gerenciamento de máquinas virtuais no Microsoft Azure. Aqui, abordaremos os passos iniciais para criar máquinas virtuais tanto para Linux quanto para Windows, fornecendo um fundamento para as futuras discussões e tutoriais.

Criar máquinas virtuais no Microsoft Azure pode parecer uma tarefa complicada, mas com este guia passo a passo, você verá que é mais simples do que parece. Vamos explorar a criação de máquinas virtuais tanto para Linux quanto para Windows. Vamos começar!

## Passo 1: Criação do Resource Group

Antes de criar qualquer recurso no Azure, precisamos de um Resource Group, que funciona como um contêiner lógico para todos os recursos relacionados. Vamos criar um Resource Group chamado \`rg-example\`.

1. Acesse o portal do Azure.
2. Vá para "Resource Groups" e clique em "Create".
3. Nomeie seu Resource Group como \`rg-example\`.
4. Selecione a região desejada.
5. Clique em "Review + Create" e, em seguida, "Create".

![rg-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example1.png)

## Passo 2: Criação da Virtual Network

A próxima etapa é criar uma Virtual Network (VNet), que permite a comunicação entre recursos do Azure.

1. Vá para "Virtual Networks" e clique em "Create".
2. Nomeie a VNet como \`vnet-example\`.
3. Selecione o Resource Group \`rg-example\`.
4. Configure o endereço IP e as sub-redes conforme necessário.
5. Clique em "Review + Create" e, em seguida, "Create".

![vnet-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example2.png)

## Passo 3: Criação da NSG (Network Security Group)

O Network Security Group (NSG) é responsável por controlar o tráfego de rede para as VMs. Vamos criar um NSG chamado \`nsg-example\`.

1. Vá para "Network Security Groups" e clique em "Create".
2. Nomeie o NSG como \`nsg-example\`.
3. Selecione o Resource Group \`rg-example\`.
4. Clique em "Review + Create" e, em seguida, "Create".

![nsg-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example3.png)

## Passo 4: Anexar o NSG à Subnet

Depois de criar o NSG, precisamos anexá-lo à Subnet \`default\` da nossa VNet \`vnet-example\`.

1. Acesse o NSG \`nsg-example\` e selecione a settings > Subnet.
2. Associate, selecione a subnet \`default\` e salve as alterações.

![nsg-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example19.png)

## Passo 5: Criação da Virtual Machine Linux

Vamos criar a VM com nome vm-example dentro do rg-example com o tipo de segurança: Standard.

![lnx-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example4.png)

1. Vá para "Virtual Machines" e clique em "Create".
2. Selecione o Resource Group \`rg-example\`.
3. Nomeie a VM como \`vm-example\`.
4. Altere o tipo de segurança para Standard.
5. Selecione "Ubuntu Server 20.04 LTS ARM64 Gen2" como a imagem.
6. Selecione "Arm64" como a arquitetura (para maior eficiência energética e de processamento).
7. Configure a VM com o tamanho \`Standard_D2ps_v5\`.
8. Escolha a autenticação por senha e defina uma senha.
9. Certifique-se de que a VM não tenha portas de entrada públicas configuradas.

![lnx-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example5.png)

**Saiba Mais:** [Máquinas Virtuais do Azure com processadores baseados em Arm do Ampere Altra](https://azure.microsoft.com/pt-br/updates/generally-available-new-azure-virtual-machines-with-ampere-altra-armbased-processors/)

10. Na seção "Networking", certifique-se de que a VM esteja na VNet \`vnet-example\` e na Subnet \`default\`.
11. Selecione "Review + Create" e, em seguida, "Create".

![lnx-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example6.png)

Após a criação, precisamos liberar a porta SSH 22 no NSG \`nsg-example\` para acessar a VM.

1. Acesse o NSG \`nsg-example\`.
2. Adicione uma regra de entrada para permitir o tráfego na porta 22.

![nsg-example](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example7.png)

### Conectando-se à VM Linux

Após a VM estar em execução verifique qual IP público foi atribuído à VM , copie o IP público e conecte-se via SSH:

\`\`\`bash
ssh usuario@IPX.XXX.XXX.XX
\`\`\`
No meu caso: 

\`\`\`bash
ssh raafel@172.210.28.194
\`\`\`
![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example8.png)

De preferência, atualize os pacotes do sistema:

\`\`\`bash
sudo apt-get update
sudo apt-get upgrade -y
\`\`\`

## Criação da Virtual Machine Windows 11

Vamos criar uma VM com Windows 11 dentro do nosso \`rg-example\`, com o nome \`vm-example-win\`, tipo de segurança \`Standard\` e imagem \`Windows 11 Pro\`.

1. Vá para "Virtual Machines" e clique em "Create".
2. Selecione o Resource Group \`rg-example\`.
3. Nomeie a VM como \`vm-example-win\`.
4. Altere o tipo de segurança para Standard.
5. Selecione "Windows 11 Pro" como a imagem.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example13.png)

6. Configure a VM com o tamanho \`Standard_B4ms\` para testes mais rápidos.
7. Escolha a autenticação por senha e defina uma senha de sua preferência (não se esqueça de anotar a senha).
8. Certifique-se de que a VM não tenha portas de entrada públicas configuradas. Confirme a licença.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example14.png)

9. Na seção "Networking", certifique-se de que a VM esteja na VNet \`vnet-example\` e na Subnet \`default\`, e que não seja atribuído um NSG à NIC.
10. Selecione "Review + Create" e, em seguida, "Create".

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example15.png)

Após a criação, precisamos liberar a porta RDP no NSG \`nsg-example\` para acessar a VM.

1. Acesse o NSG \`nsg-example\`.
2. Adicione uma regra de entrada para permitir o tráfego na porta RDP.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example16.png)

### Conectando-se à VM Windows

1. No seu computador com Windows, abra o aplicativo "Remote Desktop Connection" (procure por "Remote" no menu Iniciar).

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example22.png)

2. Copie o IP público atribuído à VM \`vm-example-win\`, digite no Remote Desktop Connection, clique no botão conectar, escolha "Use another account", e digite o usuário e senha que foram criados anteriormente. Clique em "OK".

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example17.png)

3. Confirme o certificado de segurança quando solicitado:

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/example/example18.png)

---

## Conclusão

Criar máquinas virtuais no Azure é um processo estruturado que envolve a criação de vários componentes, como Resource Groups, Virtual Networks e Network Security Groups. Seguindo este guia, você pode configurar rapidamente VMs Linux e Windows para atender às suas necessidades. Lembre-se de sempre garantir a segurança das suas VMs e otimizar suas configurações para o melhor desempenho.

A flexibilidade e o poder do Azure permitem que você adapte a infraestrutura de TI às demandas específicas do seu projeto, seja ele para desenvolvimento, teste ou produção. Utilize as práticas recomendadas para maximizar a eficiência e a segurança de suas VMs.

Se tiver dúvidas ou precisar de mais detalhes, não hesite em entrar em contato. Espero que este guia tenha sido útil para você!`,
    date: "2024-07-26",
    category: "Azure",
    readTime: "22 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/guia-de-cria%C3%A7%C3%A3o-de-maquinas-virtuais-no-microsoft-azure-9c2ecf5c205e"
  },
  {
    slug: "antes-cloud-native-fundacao-solida",
    title: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem",
    excerpt: "Entenda os fundamentos necessários antes de adotar arquiteturas Cloud Native e como preparar sua infraestrutura.",
    content: "# Antes do Cloud Native: Construindo uma Fundação Sólida\n\n## Por que Fundações Importam?\n\nMuitas organizações pulam direto para arquiteturas cloud-native sem estabelecer fundações sólidas. Isso pode levar a problemas de escalabilidade, segurança e custos descontrolados.\n\n## Os Pilares Fundamentais\n\n### 1. Governança\nEstabeleça políticas e processos antes de migrar:\n- Estrutura de subscriptions e resource groups\n- Naming conventions\n- Tagging strategy\n- RBAC (Role-Based Access Control)\n\n### 2. Segurança\nImplemente segurança desde o início:\n- Azure Policy para compliance\n- Azure Security Center\n- Network Security Groups\n- Private Endpoints\n- Azure Firewall\n\n### 3. Rede\nProjete uma arquitetura de rede sólida:\n- Hub-spoke topology\n- VNet peering\n- Azure ExpressRoute ou VPN\n- DNS strategy\n\n### 4. Identidade\nUse Azure AD como fundação:\n- Single Sign-On\n- Multi-Factor Authentication\n- Conditional Access\n- Privileged Identity Management\n\n### 5. Monitoramento\nEstabeleça observabilidade desde o dia 1:\n- Azure Monitor\n- Log Analytics\n- Application Insights\n- Alerting strategy\n\n## Preparando para Cloud Native\n\nDepois de estabelecer estas fundações, você estará pronto para:\n- Implementar microserviços\n- Usar containers e Kubernetes\n- Adotar serverless\n- Implementar DevOps\n\n## Landing Zones\n\nUse o conceito de Landing Zones do Azure para:\n- Padronizar deployments\n- Garantir compliance\n- Acelerar time-to-market\n- Reduzir riscos\n\n## Conclusão\n\nInvestir tempo em fundações sólidas economizará meses ou anos de retrabalho futuro. Cloud-native não é apenas sobre tecnologia, é sobre transformação organizacional.",
    date: "2024-07-14",
    category: "Cloud",
    readTime: "14 min",
    mediumUrl: "https://orafaelferreiraa.medium.com/antes-do-cloud-native-construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-impactando-um-futuro-b6cbafef029b"
  },
  {
    slug: "monitoria-observabilidade-cloud",
    title: "Construindo uma Fundação Sólida para a Nuvem: Monitoria e Observabilidade",
    excerpt: "Como implementar monitoria e observabilidade efetivas para garantir performance e confiabilidade em ambientes cloud.",
    content: "# Monitoria e Observabilidade para a Nuvem\n\n## Monitoria vs Observabilidade\n\n### Monitoria\n- Coleta de métricas predefinidas\n- Alertas baseados em thresholds\n- Dashboards de status\n\n### Observabilidade\n- Entendimento profundo do sistema\n- Logs, métricas e traces\n- Capacidade de fazer perguntas não planejadas\n\n## Os Três Pilares\n\n### 1. Logs\nCapture eventos do sistema com informações contextuais detalhadas.\n\n### 2. Métricas\nDados numéricos ao longo do tempo:\n- CPU utilization: 75%\n- Memory usage: 4.2GB\n- Request latency: 150ms\n- Error rate: 0.5%\n\n### 3. Traces\nRastreamento de requisições distribuídas:\n- User Request → API Gateway → Microservice A → Database\n- Identifique gargalos e falhas\n\n## Implementando no Azure\n\n### Azure Monitor\nCentral hub para todos os dados de monitoramento:\n- Coleta automática de métricas\n- Integração com todos os serviços Azure\n- Queries KQL poderosas\n\n### Log Analytics\nWorkspace para análise de logs com queries avançadas.\n\n### Application Insights\nMonitoramento de aplicações:\n- Performance de requests\n- Dependency tracking\n- Exception tracking\n- User analytics\n\n## Melhores Práticas\n\n1. **Structured Logging**: Use JSON para logs\n2. **Correlation IDs**: Trace requisições end-to-end\n3. **Alertas Inteligentes**: Evite alert fatigue\n4. **SLOs e SLIs**: Defina objetivos mensuráveis\n5. **Dashboards Contextuais**: Para diferentes personas\n\n## Ferramentas Complementares\n\n- **Grafana**: Visualizações avançadas\n- **Prometheus**: Métricas de containers\n- **Jaeger**: Distributed tracing\n- **ELK Stack**: Análise de logs\n\n## Cultura de Observabilidade\n\nObservabilidade não é apenas ferramenta, é cultura:\n- Desenvolvedores instrumentam código\n- Ops analisa padrões\n- Negócio entende impacto",
    date: "2024-07-14",
    category: "Observabilidade",
    readTime: "13 min",
    mediumUrl: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-monitoria-e-observabilidade-para-performance-e-2e39c332b35b"
  },
  {
    slug: "fundacao-solida-finops",
    title: "Construindo uma Fundação Sólida para a Nuvem com FinOps",
    excerpt: "Aprenda a maximizar os custos em ambientes cloud utilizando práticas de FinOps e construindo uma fundação sólida.",
    content: "# Construindo uma Fundação Sólida com FinOps\n\n## O que é FinOps?\n\nFinOps (Financial Operations) é uma prática cultural que traz responsabilidade financeira para o modelo de gastos variáveis da nuvem. Permite que organizações maximizem o valor do negócio através da colaboração entre engenharia, finanças e negócios.\n\n## Os Três Princípios do FinOps\n\n### 1. Todos são Responsáveis\n- Engenheiros tomam decisões técnicas com impacto financeiro\n- Finanças fornecem visibilidade e governança\n- Negócios definem prioridades e valor\n\n### 2. Decisões Orientadas por Dados\n- Métricas em tempo real\n- Custo por serviço, feature, cliente\n- Benchmarking e tendências\n\n### 3. Aproveite o Modelo Variável\n- Pague apenas pelo que usar\n- Elasticidade para demanda\n- Otimização contínua\n\n## Fases do FinOps\n\n### Inform (Informar)\nVisibilidade e alocação de custos:\n- Dashboards de custos\n- Showback/Chargeback\n- Forecasting\n\n### Optimize (Otimizar)\nRedução de desperdício:\n- Right-sizing de recursos\n- Reserved Instances\n- Spot Instances\n- Shutdowns automáticos\n\n### Operate (Operar)\nProcessos contínuos:\n- Budget alerts\n- Cost anomaly detection\n- Continuous optimization\n- FinOps culture\n\n## Implementando FinOps no Azure\n\n### Azure Cost Management\n- Análise de custos detalhada\n- Budgets e alertas\n- Recomendações de otimização\n- Cost allocation\n\n### Estratégias de Economia\n\n1. **Reserved Instances**\n   - Economia de até 72%\n   - Para workloads previsíveis\n   - 1 ou 3 anos de compromisso\n\n2. **Spot VMs**\n   - Economia de até 90%\n   - Para workloads tolerantes a interrupções\n   - Batch processing, dev/test\n\n3. **Auto-scaling**\n   - Ajuste automático de capacidade\n   - Pague apenas pela demanda real\n   - VMSS, App Service, AKS\n\n4. **Storage Tiering**\n   - Hot, Cool, Archive\n   - Automatize lifecycle management\n   - Reduza custos de armazenamento\n\n## Métricas Chave (KPIs)\n\n- **Cost per Customer**: Quanto custa cada cliente\n- **Cost per Transaction**: Custo unitário\n- **Cloud Efficiency**: % de recursos utilizados\n- **Waste**: Recursos não utilizados\n\n## Construindo a Cultura\n\n1. **Transparência**: Compartilhe custos com todos\n2. **Accountability**: Times responsáveis por seus gastos\n3. **Collaboration**: Finanças + Engenharia + Negócios\n4. **Continuous Learning**: Sempre aprendendo e otimizando\n\n## Ferramentas e Automação\n\n- **Azure Policy**: Enforce compliance\n- **Azure Advisor**: Recomendações automáticas\n- **Azure Automation**: Shutdowns programados\n- **Workbooks**: Dashboards customizados",
    date: "2024-07-14",
    category: "FinOps",
    readTime: "12 min",
    mediumUrl: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-com-finops-maximizando-os-custos-em-ambientes-cloud-0b47af9ce8a0"
  },
];
