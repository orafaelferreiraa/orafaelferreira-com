import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(__dirname, '../src/data/articles');
const outputSitemap = path.join(__dirname, '../public/sitemap.xml');
const outputMeta = path.join(__dirname, '../public/articles-meta.json');

// Static pages configuration
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/mentoria-cloud-devops', changefreq: 'monthly', priority: 0.9 },
  { url: '/blog', changefreq: 'weekly', priority: 0.9 },
  { url: '/premiacoes', changefreq: 'monthly', priority: 0.7 },
  { url: '/certificacoes', changefreq: 'monthly', priority: 0.7 },
  { url: '/certificados', changefreq: 'monthly', priority: 0.6 },
  { url: '/palestras', changefreq: 'monthly', priority: 0.8 },
  { url: '/experiencias', changefreq: 'monthly', priority: 0.7 },
  { url: '/recomendacoes', changefreq: 'monthly', priority: 0.6 },
];

const baseUrl = 'https://www.orafaelferreira.com';

/**
 * Parse article file and extract metadata
 */
function parseArticleFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract slug
    const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
    const slug = slugMatch ? slugMatch[1] : null;
    
    // Extract title
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : null;
    
    // Extract excerpt
    const excerptMatch = content.match(/excerpt:\s*["']([^"']+)["']/);
    const excerpt = excerptMatch ? excerptMatch[1] : null;
    
    // Extract image
    const imageMatch = content.match(/image:\s*["']([^"']+)["']/);
    const image = imageMatch ? imageMatch[1] : null;
    
    // Extract date from filename or from date field
    const dateFromFilename = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
    let date = null;
    if (dateFromFilename) {
      date = dateFromFilename[1];
    } else {
      const dateMatch = content.match(/date:\s*["']([^"']+)["']/);
      date = dateMatch ? dateMatch[1] : null;
    }
    
    // Extract category
    const categoryMatch = content.match(/category:\s*["']([^"']+)["']/);
    const category = categoryMatch ? categoryMatch[1] : null;
    
    if (!slug) {
      console.warn(`⚠️  No slug found in ${path.basename(filePath)}, skipping`);
      return null;
    }
    
    return {
      slug,
      title: title || 'Untitled',
      excerpt: excerpt || '',
      image: image || null,
      date: date || null,
      category: category || 'Artigos',
      fileName: path.basename(filePath),
    };
  } catch (error) {
    console.error(`❌ Error parsing ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

/**
 * Generate sitemap XML
 */
function generateSitemap(articles) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';
  
  // Add static pages
  xml += '  <!-- Static pages -->\n';
  staticPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    if (page.url === '/') {
      xml += `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${baseUrl}/?lang=pt-BR"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/?lang=en"/>\n`;
    }
    xml += `  </url>\n`;
  });
  
  // Add articles
  xml += '\n  <!-- Articles -->\n';
  articles
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .forEach(article => {
      xml += `  <url><loc>${baseUrl}/artigos/${article.slug}</loc><changefreq>yearly</changefreq><priority>0.8</priority></url>\n`;
    });
  
  xml += '</urlset>';
  
  return xml;
}

/**
 * Generate articles metadata JSON
 */
function generateMetaJson(articles) {
  const meta = {};
  
  articles.forEach(article => {
    meta[article.slug] = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      date: article.date,
      category: article.category,
      url: `${baseUrl}/artigos/${article.slug}`,
    };
  });
  
  return JSON.stringify(meta, null, 2);
}

/**
 * Main function
 */
async function main() {
  console.log('📝 Generating sitemap and articles metadata...\n');
  
  try {
    // Read all article files (recursively across category subfolders)
    const files = fs.readdirSync(articlesDir, { recursive: true })
      .filter(f => f.endsWith('.ts') && !f.endsWith('types.ts') && !f.endsWith('index.ts'))
      .sort();
    
    console.log(`📄 Found ${files.length} article files\n`);
    
    // Parse articles
    const articles = files
      .map(file => parseArticleFile(path.join(articlesDir, file)))
      .filter(article => article !== null);
    
    console.log(`✅ Successfully parsed ${articles.length} articles\n`);
    console.log('Article slugs:');
    articles.forEach(a => console.log(`  - ${a.slug}`));
    console.log();
    
    // Generate sitemap
    const sitemap = generateSitemap(articles);
    fs.writeFileSync(outputSitemap, sitemap, 'utf-8');
    console.log(`✅ Sitemap written to: ${outputSitemap}`);
    
    // Generate meta JSON
    const metaJson = generateMetaJson(articles);
    fs.writeFileSync(outputMeta, metaJson, 'utf-8');
    console.log(`✅ Articles metadata written to: ${outputMeta}`);
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Static pages: ${staticPages.length}`);
    console.log(`  - Article pages: ${articles.length}`);
    console.log(`  - Total URLs: ${staticPages.length + articles.length}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
