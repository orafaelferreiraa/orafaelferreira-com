# 🔧 Problemas de Formatação Markdown e Plano de Correção

**Data:** 28 de Outubro de 2025  
**Status:** ANÁLISE COMPLETA - AGUARDANDO IMPLEMENTAÇÃO

---

## 📊 Resumo Executivo

Durante a análise dos artigos migrados de `.md` para `.ts`, foram identificados **problemas críticos** na renderização de markdown. O parser manual implementado em `ArtigoDetalhes.tsx` (linhas 96-165) é muito básico e **não suporta**:

- ✅ Blocos de código multilinhas com syntax highlighting
- ✅ Tabelas markdown (formato `| col1 | col2 |`)
- ✅ Links dentro de formatação (negrito/itálico)
- ✅ Código inline com backticks
- ✅ Listas aninhadas
- ✅ HTML inline
- ✅ Blockquotes

---

## 🔴 Problemas Identificados por Artigo

### 1. **2025-01-11-azure-policy-visao-completa.ts**

**Linha 60 - Bloco de código JSON:**
```typescript
Exemplo de definição de política em JSON:

\`\`\`json  // ❌ ERRO: Escape incorreto
{
  "mode": "All",
  "policyRule": { ... }
}
\`\`\`
```

**Problema:** O escape `\`\`\`` não é processado pelo parser manual.  
**Solução:** Remover escapes e usar ReactMarkdown com `react-syntax-highlighter`.

---

**Linhas 109-113 - Tabela markdown:**
```markdown
| Aspecto                     | Azure Policy                        | Azure RBAC                      |
|-----------------------------|-------------------------------------|---------------------------------|
| **Objetivo Principal**      | Garantir conformidade de recursos  | Controlar permissões de acesso  |
```

**Problema:** Parser manual não renderiza tabelas.  
**Renderização Atual:** Texto bruto sem formatação.  
**Solução:** Usar `remark-gfm` plugin para suporte a GitHub Flavored Markdown.

---

**Linha 141 - Código inline:**
```markdown
Antes de bloquear recursos, use `Audit` para monitorar o impacto das políticas.
```

**Problema:** Backticks inline não são renderizados como código.  
**Solução:** ReactMarkdown processa automaticamente.

---

### 2. **2024-08-04-azure-workbooks-finops.ts**

**Linha 9 - Link dentro de texto:**
```markdown
([Caso queira saber mais sobre FinOps, visite o meu artigo anterior](https://orafaelferreira.com/posts/finops-foundation-cloud/))
```

**Problema:** Links entre parênteses não são processados corretamente.

---

**Linha 129 - Código inline com backticks duplos:**
```markdown
Substitua o código JSON pelo código fornecido para \`'Azure Orphaned Resources v2.0'\`
```

**Problema:** Escape de backticks incorreto.

---

**Linhas 46-52 - Lista numerada:**
```markdown
1. **Monitoramento de Custos em Tempo Real**
   - Utilize Azure Workbooks para criar dashboards que monitoram os custos em tempo real.

2. **Análise de Tendências de Consumo**
   - Análises históricas de consumo...
```

**Problema:** Listas com sub-itens não são aninhadas corretamente.

---

### 3. **2024-07-14-monitoria-observabilidade-cloud.ts**

**Linha 5 - Título H1:**
```markdown
# Introdução
```

**Problema:** Parser manual converte para `<h1>` mas deveria ser `<h2>` dentro do contexto do artigo.

---

**Linhas 28-29 - Listas aninhadas:**
```markdown
- **Monitoria:** Refere-se ao ato de coletar...
  - CPU, memória e tráfego de rede.
```

**Problema:** Sub-itens não são renderizados com indentação correta.

---

## 🛠️ Solução Técnica Proposta

### **Passo 1: Instalar Dependências**

Execute no terminal:
```bash
npm install react-markdown remark-gfm rehype-raw rehype-sanitize react-syntax-highlighter @types/react-syntax-highlighter
```

**Ou com bun:**
```bash
bun add react-markdown remark-gfm rehype-raw rehype-sanitize react-syntax-highlighter
```

---

### **Passo 2: Atualizar ArtigoDetalhes.tsx**

**Importações necessárias:**
```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
```

**Substituir o parser manual (linhas 96-165) por:**
```typescript
<div className="prose prose-lg dark:prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw, rehypeSanitize]}
    components={{
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      img({ src, alt }: any) {
        return (
          <img
            src={src}
            alt={alt || ''}
            className="w-full rounded-lg my-6 shadow-md"
            loading="lazy"
          />
        );
      },
    }}
  >
    {article.content}
  </ReactMarkdown>
</div>
```

---

### **Passo 3: Corrigir Escapes nos Artigos**

Arquivos que precisam de correção:

