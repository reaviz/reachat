import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root, Link, Paragraph, Text, List } from 'mdast';
import { remarkCve } from './remarkCve';

const parse = (md: string): Root =>
  unified().use(remarkParse).use(remarkCve).parse(md) as Root;

const process = (md: string): Root => {
  const processor = unified().use(remarkParse).use(remarkCve);
  const tree = processor.parse(md) as Root;
  return processor.runSync(tree) as Root;
};

describe('remarkCve', () => {
  it('replaces a CVE id inside a paragraph with an inline link', () => {
    const tree = process('See CVE-2021-34527 for details.');
    const paragraph = tree.children[0] as Paragraph;

    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children).toHaveLength(3);

    const [before, link, after] = paragraph.children as [Text, Link, Text];
    expect(before.type).toBe('text');
    expect(before.value).toBe('See ');

    expect(link.type).toBe('link');
    expect(link.url).toBe(
      'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-34527'
    );
    expect(link.children).toHaveLength(1);
    const linkText = link.children[0] as Text;
    expect(linkText.type).toBe('text');
    expect(linkText.value).toBe('CVE-2021-34527');

    expect(after.type).toBe('text');
    expect(after.value).toBe(' for details.');
  });

  it('does not wrap the link in an extra paragraph (keeps it inline)', () => {
    const tree = process('CVE-2021-44228');
    expect(tree.children).toHaveLength(1);
    const paragraph = tree.children[0] as Paragraph;
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children[0].type).toBe('link');
  });

  it('replaces multiple CVE ids in the same paragraph', () => {
    const tree = process('CVE-2021-34527 and CVE-2021-44228 are critical.');
    const paragraph = tree.children[0] as Paragraph;
    const links = paragraph.children.filter(
      (n): n is Link => n.type === 'link'
    );
    expect(links).toHaveLength(2);
    expect(links[0].url).toContain('CVE-2021-34527');
    expect(links[1].url).toContain('CVE-2021-44228');
  });

  it('replaces CVE ids inside list items', () => {
    const md = ['- CVE-2021-34527', '- CVE-2021-44228'].join('\n');
    const tree = process(md);
    const list = tree.children[0] as List;
    expect(list.type).toBe('list');

    list.children.forEach((item, idx) => {
      const para = item.children[0] as Paragraph;
      const link = para.children[0] as Link;
      expect(link.type).toBe('link');
      expect(link.url).toContain(
        idx === 0 ? 'CVE-2021-34527' : 'CVE-2021-44228'
      );
      const linkText = link.children[0] as Text;
      expect(linkText.type).toBe('text');
      expect(linkText.value).toBe(
        idx === 0 ? 'CVE-2021-34527' : 'CVE-2021-44228'
      );
    });
  });

  it('matches CVE ids case-insensitively but preserves casing in output', () => {
    const tree = process('cve-2021-34527');
    const paragraph = tree.children[0] as Paragraph;
    const link = paragraph.children[0] as Link;
    expect(link.type).toBe('link');
    expect(link.url).toBe(
      'https://cve.mitre.org/cgi-bin/cvename.cgi?name=cve-2021-34527'
    );
    const linkText = link.children[0] as Text;
    expect(linkText.value).toBe('cve-2021-34527');
  });

  it('supports CVE ids with up to 7 digits in the suffix', () => {
    const tree = process('CVE-2024-1234567 was reported.');
    const paragraph = tree.children[0] as Paragraph;
    const link = paragraph.children.find((n): n is Link => n.type === 'link');
    expect(link).toBeDefined();
    expect(link!.url).toContain('CVE-2024-1234567');
  });

  it('does not replace strings that look like but are not CVEs', () => {
    const tree = process('CVE-1899-1234 and CVE-2021-12 are not valid.');
    const paragraph = tree.children[0] as Paragraph;
    const links = paragraph.children.filter(
      (n): n is Link => n.type === 'link'
    );
    expect(links).toHaveLength(0);
  });

  it('leaves non-CVE markdown untouched', () => {
    const tree = process('Hello world, no vulnerabilities here.');
    const paragraph = tree.children[0] as Paragraph;
    expect(paragraph.children).toHaveLength(1);
    expect(paragraph.children[0].type).toBe('text');
  });

  it('produces a valid mdast link node (children are phrasing content)', () => {
    const tree = process('CVE-2021-34527');
    const paragraph = tree.children[0] as Paragraph;
    const link = paragraph.children[0] as Link;

    expect(
      link.children.every(child => 'value' in child || 'children' in child)
    ).toBe(true);
    // link's direct children should be text nodes (inline), not nested
    // children-of-children objects without a `type` field
    link.children.forEach(child => {
      expect(child).toHaveProperty('type');
      expect(typeof (child as { type: string }).type).toBe('string');
    });
  });

  it('parses without error and is callable as a unified plugin', () => {
    expect(() => parse('CVE-2021-34527')).not.toThrow();
  });
});
