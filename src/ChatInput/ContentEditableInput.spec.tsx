import { describe, it, expect } from 'vitest';
import { segmentText } from './utils/parseTriggers';
import { escapeHtmlAttribute } from './utils/escapeHtml';
import { chatTheme } from '@/theme';
import { cn } from 'reablocks';

function renderContentWithTriggers(
  text: string,
  cursorPos: number,
  triggers: string[]
): string {
  const segments = segmentText(text, cursorPos, triggers);
  const htmlParts: string[] = [];

  const tagTheme = chatTheme.input.tag;

  for (const segment of segments) {
    if (segment.type === 'trigger' && segment.trigger) {
      const trigger = segment.trigger;
      const isMention = trigger.trigger === '@';
      const isCommand = trigger.trigger === '/';
      const tagStyleClass = isMention
        ? tagTheme.mention
        : isCommand
          ? tagTheme.command
          : tagTheme.base;

      const tagClass = cn(tagTheme.base, tagStyleClass);

      const escapedContent = segment.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const escapedTrigger = escapeHtmlAttribute(trigger.trigger);
      const escapedValue = escapeHtmlAttribute(trigger.value);

      htmlParts.push(
        `<span class="${tagClass}" data-trigger="${escapedTrigger}" data-value="${escapedValue}">${escapedContent}</span>`
      );
    } else {
      const escaped = segment.content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      htmlParts.push(escaped);
    }
  }

  return htmlParts.join('');
}

describe('ContentEditableInput XSS Prevention', () => {
  describe('renderContent XSS protection', () => {
    it('should escape both trigger character and value in attributes', () => {
      const maliciousValue = 'test" onclick="alert(1)"';
      const text = `@${maliciousValue} hello`;
      const cursorPos = text.length;

      const html = renderContentWithTriggers(text, cursorPos, ['@']);

      const triggerMatch = html.match(/data-trigger="([^"]*)"/);
      expect(triggerMatch).toBeTruthy();
      if (triggerMatch) {
        expect(triggerMatch[1]).not.toContain('"');
      }

      const valueMatch = html.match(/data-value="([^"]*)"/);
      expect(valueMatch).toBeTruthy();
      if (valueMatch) {
        const attributeValue = valueMatch[1];
        expect(attributeValue).not.toContain('"');
        expect(attributeValue).not.toContain('onclick=');
        expect(attributeValue).toContain('&quot;');
      }
    });

    it('should handle multiple malicious triggers in same text', () => {
      const malicious1 = 'test" onclick="alert(1)"';
      const malicious2 = '"><script>alert(2)</script>';
      const text = `@${malicious1} and @${malicious2} end`;
      const cursorPos = text.length;

      const html = renderContentWithTriggers(text, cursorPos, ['@']);

      const dataValueMatches = html.matchAll(/data-value="([^"]*)"/g);
      for (const match of dataValueMatches) {
        const attributeValue = match[1];
        expect(attributeValue).not.toContain('"');
        expect(attributeValue).toContain('&quot;');
      }
      expect(html).toContain('&lt;script&gt;');
    });
  });
});
