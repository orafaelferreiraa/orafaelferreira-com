# Refatoração de Artigos - Guia de Implementação

## 📋 O que foi feito

Foi criada uma nova estrutura para organizar os artigos do blog, onde cada artigo fica em seu próprio arquivo `.ts` com o formato `YYYY-MM-DD-slug.ts`.

## 🗂️ Nova Estrutura

```
src/data/articles/
├── types.ts                                    # Interface Article
├── index.ts                                    # Índice consolidador
├── 2024-01-15-azure-backup-virtual-machines.ts # ✅ Criado
├── 2025-01-11-azure-policy-visao-completa.ts   # ✅ Criado
├── 2024-10-29-automatizando-infraestrutura-metodologias-ageis.ts
├── 2023-10-27-explorando-ia-generativa.ts
├── 2024-08-22-estrategias-modernizacao-6rs.ts
├── 2024-08-04-azure-workbooks-finops.ts
├── 2024-07-26-guia-criacao-vms-azure.ts
├── 2024-07-14-antes-cloud-native-fundacao-solida.ts
├── 2024-07-14-monitoria-observabilidade-cloud.ts
└── 2024-07-14-fundacao-solida-finops.ts
```

## ✅ Já Criados

1. ✅ `types.ts` - Interface do Article
2. ✅ `index.ts` - Índice com helpers (getArticleBySlug, etc.)
3. ✅ `2024-01-15-azure-backup-virtual-machines.ts`
4. ✅ `2025-01-11-azure-policy-visao-completa.ts`

## 📝 Próximos Passos

### Opção 1: Criação Manual (Recomendada para garantir qualidade)

Para cada artigo restante:

1. Crie um novo arquivo em `src/data/articles/` com o nome `YYYY-MM-DD-slug.ts`
2. Copie o template abaixo e preencha com os dados do artigo
3. Copie o conteúdo completo do artigo de `articles.ts`
4. Adicione o import e export no `index.ts`

**Template:**

```typescript
import { Article } from './types';

export const article: Article = {
  slug: "seu-slug-aqui",
  title: "Seu Título Aqui",
  excerpt: "Seu excerpt aqui",
  content: `Seu conteúdo completo aqui`,
  date: "YYYY-MM-DD",
  category: "Sua Categoria",
  readTime: "X min de leitura",
  mediumUrl: "https://..."
};
```

### Opção 2: Script PowerShell (Cria templates vazios)

```powershell
cd src/data
.\create-article-files.ps1
```

Isso criará os arquivos template que você depois precisará preencher manualmente.

## 🔄 Atualizar o index.ts

Depois de criar cada arquivo de artigo, atualize o `index.ts`:

```typescript
// Adicione o import
import { article as nomeVariavel } from './YYYY-MM-DD-slug';

// Adicione na lista do array allArticles
export const allArticles: Article[] = [
  azureBackupVMs,
  azurePolicyVisaoCompleta,
  nomeVariavel,  // <-- Adicione aqui
  // ...
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
```

## 🔌 Atualizar Componentes

Depois que todos os artigos estiverem migrados, atualize os imports nos componentes:

### Antes:
```typescript
import { articles } from '@/data/articles';
```

### Depois:
```typescript
import { articles } from '@/data/articles'; // ou
import { allArticles, getArticleBySlug } from '@/data/articles';
```

Os arquivos que provavelmente precisam ser atualizados:
- `src/components/Blog.tsx`
- `src/pages/ArtigoDetalhes.tsx`
- `src/pages/Blog.tsx`
- Qualquer outro componente que importe de `@/data/articles`

## ✨ Benefícios da Nova Estrutura

- ✅ **Organização**: Um artigo = um arquivo
- ✅ **Git-friendly**: Diffs claros, fácil revisar mudanças
- ✅ **Escalabilidade**: Adicionar novo post = criar novo arquivo
- ✅ **Type-safety**: Mantém tipagem TypeScript em cada módulo
- ✅ **Performance**: Tree-shaking automático

## 🎯 Helpers Disponíveis

O `index.ts` exporta várias funções úteis:

```typescript
// Pegar todos os artigos (ordenados por data)
import { allArticles } from '@/data/articles';

// Pegar artigo por slug
import { getArticleBySlug } from '@/data/articles';
const article = getArticleBySlug('azure-policy-visao-completa');

// Pegar artigos por categoria
import { getArticlesByCategory } from '@/data/articles';
const azureArticles = getArticlesByCategory('Azure Policy');

// Pegar artigos recentes
import { getRecentArticles } from '@/data/articles';
const recent = getRecentArticles(5);

// Pegar todas as categorias únicas
import { getAllCategories } from '@/data/articles';
const categories = getAllCategories();
```

## 🧹 Limpeza Final

Após migrar tudo e testar:

1. Remova ou renomeie `src/data/articles.ts` para `src/data/articles.ts.bak`
2. Verifique se todos os componentes foram atualizados
3. Teste a aplicação completamente
4. Commit das mudanças

## ❓ Precisa de Ajuda?

Se encontrar problemas, verifique:
- Todos os imports estão corretos no `index.ts`
- Todos os arquivos de artigos seguem o padrão de nomenclatura
- A interface `Article` em `types.ts` corresponde aos dados
- Os componentes foram atualizados para o novo caminho de import

## 📊 Progresso

- [x] Estrutura criada
- [x] types.ts criado
- [x] index.ts criado
- [x] 2 artigos migrados (Azure Backup VMs, Azure Policy)
- [ ] 9 artigos restantes
- [ ] Atualizar componentes
- [ ] Remover articles.ts antigo
- [ ] Testes completos
