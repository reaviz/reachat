import { findAndReplace } from 'mdast-util-find-and-replace';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

/**
 * Interface for defining a redaction matcher.
 */
export interface RedactMatcher {
  /**
   * Name of the matcher (e.g., "SSN", "Credit Card", "Bitcoin").
   */
  name: string;

  /**
   * Regular expression pattern to match sensitive data.
   */
  pattern: RegExp;

  /**
   * Optional validation function that receives the matched value.
   * Return true to redact, false to skip.
   */
  validate?: (match: string) => boolean;
}

/**
 * Creates a remark plugin that redacts sensitive data based on provided matchers.
 * The plugin replaces matched text with HTML elements that can be rendered
 * using the Redact component from reablocks.
 *
 * @param matchers - Array of RedactMatcher objects that define what to redact
 * @returns A remark plugin function
 *
 * @example
 * ```ts
 * const matchers = [
 *   { name: 'SSN', pattern: /\b\d{3}-\d{2}-\d{4}\b/g }
 * ];
 * remarkPlugins={[remarkRedact(matchers)]}
 * ```
 */
export function remarkRedact(matchers: RedactMatcher[]): ReturnType<Plugin> {
  return (tree: Root) => {
    if (!tree || !matchers || matchers.length === 0) {
      return;
    }

    const patterns: Array<[RegExp, (...args: any[]) => any]> = [];

    for (const { name, pattern, validate } of matchers) {
      patterns.push([
        pattern,
        (value: string) => {
          // Apply optional validation
          if (validate && !validate(value)) {
            return false;
          }

          return {
            type: 'html',
            value: `<redact data-redact-name="${name}" data-redact-value="${value.replace(/"/g, '&quot;')}">${value}</redact>`
          };
        }
      ]);
    }

    // Apply all patterns at once
    if (patterns.length > 0) {
      try {
        findAndReplace(tree, patterns as any);
      } catch (err) {
        console.warn('Redact plugin error:', err);
      }
    }
  };
}
