import { describe, it, expect } from 'vitest';
import { markdownToHtml } from './markdown';

describe('markdownToHtml', () => {
  it('converts headings correctly', () => {
    const md = '# Titulo\n\n## Subtitulo\n\nTexto';
    const html = markdownToHtml(md);
    expect(html).toContain('<h1');
    expect(html).toContain('Titulo');
    expect(html).toContain('<h2');
    expect(html).toContain('Subtitulo');
    expect(html).toContain('<p');
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
});
