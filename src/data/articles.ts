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
    title: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem Impactando um Futuro Sustentável",
    excerpt: "Descubra como a Green Computing, Cloud Foundation, DevOps, FinOps e Observabilidade não apenas definem o futuro tecnológico, mas impactam diretamente na responsabilidade social e sustentabilidade ambiental.",
    content: `## Introdução
Em um mundo cada vez mais digital, inovações em tecnologias Cloud Native não são apenas uma questão de avanço tecnológico, mas também impactam mudança social e ambiental. Esta jornada começou com a compreensão de como uma Cloud Foundation, DevOps, FinOps, e a Observabilidade não apenas definem o futuro de uma empresa, mas impactam diretamente em uma responsabilidade social e sustentabilidade ambiental.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud01.png)

## O Papel da Computação Verde
A Green Computing vai além da eficiência energética, englobando a escolha de materiais sustentáveis, redução de resíduos eletrônicos e promoção da reciclagem. Em data centers, práticas como uso de energia renovável e otimização de servidores são fundamentais para reduzir o impacto ambiental.

## Impacto Ambiental
A conscientização sobre o impacto ambiental da tecnologia é crucial para promover práticas sustentáveis no setor de TI. Aqui estão alguns dados que destacam a importância da eficiência energética e da gestão ambiental responsável em tecnologias de TI:

1. **Resíduos Eletrônicos Globais**: Em 2019, aproximadamente 54 milhões de toneladas de resíduos eletrônicos foram gerados mundialmente, mas somente 17% receberam reciclagem adequada.

2. **Exportação de Resíduos Eletrônicos dos EUA**: As regulamentações federais norte-americanas atualmente permitem a exportação de lixo eletrônico, o que representa uma ameaça global à saúde humana. Estima-se que entre 5% a 30% dos 40 milhões de computadores usados nos EUA foram exportados para países em desenvolvimento em 2010. Em 2016, a Basel Action Network descobriu que 34% do lixo eletrônico monitorado nos EUA foi enviado para o exterior, quase todo para países em desenvolvimento.

3. **Eficiência Energética em Data Centers**: Em 2014, os data centers dos EUA consumiram 70 bilhões de kWh de eletricidade, As tecnologias e estratégias de design eficientes existentes podem reduzir o uso de energia dos servidores em 25% ou mais, enquanto as melhores práticas de gerenciamento e consolidação de servidores podem diminuir o consumo de energia em até 20%. A eletricidade utilizada por servidores e data centers nos EUA resulta na emissão de 28,4 milhões de toneladas métricas de CO2e anualmente. 

4. **Teletrabalho e Consumo de Energia**: O teletrabalho durante a pandemia de COVID-19 em 2020 levou a uma redução de 13% no consumo de energia relacionado ao trabalho e a uma diminuição de 14% nas emissões de gases de efeito estufa.

5. **Redução de Energia em Equipamentos de Escritório**: Em 2018, computadores e equipamentos de escritório foram responsáveis por 13% do consumo total de eletricidade (227 bilhões de kWh) em edifícios de escritórios. A implementação de modos de baixo consumo de energia em equipamentos de escritório poderia reduzir seu consumo energético em 23%. Se todos os computadores desktop e impressoras fossem desligados à noite, o consumo de energia poderia ser reduzido em mais 9%.

Estas estatísticas destacam a necessidade de práticas sustentáveis no uso e gestão de tecnologias de TI, reforçando a importância de estratégias conscientes em computação verde e sustentabilidade ambiental.

[Fonte: Center for Sustainable Systems](https://css.umich.edu/factsheets/green-it-factsheet)

## Padrões de Software Verde
A Green Software Foundation estabeleceu um banco de dados de padrões de software verde, que são mantidos e revisados por especialistas. Estes padrões são essenciais para garantir que a aplicação diminua emissões de carbono. O catálogo de padrões disponibilizado é amplo e abrange uma variedade de categorias, garantindo que profissionais de software encontrem práticas aplicáveis aos seus respectivos campos, tecnologias ou domínios.

- **Green Software Foundation:** [Informações sobre padrões e práticas sustentáveis](https://greensoftware.foundation/) 

- **Green Software Patterns:** [Documentação sobre padrões de software verde.](https://patterns.greensoftware.foundation/)

## Princípios, Padrões e Práticas
Os princípios de software verde fornecem um conjunto fundamental de competências necessárias para definir, executar e construir software sustentável. Já os padrões oferecem exemplos práticos de como aplicar esses princípios em cenários do mundo real, de forma neutra em relação a fornecedores. As práticas são padrões aplicados a produtos específicos de fornecedores, orientando os profissionais sobre como usar esses produtos de maneira mais sustentável.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud06.png)

## Estratégias de Implementação
Na implementação de infraestruturas Cloud Native bem desenhadas, a adoção de frameworks bem-estruturados, como o Cloud Adoption Framework e o Well-Architected Framework, são essenciais. Esses frameworks auxiliam na criação de sistemas que são eficientes e performáticos, mas também ambientalmente responsáveis.

### Cargas de Trabalho Sustentáveis no Azure
Abordando a sustentabilidade dentro do Azure, existe uma seção do Microsoft Azure Well-Architected Framework destinada a oferecer diretrizes para enfrentar os desafios de criação de ambientes com cargas de trabalho sustentáveis. Essas diretrizes aplicam práticas recomendadas com uma base técnica para construir e operar soluções sustentáveis, atendendo às necessidades comerciais e promovendo práticas ambientalmente responsáveis no Azure.

#### O que é uma carga de trabalho sustentável?
Refere-se a uma coleção de softwares que suportam um objetivo comercial comum, focando no impacto ambiental destas cargas de trabalho. Uma carga de trabalho sustentável descreve como prática de criar soluções que maximizam a utilização, minimizando o desperdício e a pegada ambiental. A eficiência das cargas de trabalho na nuvem combina otimização de custos, redução das emissões de carbono e otimização do consumo de energia.

#### Desafios Comuns na Implementação de Cargas de Trabalho Sustentáveis
Ao implementar cargas de trabalho sustentáveis, especialmente no contexto do Azure, enfrentamos desafios únicos:
- **Alinhamento com Metas de Sustentabilidade:** Avaliar e ajustar cargas de trabalho existentes para garantir que estejam em conformidade com os objetivos ambientais estabelecidos.
- **Design Otimizado para o Meio Ambiente:** Criar cargas de trabalho que sejam eficientes e ecologicamente corretas por natureza, minimizando o impacto ambiental.
- **Medição das Emissões:** Monitorar e acompanhar rigorosamente as emissões de carbono associadas às cargas de trabalho para avaliar o progresso em direção às metas de sustentabilidade.

#### Principais Áreas de Design para Sustentabilidade
Ao considerar a sustentabilidade em cargas de trabalho, focamos nas seguintes áreas principais de design:
1. **Design do Aplicativo:** Incorporar padrões de nuvem sustentáveis para desenvolver cargas de trabalho ecologicamente corretas.
2. **Plataforma de Aplicativos:** Escolher ambientes de hospedagem e dependências que priorizem a eficiência energética e a sustentabilidade.
3. **Testes:** Implementar estratégias de CI/CD e automação para realizar testes de software de forma mais sustentável.
4. **Procedimentos Operacionais:** Estabelecer processos que suportem operações sustentáveis e redução do impacto ambiental.

- **Sustentabilidade Além de Desempenho e Custo**
Além da eficiência de desempenho e otimização de custos, outras áreas como segurança, confiabilidade e excelência operacional são essenciais para criar cargas de trabalho sustentáveis de longo prazo no Azure. 

- **Benefícios do Carbono da Computação em Nuvem:** [Um estudo da Nuvem da Microsoft](https://info.microsoft.com/ww-landing-Carbon-Benefits-of-Cloud-Computing.html?lcid=pt-br) sobre eficiência energética e de carbono do Azure.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud03.png)

#### Azure Carbon Optimization
O Azure Carbon Optimization é uma ferramenta inovadora da Microsoft que capacita organizações a medir e reduzir o impacto de carbono de sua infraestrutura na nuvem. Oferecendo dados detalhados de emissões por recursos, assinaturas e localizações, esta ferramenta integra-se perfeitamente ao portal do Azure, permitindo um acesso simplificado e baseado em permissões RBAC do Azure. Com recomendações práticas para otimização de recursos, o Azure Carbon Optimization não apenas ajuda a alcançar metas de sustentabilidade, mas também promove uma gestão de recursos mais eficiente e econômica. Este serviço destaca o compromisso da Microsoft com a responsabilidade ambiental, fornecendo insights valiosos e ações concretas para reduzir a pegada de carbono na nuvem. Outras ofertas de sustentabilidade da Microsoft [Microsoft Sustainability Manager,](https://learn.microsoft.com/en-us/industry/sustainability/sustainability-manager-overview) [Painel de Impacto de Emissões](https://learn.microsoft.com/en-us/power-bi/connect-data/service-connect-to-emissions-impact-dashboard?toc=%2Findustry%2Fsustainability%2Ftoc.json&bc=%2Findustry%2Fbreadcrumb%2Ftoc.json) e [Os insights de emissões do Microsoft Azure (versão prévia)](https://learn.microsoft.com/en-us/industry/sustainability/sustainability-data-solutions-overview)

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud09.png)


## O que é Green Software?
Podemos dizer que Green Software é uma disciplina emergente que está diretamente envolvida por ciência climática, design de software, mercados de eletricidade, hardware e design de data centers. É focada na criação de software que seja eficiente em termos de carbono, emitindo o mínimo possível de carbono.

## Como Ser um Praticante de Green Software
O que um praticante de Green Software deve conhecer:

- **Eficiência de Carbono:** Emitir a menor quantidade de carbono possível.
- **Eficiência Energética:** Usar a menor quantidade de energia possível.
- **Consciência de Carbono:** Fazer mais quando a eletricidade for mais limpa e menos quando for mais suja.
- **Eficiência de Hardware:** Usar a menor quantidade de carbono incorporado possível.
- **Medição:** O que não pode ser medido, não pode ser melhorado.
- **Compromissos Climáticos:** Entender o mecanismo exato de redução de carbono.

## Iniciativas para um Impacto Ambiental Positivo
Na busca pela sustentabilidade e redução da pegada de carbono, várias estratégias podem ser empregadas, sendo as mais comuns o abatimento, a compensação e a neutralização de carbono. Vamos explorar cada uma delas:

1. **Abatimento:** Esta estratégia foca na redução direta das emissões de gases de efeito estufa. Isso pode ser alcançado através da implementação de tecnologias mais limpas, mudança de comportamentos e práticas operacionais, como a utilização de fontes de energia renováveis e a otimização da eficiência energética em processos e edifícios.

2. **Compensação:** A compensação envolve o investimento em projetos externos que reduzem as emissões de carbono, como projetos de reflorestamento ou de energia renovável. Esses projetos geram créditos de carbono, que podem ser utilizados para "compensar" as emissões que não podem ser eliminadas internamente.

3. **Neutralização:** A neutralização de carbono é o processo de alcançar um equilíbrio líquido zero nas emissões de carbono, combinando abatimento com compensações para neutralizar completamente o impacto de carbono de uma organização ou produto. Isso é frequentemente referido como alcançar "carbono neutro" ou "net zero".

Cada uma dessas estratégias desempenha um papel importante na mitigação das mudanças climáticas e na transição para uma economia de baixo carbono. No contexto de Cloud Native e Green Software, esses compromissos orientam as decisões e práticas, desde o planejamento e design de software até a escolha de fornecedores e tecnologias. 

Explorando novas fronteiras em sustentabilidade, a Microsoft testou um [Datacenter Subaquático](https://news.microsoft.com/pt-br/no-fundo-do-mar-a-microsoft-testa-um-datacenter-rapido-de-implantar-que-pode-fornecer-conectividade-a-internet-por-anos/), visando uma implementação rápida e um menor impacto ambiental. Este projeto demonstra o potencial de soluções inovadoras em data centers para alcançar uma maior sustentabilidade.

Para entender melhor como a eficiência energética é implementada na prática, confira este [Tour virtual em um dos datacenters da Microsoft](https://news.microsoft.com/pt-br/microsoft-revela-tour-virtual-em-um-de-seus-datacenters/#:~:text=A%20Microsoft%20disponibilizou%20hoje%20um,hardware%20e%20software%20que%20mant%C3%AAm), onde são empregadas tecnologias inovadoras para otimizar o uso de energia.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud02.png)

## Importância da Medição e Avaliação

Uma medição das emissões de gases de efeito estufa é ideal para compreender e melhorar o impacto ambiental das organizações. Abaixado dois exemplos de métricas:

- **Protocolo de Gases de Efeito Estufa (GHG Protocol):** Uma ferramenta internacionalmente reconhecida para a contabilização e relatório de emissões de GEE, oferecendo um quadro abrangente para medir emissões diretas e indiretas.
- **Intensidade de Carbono de Software (SCI):** Uma métrica específica para avaliar a quantidade de emissões de GEE por unidade de funcionalidade em aplicações de software, ajudando desenvolvedores e organizações de tecnologia a otimizarem o impacto ambiental de suas soluções.

## Ações para Redução de Carbono
Três ações essenciais para reduzir as emissões de carbono do software:

1. **Utilizar menos recursos físicos:** Reduzindo a necessidade de hardware e energia para sua produção e funcionamento.
2. **Reduzir o consumo de energia:** Otimizando o software para ser mais eficiente em termos de energia.
3. **Uso inteligente de energia:** Preferindo fontes de energia de baixo carbono.

## Cultura DevOps e FinOps
A cultura DevOps, com seu foco em eficiência e automação, está alinhada com os objetivos de sustentabilidade. O FinOps, concentrando-se na otimização de custos e recursos, permitindo criar infraestruturas que maximizam a eficiência e minimizam o desperdício, apoiando a sustentabilidade no longo prazo.

## Observabilidade e Sustentabilidade
A observabilidade detalhada é um componente crítico para a construção de sistemas Cloud Native sustentáveis. Ela envolve a coleta, monitoramento e análise de dados, permitindo uma compreensão profunda do comportamento do sistema e o uso dos recursos. Ao aplicar práticas de observabilidade, as equipes de TI podem identificar e mitigar ineficiências, reduzir o consumo de energia e melhorar a performance, alinhando-se assim aos princípios de sustentabilidade.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud05.png)

## Computação Verde e Cloud Native
A integração da computação verde no Cloud Native reflete uma mudança cultural significativa, onde cada dado processado, leva em conta seu impacto ambiental. Ao implementar padrões de software verde, como os propostos pela Green Software Foundation, estamos garantindo que o caminho para inovações, respeitem o nosso meio ambiente, demonstrando que é possível alcançar excelência tecnológica sem comprometer a saúde do nosso planeta.

## Contribuição para o Ecosistema Open Source
A adoção de práticas sustentáveis oferece uma oportunidade para contribuir de volta ao ecosistema Open Source. Desenvolvendo melhorias e plugins baseados em observações detalhadas e compartilhando conhecimento e melhores práticas, as organizações não apenas se beneficiam, mas também enriquecem o Open Source. Esta colaboração e compartilhamento são fundamentais para fortalecer a comunidade e promover um futuro promissor para tecnologias Cloud Native.

## GreenOps: o futuro já chegou?
Pesquisas da Gartner revelam que as tecnologias voltadas para a sustentabilidade estão entre as três principais tendências para 2024. A projeção é que, até 2027, cerca de 25% da remuneração dos CIOs será determinada pelo impacto de suas iniciativas tecnológicas sustentáveis.

## Conclusão: Um Chamado para a Mudança
Como profissionais de tecnologia, temos a possibilidade de liderar a transformação para práticas sustentáveis. Podemos adotar princípios de sustentabilidade, contribuindo ativamente para um futuro mais verde. Este artigo serve como auxílio para todos os profissionais de TI e todas áreas que tem interesse em integrar a sustentabilidade em suas práticas, promovendo um avanço tecnológico que proteja nosso planeta para as futuras gerações.

Ao adotar práticas sustentáveis e responsáveis, não estamos apenas moldando o futuro da tecnologia, mas também o futuro do nosso planeta e da humanidade. Cada passo em direção à sustentabilidade é um passo em direção a um legado duradouro que beneficiará não apenas a nossa geração, mas muitas que virão.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud04.png)

### Ferramenta de Revisão de Avaliação

Avalie sua aplicação do Microsoft Sustainability Manager em diferentes estágios do processo de implementação, examinando várias categorias para orientar um deployment bem estruturado.

**Em qual fase ou etapa você gostaria de avaliar a implementação da sua solução Microsoft Sustainability Manager?**

Inicie sua avaliação com a [Microsoft Sustainability Manager - Avaliação Bem-Estruturada](https://learn.microsoft.com/pt-br/assessments/333d9326-e34c-40e1-88d9-8342afceec36/).

- **Planejamento:** Avalie a prontidão do planejamento do MVP do seu Sustainability Manager.
- **Design:** Avalie as considerações de design do seu Sustainability Manager.
- **Go-Live:** Avalie a prontidão para implantação e entrada em funcionamento do seu Sustainability Manager.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-24-green-computing-foundation-cloud08.png)

Existem um segunda opção de avaliação. Examine sua carga de trabalho por meio da lente de sustentabilidade.

Inicie sua avaliação com a [Sustentabilidade - Revisão Bem Arquitetada](https://learn.microsoft.com/pt-br/assessments/f236012a-0070-45db-b94c-fe8de0799f38/).

---

[![LFC131: Green Software for Practitioners](https://images.credly.com/images/f28a92f1-2837-4770-add0-70008be15e89/image.png)](https://www.credly.com/badges/11e2e57b-47a9-48ca-af23-41cbb45c01ef/public_url "LFC131: Green Software for Practitioners")`,
    date: "2024-07-14",
    category: "Cloud Adoption Framework",
    readTime: "38 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/antes-do-cloud-native-construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-impactando-um-futuro-b6cbafef029b"
  },
  {
    slug: "monitoria-observabilidade-cloud",
    title: "Construindo uma Fundação Sólida para a Nuvem: Monitoria e Observabilidade para Performance e Eficiência em Ambientes Cloud Native",
    excerpt: "Explorando como monitoria e observabilidade detalhadas fornecem insights valiosos para otimizar o desempenho e a sustentabilidade em ambientes Cloud Native.",
    content: `# Introdução

No contexto atual de tecnologias Cloud Native e microsserviços, exige uma abordagem robusta necessária de monitoria e observabilidade como componentes fundamentais para a garantia de eficiência operacional e performance. Este artigo, explora como a observabilidade detalhada pode fornecer insights valiosos para otimizar o desempenho e a sustentabilidade em ambientes Cloud Native.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud01.png)

## O Papel da Monitoria e Observabilidade

A monitoria e observabilidade são essenciais no ciclo de vida do software, especialmente em ambientes complexos de microsserviços. Elas não apenas facilitam o diagnóstico e a resolução de problemas, mas também ajudam na otimização de recursos e na tomada de decisões baseadas em dados. Veremos como essas práticas se somam e se complementam, proporcionando uma visão mais profunda dos sistemas.

### O Que São e Por Que São Importantes?
- **Monitoria:** Refere-se ao ato de coletar, processamento e exibição de dados quantitativos de sistemas: CPU, memória e tráfego de rede.
- **Observabilidade:** Evolução da monitoria, permite compreender sistemas complexos a partir de dados externos, abrangendo métricas, tracings e logs.

### Diferença entre Monitoria e Observabilidade
- Enquanto a monitoria fornece dados quantitativos, a observabilidade permite compreender a complexidade e os detalhes das informações obtidas, permitindo perguntas detalhadas sobre o comportamento do sistema.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud02.png)

## A Importância da Observabilidade

A observabilidade vai além da simples monitoria de sistemas. Ela envolve uma análise aprofundada e contínua do comportamento e performance de sistemas em nuvem

- **Identificação Proativa de Problemas:** A observabilidade permite diagnósticos rápidos e precisos, reduzindo o tempo de inatividade e melhorando a confiabilidade do sistema.
- **Otimização de Recursos:** Insights detalhados sobre o uso dos recursos ajudam a aprimorar a eficiência e reduzir os custos operacionais.
- **Tomada de Decisão Baseada em Dados:** Decisões estratégicas são embasadas em dados concretos, garantindo a sustentabilidade e eficiência a longo prazo.

## Pilares da Observabilidade

- **Metricas:** Avaliam o desempenho dos sistemas e hosts, fornecendo dados para otimização.
- **Logs:** Revelam padrões ocultos e ajudam na resolução de problemas.
- **Trace:** Rastreiam requisições e transações em microsserviços, identificando gargalos e otimizando a performance.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud03.png)

## Ferramentas em Destaque

- **Prometheus:** Utilizada para coleta e armazenamento de métricas. O Prometheus é uma ferramenta poderosa para o monitoramento de sistemas e serviços, oferecendo uma robusta plataforma para a coleta e análise de dados em tempo real.

- **Elasticsearch, Logstash, e Kibana (ELK Stack):** Amplamente utilizada para o gerenciamento e análise de logs. Esta combinação de ferramentas permite a coleta, enriquecimento, armazenamento e análise visual de logs de diversos sistemas e aplicações.

- **Jaeger:** Uma ferramenta de rastreamento distribuído que ajuda na monitoração e solução de problemas em arquiteturas de microsserviços. O Jaeger coleta, armazena e visualiza rastreamentos de transações, facilitando a identificação e a análise de problemas de desempenho em sistemas complexos.

- **Grafana:** Essencial para visualização de dados e criação de dashboards. Grafana permite transformar dados de várias fontes em representações visuais ricas, facilitando a análise e interpretação de métricas complexas.

- **OpenTelemetry:** Focada na coleta e exportação de dados de telemetria. OpenTelemetry veio para fornece uma padronização de exportar dados para observar métricas, rastreamentos e logs, facilitando a integração e a análise de dados.

- **Kube-Prometheus:** Uma coleção de componentes Open Source para o monitoramento nativo de Kubernetes, incluindo Prometheus, Grafana e Alertmanager, juntamente com as configurações necessárias para sua implementação. Kube-Prometheus facilita o monitoramento abrangente dos clusters Kubernetes, integrando-se de maneira eficiente com o ecossistema do Kubernetes.

Estas ferramentas, conseguem formar um ecossistema completo para a implementação eficaz da observabilidade, desde a coleta de dados até a análise e visualização, facilitando o monitoramento e a tomada de decisão baseada em dados concretos.

## Importância dos SLIs, SLOs e SLAs

Estes indicadores são cruciais para medir e estabelecer metas claras de qualidade, alinhando o desempenho e a disponibilidade do produto com as expectativas dos usuários.

## Implementando SLIs, SLOs e SLAs
- **SLIs (Service Level Indicators):** Métricas quantitativas que medem o desempenho do serviço em relação ao SLO estabelecido.
- **SLOs (Service Level Objectives):** Metas de desempenho específicas que um serviço se compromete a alcançar para atender ao SLA.
- **SLAs (Service Level Agreements):** Acordos formais sobre os níveis de serviço entre provedores e clientes.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud04.png)

## Os Quatro Sinais de Ouro

Com a observabilidade conseguimos manter a saúde e a eficiência dos sistemas. The Four Golden Signals ajudam a entender o comportamento de uma aplicação ou serviço. Vamos detalhar cada um desses sinais:

### Latência
- **Descrição:** Mede o tempo de resposta das requisições e seu impacto na experiência do usuário.
- **Métodos de Medição:**
  - Tempo de respostas das requisições.
  - Separando a latência de requisições bem e malsucedidas.

### Tráfego
- **Descrição:** Refere-se ao volume de demanda do serviço ou aplicação, essencial para entender padrões de uso.
- **Métodos de Medição:**
  - Quantidade de requisições por segundo.
  - Agrupamento de requisições em grupos específicos para análise mais detalhada.

### Erros
- **Descrição:** Tipos de falhas no sistema, fundamentais para a detecção de problemas.
- **Métodos de Medição e Categorização:**
  - Categorização de códigos de status HTTP (404, 500, etc.).
  - Identificação de exceções lançadas pela aplicação.

### Saturação
- **Descrição:** Indica o nível de utilização dos recursos, sinalizando sobrecarga e a necessidade de escalabilidade.
- **Métodos de Medição:**
    - Medição da sobrecarga de recursos (CPU, memória, disco, rede).

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud05.png)

Cada um destes sinais oferece insights valiosos sobre diferentes aspectos do sistema e, quando monitorados juntos, proporcionam uma visão abrangente da saúde e desempenho da aplicação ou serviço.

## Logs São Caros

O gerenciamento de logs é uma parte crítica da observabilidade, mas pode se tornar inviável se não for feito de maneira estratégica. A eficácia e o custo dos logs dependem de como são utilizados e gerenciados dentro de uma organização.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud06.png)

### Caro para Quem Não Sabe o Que Fazer com Eles
- **Definição de Objetivos:** Sem uma compreensão clara do que se pretende alcançar com os logs, eles podem se tornar apenas um amontoado de dados sem valor agregado.
- **Coleta Seletiva:** É essencial definir o que é importante coletar. A coleta indiscriminada de logs pode levar a custos desnecessários e a um excesso de informações.

### Logs Sem Análise: Dinheiro Gasto à Toa
- **Análise de Logs:** Logs que não são regularmente revistos ou analisados podem representar um gasto inútil. É crucial ter alguém que monitore e analise os logs para extrair insights valiosos.
- **Ação Baseada em Logs:** A verdadeira utilidade dos logs vem da ação tomada com base nas informações coletadas. Sem ação, os logs não passam de dados sem uso.

### Estratégias para Gerenciamento de Custos de Logs
- **Ferramentas Eficientes:** O uso de ferramentas apropriadas para o gerenciamento de logs pode ajudar a reduzir custos, fornecendo análise e armazenamento eficientes.
- **Políticas de Retenção:** Definir políticas de retenção adequadas ajuda a manter apenas os logs necessários, reduzindo o armazenamento e os custos associados.

Ao abordar os logs com uma estratégia clara, focada na coleta seletiva e na análise eficaz, as organizações podem transformar o que seria um custo em um investimento valioso que apoia a tomada de decisão baseada em dados e melhora contínua dos sistemas.

## Observabilidade: Um Ciclo Infinito de Melhoria
- **Fundamental para o Negócio:** A ausência de observabilidade em uma aplicação sugere que ela pode não ser considerada vital para o negócio. A observabilidade contínua garante que os sistemas sejam confiáveis e performáticos.
- **Equipe Dedicada:** Idealmente, cada aplicação deve ter uma equipe dedicada focada em sua observabilidade, garantindo atenção contínua e melhorias constantes.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud07.png)

### Quem Não Mede, Não Gerencia
- **Maturidade Organizacional:** Implementar a observabilidade exige maturidade organizacional. É um processo complexo que necessita de uma abordagem detalhada e dedicada.
- **Desafios da Implementação:** A implantação de sistemas de observabilidade não é trivial. Exige um entendimento profundo dos sistemas e uma integração efetiva com as práticas de DevOps.

## Cultura de Observabilidade

A criação de uma cultura que valoriza a observabilidade é crucial para o sucesso em ambientes dinâmicos e competitivos.

### Incentivando a Colaboração
- **Colaboração Interfuncional:** Desenvolvedores, operações e equipes de QA devem trabalhar juntos para identificar e resolver problemas de forma rápida e eficaz.
- **Resolução Rápida de Problemas:** Uma cultura focada na observabilidade permite que problemas sejam identificados e resolvidos rapidamente, minimizando o impacto negativo no desempenho e na experiência do usuário.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-17-observabilidade-foundation-cloud08.png)

Uma cultura de observabilidade robusta não só melhora a confiabilidade e a performance dos sistemas,

## "O Lento é o Novo Parado"

No mundo dinâmico da tecnologia atual, onde a eficiência e a rapidez são cruciais, "o lento é o novo parado". A observabilidade permite identificar rapidamente áreas onde o sistema está operando de forma mais lenta do que o ideal, possibilitando correções antes que se tornem problemas maiores.

### Implicações para o Desempenho do Sistema
- **Expectativas de Desempenho:** Em uma era onde tudo é instantâneo, um sistema lento pode ser tão prejudicial quanto um sistema inoperante. Usuários e clientes esperam respostas rápidas e eficientes.
- **Percepção do Usuário:** Atrasos, mesmo que breves, podem afetar negativamente a percepção do usuário sobre a aplicação, levando à insatisfação e possível perda de clientes.

## Computação Verde e Observabilidade

- A relação entre práticas de observabilidade e computação verde, destaca-sem práticas de monitoramento que contribuem para a redução de poder de processamento sem utilização, gerando uma redução no impacto ambiental. 
- Implementação de soluções de monitoramento avançado para uma análise contínua e detalhada dos sistemas.
- Utilização de observabilidade alinhada com as operações de TI junto com os princípios de sustentabilidade, reduzindo a pegada de carbono.

## Conclusão e Chamado à Ação

Destaco a importância de adotar práticas de monitoria e observabilidade desde o início do desenvolvimento do projeto. Encorajo os iniciantes não apenas aprendam, mas também contribuam ativamente com a comunidade, compartilhando suas descobertas e melhores práticas.

Este artigo destina-se a servir como uma referência abrangente e ponto de partida para aqueles que estão começando sua jornada em ambientes Cloud Native, focando na importância crítica da monitoria e observabilidade para garantir sistemas eficientes, confiáveis e sustentáveis.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png)`,
    date: "2024-07-14",
    category: "Cloud Adoption Framework",
    readTime: "28 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-monitoria-e-observabilidade-para-performance-e-2e39c332b35b"
  },
  {
    slug: "fundacao-solida-finops",
    title: "Construindo uma Fundação Sólida para a Nuvem com FinOps: Maximizando os Custos em Ambientes Cloud Native",
    excerpt: "Uma estrutura operacional e prática cultural que maximiza o valor comercial da nuvem através da colaboração entre equipes de engenharia, finanças e negócios, criando responsabilidade financeira compartilhada.",
    content: `## O que é FinOps?

FinOps é uma estrutura operacional e prática cultural que maximiza o valor comercial da nuvem. Ela envolve a colaboração entre equipes de engenharia, finanças e negócios permitindo a tomada de decisões baseadas em dados afim de criar responsabilidade financeira. FinOps é a união de "Finanças" e "DevOps", enfatizando a comunicação e colaboração entre as equipes.

Conselho Consultivo Técnico da Fundação FinOps define FinOps como uma mudança cultural, onde a responsabilidade pelo uso da nuvem é compartilhada por todos, apoiada por um grupo central de práticas recomendadas. Essa abordagem multifuncional permite uma entrega mais rápida de produtos com maior controle financeiro e previsibilidade.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud05.png)

### Estrutura FinOps

A estrutura FinOps é sobre trazer responsabilidade para gastos na nuvem. Independentemente de ser chamada de "Gestão Financeira em Nuvem", "Engenharia Financeira em Nuvem", ou outros nomes, a essência do FinOps é a responsabilidade financeira no modelo de gastos variáveis da nuvem. Isso envolve equipes distribuídas de engenharia e negócios trazendo compromissos e equilibrando entre velocidade, custo e qualidade nas decisões de arquitetura de nuvem e investimento.

Não trata-se apenas sobre economizar dinheiro, mas sobre como obter o máximo de valor da nuvem para impulsionar um crescimento de forma eficiente. Isso inclui a capacitação de equipes de engenharia para fornecer melhores recursos e aplicações mais rapidamente, e facilita uma conversa multifuncional sobre onde e quando investir.

### Modelo de Maturidade FinOps

FinOps é uma prática iterativa, com a maturidade melhorando com a repetição. Uma organização no estágio inicial ("Crawl") é mais reativa, enquanto no estágio "Run", considera proativamente os custos nas escolhas de design de arquitetura e processos de engenharia.

### Principais Partes Interessadas do Gerenciamento Financeiro em Nuvem

FinOps envolve várias partes interessadas, incluindo Executivos, Engenheiros, Praticantes de FinOps, Operações, Finanças e Aquisições, cada um desempenhando um papel diferente na prática de FinOps.

## Princípios do FinOps

Os Princípios do FinOps atuam como uma bússola orientadora para as atividades da prática de FinOps. Desenvolvidos pelos membros da FinOps Foundation e aprimorados através da experiência, esses princípios cobrem múltiplas nuvens e podem evoluir ao longo do tempo com a aquisição de novas experiências.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud06.png)

Existem seis princípios norteadores na prática de FinOps, que guiam as atividades e decisões dentro dessa abordagem. Esses princípios devem ser considerados como um todo e praticados integralmente:

### 1. 🤝 Colaboração entre Equipes

- Equipes de finanças, tecnologia, produto e negócios trabalham juntas em tempo quase real.
- Colaboração contínua para eficiência e inovação.

### 2. 📊 Decisões Baseadas no Valor do Negócio

- Métricas baseadas em valor econômico unitário e valor demonstram melhor o impacto nos negócios do que o gasto agregado.
- Decisões conscientes entre custo, qualidade e velocidade.
- Visão da nuvem como um motor de inovação.

### 3. 🔗 Responsabilidade Compartilhada pelo uso da Nuvem

- Responsabilidade pelo uso e custo é descentralizada, com os engenheiros assumindo a propriedade dos custos desde o design da arquitetura até as operações contínuas.
- Equipes de produto e funcionalidades gerenciam seu próprio uso da nuvem em relação ao seu orçamento.
- Decisões descentralizadas sobre arquitetura econômica, uso de recursos e otimização.

### 4. 📈 Relatórios Acessíveis e Oportunos

- Dados de FinOps devem ser processados e compartilhados assim que disponíveis.
- Visibilidade em tempo real promove melhor utilização da nuvem.
- Ciclos rápidos de feedback resultam em comportamento mais eficiente.

### 5. 🌐 Equipe Centralizada no FinOps

- A equipe central incentiva, evangeliza e possibilita melhores práticas em um modelo de responsabilidade compartilhada.
- Compra executiva do FinOps e suas práticas e processos é necessária.
- Otimização de taxas, compromissos e descontos é centralizada para aproveitar as economias de escala.

### 6.💡Aproveitamento do Modelo de Custo Variável

- O modelo de custo variável da nuvem deve ser visto como uma oportunidade para entregar mais valor, não como um risco.
- Preferência por planejamento iterativo ágil em vez de planos estáticos de longo prazo.
- Design de sistema proativo com ajustes contínuos em otimização da nuvem.

## Adotando FinOps – Começando

A adoção do FinOps em uma organização começa com a construção de uma apresentação informativa para outras equipes, colegas de trabalho e partes interessadas sobre os benefícios de construir uma prática de FinOps. É essencial obter suporte executivo amplo e compromisso para dedicar tempo e recursos necessários para a mudança cultural.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud01.png)

### Os Direcionadores do FinOps: Os Primeiros Passos

Um papel chave para a adoção do FinOps é o "Direcionador". Abaixo estão algumas etapas e marcos importantes:

#### Etapa 1 – Planejando FinOps em uma Organização

1. **Faça sua pesquisa:** Identifique as partes interessadas chaves dentro da organização. Isso inclui procurar um Patrocinador Executivo e apoiadores para construir a iniciativa.
   
2. **Crie um plano:** Desenvolva um plano de futuro estado e identifique requisitos de ferramentas e um "lar" organizacional para a função FinOps.

3. **Apresente o roteiro:** Obtenha feedback do patrocinador executivo e ajuste conforme necessário, incluindo tamanho inicial da equipe, orçamento e cronograma.

4. **Efetuar a mobilização inicial de recursos:** Recrute outros líderes executivos como patrocinadores e obtenha aprovação de orçamento e contratação.

#### Etapa 2 – Socializando FinOps para Adoção na Organização

- **Promova os valores centrais da mudança.**
- **Crie conversas sobre FinOps com equipes impactadas.**
- **Defina um modelo inicial de FinOps.**

#### Etapa 3 – Preparando a Organização para FinOps

- **Avalie a prontidão para o FinOps.**
- **Envolver as partes interessadas.**

### Personas

Ao propor a adoção de uma função FinOps dentro de uma organização, é necessário informar uma variedade de personas entre a equipe executiva.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud02.png)

### Responsabilidade e Expectativas por Equipe (Modelagem RACI / DACI)

Definir expectativas e gerenciar a responsabilidade entre várias equipes e funções é fundamental para construir uma prática e cultura FinOps duradouras. Usando uma combinação de modelos RACI e DACI, podemos começar a mapear os princípios centrais do FinOps para as equipes e indicar melhor seu nível de envolvimento.

### Apresentação Adotando FinOps na sua organização

Para ajudar a colocar todos os pontos apresentados foi criado uma [Apresentação](https://docs.google.com/presentation/d/17shQqIbmXMbjhAW26nD7qJeM9kqsbaDkTS9WzMk1okg/edit#slide=id.ged5e228ee8_0_0) aberto que qualquer praticante de FinOps pode usar como ponto de partida.

## The Azure FinOps Guide

Este guia centraliza informações e ferramentas de FinOps no Azure, permitindo uma melhor compreensão e otimização dos custos na nuvem. Os principais objetivos deste guia são:

1. **Identificar oportunidades de economia de custos:** Fornecendo insights detalhados sobre como os recursos podem ser otimizados para reduzir despesas desnecessárias.
2. **Otimizar a eficiência da nuvem:** Melhorando a utilização de recursos para maximizar o retorno sobre o investimento (ROI) em infraestrutura de nuvem.
3. **Ganhar uma melhor compreensão e controle dos custos na nuvem:** Ajudando as equipes a monitorar, relatar e controlar os gastos de forma eficaz, alinhando as decisões financeiras com os objetivos de negócios.

O guia é especialmente útil para organizações que utilizam serviços de nuvem do Azure e buscam otimizar seus custos, incluindo tomadores de decisão financeira, engenheiros de nuvem, profissionais de TI e fornecedores independentes de software (ISVs). Ele também incentiva a colaboração entre equipes de engenharia, finanças e negócios, promovendo uma prática cultural onde todos assumem responsabilidade pelo uso e custo da nuvem.

Para mais detalhes e acesso ao conteúdo completo, você pode visitar o [The Azure FinOps Guide](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/the-azure-finops-guide/ba-p/3704132).

![https://techcommunity.microsoft.com/t5/fasttrack-for-azure/the-azure-finops-guide/ba-p/3704132](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/azure-finops-guide.png)

## Visão Geral

A adoção de tecnologias Cloud Native está se tornando cada vez mais essencial para as empresas que buscam inovação e agilidade. No entanto, para garantir uma transição bem-sucedida, é crucial estabelecer uma base sólida que não apenas suporte a eficiência técnica, mas que também promova a sustentabilidade. Vamos explorar o papel vital da FinOps e práticas sustentáveis na construção de uma infraestrutura robusta e responsável em ambientes Cloud Native.

## A Importância da Cultura Organizacional e Técnica

A transformação digital transcende a mera adoção de novas tecnologias; ela exige uma mudança substancial na cultura organizacional. A forma como uma empresa abraça a cultura Cloud Native tem um impacto profundo na eficiência operacional e na sustentabilidade. Uma cultura organizacional bem desenvolvida é a base para uma adoção bem-sucedida e sustentável das tecnologias Cloud Native.

## A Revolução do DevOps e a Eficiência do FinOps

A integração de DevOps com FinOps abre um novo horizonte para as empresas, combinando eficiência técnica com sustentabilidade financeira. Esta sinergia permite que as organizações otimizem seus recursos, reduzam custos e, ao mesmo tempo, mantenham um alto padrão de inovação e eficiência operacional.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud04.png)

## Governança de Custo com [Kubecost](https://www.kubecost.com/)

A governança de custos é crucial para gerenciar as finanças em ambientes de Kubernetes, como o Azure Kubernetes Service (AKS). O Kubecost é uma ferramenta poderosa que ajuda as organizações a entender, gerenciar e otimizar os custos de seus clusters Kubernetes. Suas principais funcionalidades incluem:

- **Alocação de Custos Detalhada:** Permite atribuir custos a níveis como implantação, serviço, rótulo, pod ou namespace, facilitando uma visão precisa e detalhada das despesas.
- **Monitoramento e Otimização:** Fornece ferramentas para monitorar o uso de recursos e sugerir melhorias na infraestrutura para reduzir custos e aumentar a eficiência.
- **Controle Proativo de Custos:** Implementa políticas para garantir que o uso de recursos esteja alinhado com os objetivos financeiros da organização, prevenindo desperdícios e otimizando o orçamento.

Para saber mais:

- [Kubecost no Microsoft Learn](https://learn.microsoft.com/pt-br/azure/cloud-adoption-framework/scenarios/app-platform/aks/cost-governance-with-kubecost)
- [Kubecost na FinOps Foundation](https://www.finops.org/members/kubecost/)

![https://www.kubecost.com/](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/Kubecost.png)

## Maximizando a Transparência com Observabilidade

A observabilidade desempenha um papel crucial na maximização da eficiência operacional. Ao fornecer insights detalhados sobre o desempenho e as necessidades de um ambiente Cloud Native, as organizações podem identificar áreas para melhoria, otimizando tanto o desempenho quanto a sustentabilidade.

## Benefícios para o Ecosistema Open Source

A adoção de práticas robustas em Cloud Native beneficia imensamente a comunidade Open Source. Uma base sólida facilita a implementação de soluções Open Source de maneira eficiente e segura, enriquecendo o ecossistema com contribuições valiosas e promovendo uma cultura de inovação aberta e colaborativa.

### E falando de Open Source, temos o OpenCost

E se você preferir uma ferramenta open source? O OpenCost é uma solução de código aberto para monitoramento e alocação de custos em tempo real em ambientes Kubernetes. Desenvolvido e suportado por uma comunidade de especialistas em Kubernetes, incluindo grandes players como AWS, Google Cloud, e Microsoft, o OpenCost oferece uma visão transparente dos gastos em Kubernetes.

Principais funcionalidades do OpenCost incluem:

- **Alocação de Custos em Tempo Real:** Detalhamento de custos até o nível de contêiner, baseado em conceitos do Kubernetes.
- **Precificação Dinâmica de Ativos:** Integrações com APIs de faturamento de AWS, Azure, GCP, e suporte para clusters on-premises com preços personalizados.
- **Monitoramento de Recursos em Cluster:** Inclui CPU, GPU, memória, balanceadores de carga e volumes persistentes.
- **Monitoramento de Custos Fora do Cluster:** Rastreia custos de serviços gerenciados como armazenamento e bancos de dados.
- **Integração com Ferramentas de Código Aberto:** Exportação de dados para Prometheus e outras ferramentas open source.

Para mais informações, acesse [OpenCost](https://www.opencost.io/).

![https://www.opencost.io/](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/open-cost.png)

## Conclusão e Chamado à Ação

Ao adotar tecnologias Cloud Native, práticas de FinOps e estratégias sustentáveis, as empresas se tornam líderes na promoção de um futuro Cloud Native sustentável. É um chamado à ação para todos os profissionais e líderes de TI: engajem-se, inovem e liderem o caminho para um futuro mais sustentável e eficiente.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud07.png)

### Ferramenta de revisão de avaliação

Use as diretrizes de FinOps para avaliar as lacunas de recursos da sua organização. Obtenha recomendações para maximizar o valor dos negócios na nuvem usando boas práticas de FinOps.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2024-01-15-finops-foundation-cloud03.png)

Inicie sua avaliação com a [Revisão do FinOps](https://learn.microsoft.com/pt-br/assessments/ad1c0f6b-396b-44a4-924b-7a4c778a13d3/).

Para mais informações sobre [O que é FinOps?](https://www.finops.org/) segue documentação que foi base desse artigo.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png)`,
    date: "2024-07-14",
    category: "Cloud Adoption Framework",
    readTime: "32 min de leitura",
    mediumUrl: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-com-finops-maximizando-os-custos-em-ambientes-cloud-0b47af9ce8a0"
  },
];
