import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Code } from 'mdast';

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
 * A remark plugin that identifies fenced code blocks with the configured
 * language tag (default: `component`) and validates their JSON content.
 *
 * The plugin preprocesses the AST node while the actual rendering is
 * handled by `ComponentPre` via `markdownComponents`.
 *
 * Usage in markdown:
 * ```component
 * { "type": "WeatherCard", "props": { "city": "SF", "temperature": 72 } }
 * ```
 */
export const remarkComponent: Plugin<[RemarkComponentOptions?], Root> = (
  options = {}
) => {
  const { language = 'component' } = options;

  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (node.lang !== language) {
        return;
      }

      // Attempt to parse JSON so we fail fast on obvious syntax errors.
      // The code block value is left as-is for the ComponentPre handler
      // to parse and render.
      try {
        JSON.parse(node.value);
      } catch (error) {
        console.warn(
          'remarkComponent: Invalid JSON in component block:',
          error
        );
      }
    });
  };
};
