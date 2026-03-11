import type { Plugin } from 'unified';
import type { Root } from 'mdast';

/**
 * Options for the remarkComponent plugin.
 */
export interface RemarkComponentOptions {
  /**
   * The fenced-code-block language tag to detect.
   * @default 'component'
   */
  language?: string;
}

/**
 * A remark plugin that acts as a pass-through for fenced code blocks with
 * the configured language tag (default: `component`).
 *
 * The actual rendering is handled entirely by `ComponentPre` which
 * intercepts `<pre>` elements with a matching `language-{tag}` class.
 * This plugin exists as an integration point so the catalog can expose
 * a standard `remarkPlugin` property; it does not transform the AST.
 *
 * Usage in markdown:
 * ```component
 * { "type": "WeatherCard", "props": { "city": "SF", "temperature": 72 } }
 * ```
 */
export const remarkComponent: Plugin<[RemarkComponentOptions?], Root> = (
  _options = {}
) => {
  // Intentional no-op — ComponentPre handles rendering via markdownComponents.
  return () => {};
};
