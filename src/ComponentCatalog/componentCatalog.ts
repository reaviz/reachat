import { remarkComponent } from '@/Markdown/plugins/remarkComponent';
import { createComponentPre } from './ComponentPre';
import { generatePrompt } from './generatePrompt';
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

  // remarkComponent is a pass-through plugin (rendering is handled by
  // ComponentPre). We cast to Plugin to satisfy unified's type system —
  // the plugin is a no-op that does not use the processor context.
  const plugin = remarkComponent.bind(undefined, {
    language
  }) as typeof remarkComponent;

  const Pre = createComponentPre(definitions, options);

  return {
    remarkPlugin: plugin,
    components: { pre: Pre },
    systemPrompt: () => generatePrompt(definitions, language),
    definitions
  };
}
