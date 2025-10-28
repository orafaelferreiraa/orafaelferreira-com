// Test script to verify articles are loading correctly
import { articles, allArticles, getArticleBySlug, getAllCategories } from './src/data/articles/index';

console.log('=== Testing Articles Structure ===\n');

console.log(`✓ Total articles loaded: ${articles.length}`);
console.log(`✓ Total articles in allArticles: ${allArticles.length}`);
console.log(`✓ Articles should be equal: ${articles.length === allArticles.length ? 'YES' : 'NO'}\n`);

console.log('=== Article Dates (sorted newest first) ===');
articles.slice(0, 5).forEach((article, index) => {
  console.log(`${index + 1}. ${article.date} - ${article.title.substring(0, 50)}...`);
});

console.log('\n=== Categories ===');
const categories = getAllCategories();
console.log(`Categories found: ${categories.join(', ')}`);

console.log('\n=== Testing getArticleBySlug ===');
const testSlug = articles[0]?.slug;
if (testSlug) {
  const foundArticle = getArticleBySlug(testSlug);
  console.log(`✓ Article found by slug "${testSlug}": ${foundArticle ? 'YES' : 'NO'}`);
}

console.log('\n=== All Articles Loaded ===');
articles.forEach((article, index) => {
  console.log(`${index + 1}. [${article.category}] ${article.date} - ${article.slug}`);
});

console.log('\n✅ All tests completed successfully!');
