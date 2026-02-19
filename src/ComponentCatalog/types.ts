import { FC, ReactNode } from 'react';
import { Components } from 'react-markdown';
import { Plugin } from 'unified';

/**
 * A Zod-like schema object. We only depend on the `.parse()` and
 * `.safeParse()` interface so any Zod-compatible library works and
 * the `zod` package itself can be tree-shaken if the consumer
 * doesn't use schema validation.
 */
export interface ZodLike<T = any> {
  parse: (data: unknown) => T;
  safeParse: (
    data: unknown
  ) =>
    | { success: true; data: T }
    | {
        success: false;
        error: { issues: { message: string; path: (string | number)[] }[] };
      };
  /** Optional — used by `generatePrompt` to produce a JSON Schema. */
  _def?: any;
}

/**
 * Definition for a single component in the catalog.
 */
export interface ComponentDefinition<
  TProps extends Record<string, any> = Record<string, any>
> {
  /**
   * Human-readable description of what this component renders.
   * Included in the generated LLM system prompt.
   */
  description: string;

  /**
   * Zod (or Zod-compatible) schema that validates the props the LLM provides.
   * Used for runtime validation and system-prompt generation.
   */
  props: ZodLike<TProps>;

  /**
   * The React component to render. Receives validated props and optional
   * children (for nested component specs) plus a `sendMessage` callback
   * from ChatContext.
   */
  component: FC<
    TProps & { children?: ReactNode; sendMessage?: (message: string) => void }
  >;
}

/**
 * Map of component name → definition. This is what the user passes
 * to `componentCatalog()`.
 */
export type ComponentDefinitions = Record<string, ComponentDefinition>;

/**
 * The JSON spec format that the LLM emits inside ```component blocks.
 *
 * Single component:
 *   { "type": "WeatherCard", "props": { "city": "SF" } }
 *
 * With nested children:
 *   { "type": "Row", "props": {}, "children": [ ... ] }
 *
 * Multiple components (array):
 *   [ { "type": "A", "props": {} }, { "type": "B", "props": {} } ]
 */
export interface ComponentSpec {
  /** Component name — must match a key in the catalog. */
  type: string;
  /** Props passed to the component after Zod validation. */
  props: Record<string, any>;
  /** Optional nested component specs. */
  children?: ComponentSpec[];
}

/**
 * Options for `componentCatalog()`.
 */
export interface ComponentCatalogOptions {
  /**
   * The fenced-code-block language tag to detect.
   * @default 'component'
   */
  language?: string;

  /**
   * Called when a component spec fails validation.
   * Return a ReactNode to render, or `undefined` to use the default error UI.
   */
  onError?: (error: ComponentCatalogError) => ReactNode | undefined;
}

/**
 * Error details passed to the `onError` callback.
 */
export interface ComponentCatalogError {
  /** What went wrong. */
  type: 'invalid_json' | 'unknown_component' | 'invalid_props' | 'render_error';
  /** Human-readable message. */
  message: string;
  /** The raw code block content. */
  raw: string;
  /** The component type from the spec, if parsed. */
  componentType?: string;
  /** Zod validation issues, if applicable. */
  issues?: { message: string; path: (string | number)[] }[];
}

/**
 * The object returned by `componentCatalog()`.
 */
export interface ComponentCatalog {
  /**
   * Remark plugin that preprocesses ```component code blocks.
   */
  remarkPlugin: Plugin;

  /**
   * Markdown component overrides (`{ pre: ComponentPre }`).
   * Spread into `markdownComponents` or pass to `Chat`.
   */
  components: Components;

  /**
   * Generates an LLM system prompt describing available components.
   */
  systemPrompt: () => string;

  /**
   * The underlying definitions, for advanced use.
   */
  definitions: ComponentDefinitions;
}