#### **2025-01-11-azure-policy-visao-completa.ts**
- **Linha 60:** Remover escapes `\`\`\`` → ` ```json`
- **Linha 68:** Remover escapes `\`\`\`` → ` ``` `

#### **2024-08-04-azure-workbooks-finops.ts**
- **Linha 129:** Corrigir `` \`'Azure Orphaned Resources v2.0'\` `` → `` `'Azure Orphaned Resources v2.0'` ``

#### **2024-07-26-guia-criacao-vms-azure.ts** (se houver problemas similares)
- Verificar blocos de código PowerShell e JSON

---

## 📦 Plugins React-Markdown Explicados

| Plugin | Função | Por que usar? |
|--------|--------|---------------|
| **react-markdown** | Parser principal de markdown para React | Renderização profissional e mantida |
| **remark-gfm** | GitHub Flavored Markdown | Suporte a tabelas, task lists, strikethrough |
| **rehype-raw** | Processa HTML dentro do markdown | Permite `<img>`, `<br>`, etc. |
| **rehype-sanitize** | Sanitiza HTML perigoso | Previne XSS attacks |
| **react-syntax-highlighter** | Syntax highlighting para código | Colorização de código como no VS Code |

---

## 🗑️ Arquivos Desnecessários para Remover

Após migração completa, estes arquivos são **redundantes**:

### **1. `src/data/generate-articles.js`**
**Função:** Script Node.js para converter `articles.ts` em arquivos individuais.  
**Status:** ❌ Não mais necessário (migração já concluída).  
**Ação:** DELETAR

### **2. `src/data/create-article-files.ps1`**
**Função:** Script PowerShell para criar templates de artigos.  
**Status:** ❌ Não mais necessário (todos os artigos já criados).  
**Ação:** DELETAR

### **3. `src/data/articles/MIGRATION_CHECKLIST.md`** (opcional)
**Função:** Checklist de progresso da migração.  
**Status:** ✅ Migração completa, pode ser arquivado.  
**Ação:** MOVER para pasta `docs/` ou DELETAR

### **4. `src/data/articles.ts.bak`**
**Função:** Backup do arquivo original.  
**Status:** ⚠️ Manter por enquanto como backup de segurança.  
**Ação:** DELETAR após confirmar que tudo funciona 100%

---

## ✅ Checklist de Implementação

```
[ ] 1. Instalar dependências: react-markdown, remark-gfm, rehype-raw, rehype-sanitize, react-syntax-highlighter
[ ] 2. Atualizar ArtigoDetalhes.tsx com ReactMarkdown
[ ] 3. Corrigir escapes em 2025-01-11-azure-policy-visao-completa.ts
[ ] 4. Corrigir escapes em 2024-08-04-azure-workbooks-finops.ts
[ ] 5. Testar renderização de todos os 11 artigos no browser
[ ] 6. Verificar tabelas renderizando corretamente
[ ] 7. Verificar blocos de código com syntax highlighting
[ ] 8. Verificar links funcionando
[ ] 9. Deletar generate-articles.js
[ ] 10. Deletar create-article-files.ps1
[ ] 11. Deletar articles.ts.bak (após confirmação)
[ ] 12. Build final: npm run build
[ ] 13. Deploy para produção
```

---

## 🎯 Resultado Esperado

Após implementação:

✅ **Tabelas renderizadas** com bordas e formatação correta  
✅ **Código com syntax highlighting** (JSON, TypeScript, PowerShell, etc.)  
✅ **Links funcionando** dentro de qualquer formatação  
✅ **Listas aninhadas** com indentação correta  
✅ **Imagens responsivas** com lazy loading  
✅ **Performance otimizada** com plugins modernos  
✅ **Código limpo** sem parser manual de 165 linhas  

---

## 📸 Comparação Visual (Antes vs Depois)

### **ANTES (Parser Manual):**
```
| Aspecto | Azure Policy | Azure RBAC |
|---------|--------------|------------|
| **Objetivo** | Conformidade | Permissões |
```
Renderizado como: texto bruto sem formatação

### **DEPOIS (ReactMarkdown):**
| Aspecto | Azure Policy | Azure RBAC |
|---------|--------------|------------|
| **Objetivo** | Conformidade | Permissões |

Renderizado como: tabela HTML estilizada com bordas

---

## 🚀 Próximos Passos

1. **Instalar dependências** (você precisa ter npm/bun no PATH)
2. **Atualizar ArtigoDetalhes.tsx** (eu posso fazer isso)
3. **Corrigir escapes nos artigos** (eu posso fazer isso)
4. **Testar no browser** (você testa após as mudanças)
5. **Deletar arquivos desnecessários** (eu posso fazer isso)

---

**Pronto para começar a implementação?** 🎯
