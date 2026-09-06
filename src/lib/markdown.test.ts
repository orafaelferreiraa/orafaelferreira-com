import { describe, it, expect } from 'vitest';
import { countWords, extractHeadings, markdownToHtml, slugifyHeading } from './markdown';

describe('markdownToHtml', () => {
  it('converts headings and demotes a body h1 to h2 (page title is the only h1)', () => {
    const md = '# Titulo\n\n## Subtitulo\n\n### Sub sub\n\nTexto';
    const html = markdownToHtml(md);
    expect(html).not.toContain('<h1');
    expect(html).toContain('<h2 id="titulo"');
    expect(html).toContain('Titulo');
    expect(html).toContain('<h2 id="subtitulo"');
    expect(html).toContain('<h3 id="sub-sub"');
    expect(html).toContain('<p');
  });

  it('gives duplicate headings unique ids', () => {
    const html = markdownToHtml('## Passo\n\ntexto\n\n## Passo\n\ntexto');
    expect(html).toContain('id="passo"');
    expect(html).toContain('id="passo-2"');
  });

  it('escapes code blocks and adds wrapper', () => {
    const md = '```ts\nconst a = 1 < 2\n```';
    const html = markdownToHtml(md);
    expect(html).toContain('<pre');
    expect(html).toContain('&lt;'); // escaped <
    expect(html).toContain('code');
  });

  it('renders lists properly', () => {
    const md = '- item 1\n- item 2';
    const html = markdownToHtml(md);
    expect(html).toContain('<ul');
    expect(html).toContain('<li>item 1</li>');
    expect(html).toContain('<li>item 2</li>');
  });

  it('preserves blank lines inside code blocks', () => {
    const md = '```python\nline1\n\nline2\n```';
    const html = markdownToHtml(md);
    expect(html).toContain('line1\n\nline2');
  });

  it('loads the first image eagerly and the rest lazily, keeping alt text', () => {
    const md = '![Capa do artigo](https://x/a.png)\n\n![Segunda imagem](https://x/b.png)';
    const html = markdownToHtml(md);
    expect(html).toContain('alt="Capa do artigo"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');
    expect(html.match(/loading="lazy"/g)?.length).toBe(1);
    expect(html.match(/decoding="async"/g)?.length).toBe(2);
  });
});

describe('extractHeadings', () => {
  it('returns h2/h3 (h1 demoted) outside code blocks with matching ids', () => {
    const md = '# Intro\n\n```md\n## nao conta\n```\n\n## Configuração do **AKS**\n\n### Detalhe\n\n#### h4 ignorado';
    const headings = extractHeadings(md);
    expect(headings).toEqual([
      { level: 2, text: 'Intro', id: 'intro' },
      { level: 2, text: 'Configuração do AKS', id: 'configuracao-do-aks' },
      { level: 3, text: 'Detalhe', id: 'detalhe' },
    ]);
    const html = markdownToHtml(md);
    for (const heading of headings) expect(html).toContain(`id="${heading.id}"`);
  });
});

describe('slugifyHeading / countWords', () => {
  it('slugifies accents, symbols and inline markdown', () => {
    expect(slugifyHeading('Observabilidade: métricas & logs!')).toBe('observabilidade-metricas-logs');
    expect(slugifyHeading('   ')).toBe('secao');
  });

  it('counts words ignoring code blocks and image syntax', () => {
    const md = 'Um dois três\n\n```sh\nls -la\n```\n\n![alt text](https://x/y.png)\n\nquatro';
    expect(countWords(md)).toBe(4);
  });
});
