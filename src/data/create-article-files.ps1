# Script PowerShell para criar os arquivos de artigos restantes
# Execute este script a partir do diretório src/data

$articlesPath = "articles.ts"
$outputDir = "articles"

# Lista de artigos para criar (baseado no articles.ts original)
$articlesToCreate = @(
    @{
        date = "2024-10-29"
        slug = "automatizando-infraestrutura-metodologias-ageis"
    },
    @{
        date = "2023-10-27"
        slug = "explorando-ia-generativa"
    },
    @{
        date = "2024-08-22"
        slug = "estrategias-modernizacao-6rs"
    },
    @{
        date = "2024-08-04"
        slug = "azure-workbooks-finops"
    },
    @{
        date = "2024-07-26"
        slug = "guia-criacao-vms-azure"
    },
    @{
        date = "2024-07-14"
        slug = "antes-cloud-native-fundacao-solida"
    },
    @{
        date = "2024-07-14"
        slug = "monitoria-observabilidade-cloud"
    },
    @{
        date = "2024-07-14"
        slug = "fundacao-solida-finops"
    }
)

Write-Host "📝 Criando arquivos de artigos individuais..." -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  IMPORTANTE: Este script cria apenas os arquivos vazios." -ForegroundColor Yellow
Write-Host "Você precisará copiar o conteúdo de cada artigo manualmente de articles.ts" -ForegroundColor Yellow
Write-Host ""

$templateContent = @"
import { Article } from './types';

export const article: Article = {
  slug: "SLUG_PLACEHOLDER",
  title: "TITLE_PLACEHOLDER",
  excerpt: "EXCERPT_PLACEHOLDER",
  content: \`CONTENT_PLACEHOLDER\`,
  date: "DATE_PLACEHOLDER",
  category: "CATEGORY_PLACEHOLDER",
  readTime: "READTIME_PLACEHOLDER",
  mediumUrl: "MEDIUMURL_PLACEHOLDER"
};
"@

foreach ($art in $articlesToCreate) {
    $fileName = "$($art.date)-$($art.slug).ts"
    $filePath = Join-Path $outputDir $fileName
    
    $content = $templateContent -replace "DATE_PLACEHOLDER", $art.date
    $content = $content -replace "SLUG_PLACEHOLDER", $art.slug
    
    # Cria o arquivo
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "✅ Criado: $fileName" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Arquivos template criados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Copie o conteúdo de cada artigo de articles.ts para o arquivo correspondente"
Write-Host "2. Atualize o index.ts para importar todos os novos artigos"
Write-Host "3. Atualize os componentes que usam articles.ts para usar o novo caminho"
Write-Host ""
Write-Host "💡 Dica: Use busca no editor para localizar cada artigo pelo slug no articles.ts original"
