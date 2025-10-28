# Lista de Artigos para Migrar

## ✅ Já Migrados (2/11)

1. ✅ **2024-01-15** - `azure-backup-virtual-machines` - "Azure Backup should be enabled for Virtual Machines"
2. ✅ **2025-01-11** - `azure-policy-visao-completa` - "O que é Azure Policy? Uma Visão Completa"

## 📝 Pendentes (9/11)

3. ⏳ **2024-10-29** - `automatizando-infraestrutura-metodologias-ageis`
   - Título: "Automatizando Infraestrutura Moderna com Metodologias Ágeis"
   - Categoria: "Metodologias Ágeis"
   - Read Time: "12 min de leitura"

4. ⏳ **2023-10-27** - `explorando-ia-generativa`
   - Título: "Explorando a Inteligência Artificial Generativa"
   - Categoria: "Inteligência Artificial"
   - Read Time: "7 min"

5. ⏳ **2024-08-22** - `estrategias-modernizacao-6rs`
   - Título: "Estratégias de Modernização de Aplicações: Aplicando os 6Rs com o Cloud Adoption Framework"
   - Categoria: "Cloud Adoption Framework"
   - Read Time: "35 min de leitura"

6. ⏳ **2024-08-04** - `azure-workbooks-finops`
   - Título: "Utilizando Azure Workbooks para Otimização de Custos com FinOps"
   - Categoria: "FinOps"
   - Read Time: "28 min de leitura"

7. ⏳ **2024-07-26** - `guia-criacao-vms-azure`
   - Título: "Guia de Criação de Máquinas Virtuais no Microsoft Azure"
   - Categoria: "Azure"
   - Read Time: "22 min de leitura"

8. ⏳ **2024-07-14** - `antes-cloud-native-fundacao-solida`
   - Título: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem Impactando um Futuro Sustentável"
   - Categoria: "Cloud Adoption Framework"
   - Read Time: "38 min de leitura"

9. ⏳ **2024-07-14** - `monitoria-observabilidade-cloud`
   - Título: "Construindo uma Fundação Sólida para a Nuvem: Monitoria e Observabilidade para Performance e Eficiência em Ambientes Cloud Native"
   - Categoria: "Cloud Adoption Framework"
   - Read Time: "28 min de leitura"

10. ⏳ **2024-07-14** - `fundacao-solida-finops`
    - Título: "Construindo uma Fundação Sólida para a Nuvem com FinOps: Maximizando os Custos em Ambientes Cloud Native"
    - Categoria: "Cloud Adoption Framework"
    - Read Time: "32 min de leitura"

## 📊 Estatísticas

- Total de artigos: 11
- Migrados: 2 (18%)
- Pendentes: 9 (82%)

## 🎯 Ordem de Prioridade Sugerida

1. **Por data mais recente**: Começar de 2024-10-29 e ir retroativo
2. **Por categoria**: Agrupar artigos da mesma categoria juntos
3. **Por tamanho**: Começar pelos menores (menos conteúdo) para ganhar momentum

## 💡 Dicas de Migração

### Formato do Arquivo
Cada arquivo deve seguir este padrão:

```typescript
import { Article } from './types';

export const article: Article = {
  slug: "slug-do-artigo",
  title: "Título Completo do Artigo",
  excerpt: "Resumo curto do artigo...",
  content: `Conteúdo markdown completo aqui...`,
  date: "YYYY-MM-DD",
  category: "Nome da Categoria",
  readTime: "X min de leitura",
  mediumUrl: "https://orafaelferreiraa.medium.com/..."
};
```

### Atenção Especial

- **Markdown**: Preservar toda formatação, imagens, código, etc.
- **Template Strings**: Usar backticks ` para conteúdo multi-linha
- **Escapar**: Se houver backticks no conteúdo, escape com \`
- **Links**: Verificar se todos os links estão corretos

### Workflow Recomendado

1. Abra `articles.ts` e localize o artigo pelo slug
2. Copie todo o objeto do artigo
3. Crie o arquivo com nome `YYYY-MM-DD-slug.ts`
4. Cole o template e preencha com os dados copiados
5. Adicione o import no `index.ts`
6. Adicione a variável no array `allArticles` do `index.ts`
7. Teste que não há erros de compilação
8. Repita para o próximo artigo

### Exemplo de Import no index.ts

```typescript
// No topo do arquivo
import { article as automatizandoInfra } from './2024-10-29-automatizando-infraestrutura-metodologias-ageis';

// No array allArticles
export const allArticles: Article[] = [
  azureBackupVMs,
  azurePolicyVisaoCompleta,
  automatizandoInfra,  // <-- novo
  // ...
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

## ✨ Ao Completar

Quando todos os artigos estiverem migrados:

1. ✅ Verifique que não há erros de TypeScript
2. ✅ Teste a aplicação localmente
3. ✅ Confirme que todos os artigos aparecem no blog
4. ✅ Verifique que os links funcionam
5. ✅ Atualize os componentes para usar a nova estrutura
6. ✅ Remova ou renomeie o `articles.ts` antigo
7. ✅ Commit e deploy!
