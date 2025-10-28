import { Article } from './types';

// Import all article files
import { article as azureBackupVMs } from './2024-01-15-azure-backup-virtual-machines';
import { article as azurePolicyVisaoCompleta } from './2025-01-11-azure-policy-visao-completa';
import { article as automatizandoInfraestruturaAgeis } from './2024-10-29-automatizando-infraestrutura-metodologias-ageis';
import { article as explorandoIAGenerativa } from './2023-10-27-explorando-ia-generativa';
import { article as estrategiasModernizacao6Rs } from './2024-08-22-estrategias-modernizacao-6rs';
import { article as azureWorkbooksFinOps } from './2024-08-04-azure-workbooks-finops';
import { article as guiaCriacaoVMsAzure } from './2024-07-26-guia-criacao-vms-azure';
import { article as antesCloudNativeFundacao } from './2024-07-14-antes-cloud-native-fundacao-solida';
import { article as monitoriaObservabilidade } from './2024-07-14-monitoria-observabilidade-cloud';
import { article as fundacaoSolidaFinOps } from './2024-07-14-fundacao-solida-finops';

// Consolidated array of all articles
export const allArticles: Article[] = [
  azureBackupVMs,
  azurePolicyVisaoCompleta,
  automatizandoInfraestruturaAgeis,
  explorandoIAGenerativa,
  estrategiasModernizacao6Rs,
  azureWorkbooksFinOps,
  guiaCriacaoVMsAzure,
  antesCloudNativeFundacao,
  monitoriaObservabilidade,
  fundacaoSolidaFinOps,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Helper function to get article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find(article => article.slug === slug);
}

// Helper function to get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter(article => article.category === category);
}

// Helper function to get articles by tag (if needed in future)
export function getArticlesByTag(tag: string): Article[] {
  // This can be extended when tags are added to Article interface
  return allArticles;
}

// Helper function to get recent articles
export function getRecentArticles(limit: number = 5): Article[] {
  return allArticles.slice(0, limit);
}

// Helper function to get all unique categories
export function getAllCategories(): string[] {
  const categories = allArticles.map(article => article.category);
  return Array.from(new Set(categories)).sort();
}

// Export for backward compatibility
export const articles = allArticles;
