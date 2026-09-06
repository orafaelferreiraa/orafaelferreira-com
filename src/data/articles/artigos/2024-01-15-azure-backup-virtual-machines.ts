import type { Article } from '../types';

export const article: Article = {
  slug: "azure-backup-virtual-machines",
  title: "Azure Backup should be enabled for Virtual Machines",
  excerpt: "Por que a policy Azure Backup should be enabled for Virtual Machines é essencial em ambientes corporativos e os riscos de não ter backup automático em VMs.",
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
  category: "Artigos",
  readTime: "25 min de leitura",
  tags: ["Terraform"],
  excludeTags: ["IA"]
};
