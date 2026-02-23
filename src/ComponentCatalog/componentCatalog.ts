import { remarkComponent } from '@/Markdown/plugins/remarkComponent';
import { createComponentPre } from './ComponentPre';
import { generatePrompt } from './generatePrompt';
import type { Plugin } from 'unified';
import type {
  ComponentCatalog,
  ComponentCatalogOptions,
  ComponentDefinitions
} from './types';

/**
 * Creates a component catalog — the main entry point for the
 * dynamic component system.
 *
 * Returns an object with a remark plugin, markdown component overrides,
 * and a system-prompt generator, ready to plug into `<Chat>`.
 *
 * @example
 * ```tsx
 * import { componentCatalog } from 'reachat';
 * import { z } from 'zod';
 *
 * const catalog = componentCatalog({
 *   WeatherCard: {
 *     description: 'Displays weather for a city',
 *     props: z.object({
 *       city: z.string(),
 *       temperature: z.number()
 *     }),
 *     component: ({ city, temperature }) => (
 *       <div>{city}: {temperature}°F</div>
 *     )
 *   }
 * });
 *
 * // Simple — pass the whole catalog:
 * <Chat components={catalog} sessions={sessions}>
 *   ...
 * </Chat>
 *
 * // Advanced — use individual pieces:
 * <Chat
 *   remarkPlugins={[catalog.remarkPlugin]}
 *   markdownComponents={catalog.components}
 * >
 *   ...
 * </Chat>
 *
 * // Generate LLM instructions:
 * const prompt = catalog.systemPrompt();
 * ```
 */
export function componentCatalog(
  definitions: ComponentDefinitions,
  options?: ComponentCatalogOptions
): ComponentCatalog {
  const language = options?.language ?? 'component';

  // remarkComponent is a unified attacher: calling it with options returns
  // a transformer.  We need to wrap it so unified receives a proper Plugin.
  const plugin: Plugin = () =>
    (remarkComponent as (opts?: { language?: string }) => any)({ language });

  const Pre = createComponentPre(definitions, options);

  return {
    remarkPlugin: plugin,
    components: { pre: Pre },
    systemPrompt: () => generatePrompt(definitions, language),
    definitions
  };
}
