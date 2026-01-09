import { describe, it, expect } from 'vitest';
import { escapeHtmlAttribute } from './escapeHtml';

describe('escapeHtmlAttribute', () => {
  it('should escape ampersand', () => {
    expect(escapeHtmlAttribute('test&value')).toBe('test&amp;value');
  });

  it('should escape double quotes', () => {
    expect(escapeHtmlAttribute('test"value')).toBe('test&quot;value');
  });

  it('should escape single quotes', () => {
    expect(escapeHtmlAttribute("test'value")).toBe('test&#x27;value');
  });

  it('should escape less than', () => {
    expect(escapeHtmlAttribute('test<value')).toBe('test&lt;value');
  });

  it('should escape greater than', () => {
    expect(escapeHtmlAttribute('test>value')).toBe('test&gt;value');
  });

  it('should escape multiple special characters', () => {
    expect(escapeHtmlAttribute('test"<>&value')).toBe(
      'test&quot;&lt;&gt;&amp;value'
    );
  });

  it('should escape XSS payload with script tag', () => {
    const payload = '"><script>alert("XSS")</script>';
    const escaped = escapeHtmlAttribute(payload);
    expect(escaped).toBe(
      '&quot;&gt;&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    );
    // Verify dangerous characters are escaped, not that words don't appear
    expect(escaped).not.toContain('<script>');
    expect(escaped).not.toContain('</script>');
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).toContain('&lt;/script&gt;');
    // Quotes should be escaped
    expect(escaped).not.toContain('"');
    expect(escaped).toContain('&quot;');
  });

  it('should escape XSS payload with onclick', () => {
    const payload = '" onclick="alert(\'XSS\')"';
    const escaped = escapeHtmlAttribute(payload);
    expect(escaped).toBe('&quot; onclick=&quot;alert(&#x27;XSS&#x27;)&quot;');
    // Verify quotes are escaped (the important part for XSS prevention)
    expect(escaped).not.toContain('"');
    expect(escaped).toContain('&quot;');
    expect(escaped).not.toContain("'");
    expect(escaped).toContain('&#x27;');
  });

  it('should escape XSS payload with event handlers', () => {
    const payload = '" onmouseover="alert(1)"';
    const escaped = escapeHtmlAttribute(payload);
    expect(escaped).toBe('&quot; onmouseover=&quot;alert(1)&quot;');
    // Verify quotes are escaped (the important part for XSS prevention)
    expect(escaped).not.toContain('"');
    expect(escaped).toContain('&quot;');
  });

  it('should escape XSS payload with javascript protocol', () => {
    const payload = '" href="javascript:alert(1)"';
    const escaped = escapeHtmlAttribute(payload);
    expect(escaped).toBe('&quot; href=&quot;javascript:alert(1)&quot;');
    // Verify quotes are escaped (the important part for XSS prevention)
    expect(escaped).not.toContain('"');
    expect(escaped).toContain('&quot;');
  });

  it('should handle empty string', () => {
    expect(escapeHtmlAttribute('')).toBe('');
  });

  it('should handle string with no special characters', () => {
    expect(escapeHtmlAttribute('normal text')).toBe('normal text');
  });

  it('should escape all occurrences of special characters', () => {
    expect(escapeHtmlAttribute('a&b&c')).toBe('a&amp;b&amp;c');
    expect(escapeHtmlAttribute('a"b"c')).toBe('a&quot;b&quot;c');
  });

  it('should prevent attribute injection with quotes', () => {
    const malicious = 'test" class="evil" data-x="';
    const escaped = escapeHtmlAttribute(malicious);
    // Should not contain unescaped quotes that could break attribute context
    expect(escaped).not.toMatch(/[^&]"[^q]/); // No unescaped quotes
    expect(escaped).toContain('&quot;');
  });
});
