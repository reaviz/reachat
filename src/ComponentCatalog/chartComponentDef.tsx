import React from 'react';
import { ChartRenderer } from '@/Markdown/charts/ChartRenderer';
import type { ChartConfig } from '@/Markdown/charts/types';
import type { ComponentDefinition } from './types';

/**
 * Wraps `ChartRenderer` as a component definition so charts can
 * be registered in a `componentCatalog()`.
 *
 * The adapter renders a `ChartRenderer` internally using the same
 * config-based API, with reaviz as the underlying chart library.
 *
 * Because reaviz is an optional peer dependency, this adapter is
 * fully tree-shakeable — it only loads reaviz code when imported.
 *
 * Both `zod` and `reaviz` are required when this helper is used;
 * the imports are deferred to the call site so that consumers who
 * never call `createChartComponentDef()` are not forced to install
 * either dependency.
 *
 * @example
 * ```tsx
 * import { componentCatalog, createChartComponentDef } from 'reachat';
 *
 * const catalog = componentCatalog({
 *   Chart: createChartComponentDef(),
 *   // ... other components
 * });
 * ```
 *
 * The LLM can then output:
 * ```component
 * {
 *   "type": "Chart",
 *   "props": {
 *     "type": "bar",
 *     "data": [{ "key": "A", "data": 10 }, { "key": "B", "data": 20 }],
 *     "title": "My Chart"
 *   }
 * }
 * ```
 */
export function createChartComponentDef(): ComponentDefinition {
  // Lazy-require zod so the module can be loaded without zod installed.
  // Consumers who never call this function won't trigger the import.
  const { z } = require('zod');

  const chartPropsSchema = z.object({
    type: z
      .enum([
        'bar',
        'line',
        'area',
        'pie',
        'radialBar',
        'radialArea',
        'sparkline'
      ])
      .describe('Chart type'),
    data: z
      .array(z.object({ key: z.string(), data: z.number() }))
      .describe('Array of { key, data } data points'),
    width: z.number().describe('Chart width in px').optional(),
    height: z.number().describe('Chart height in px').optional(),
    title: z.string().describe('Chart title').optional()
  });

  return {
    description:
      'Renders a chart. Supported types: bar, line, area, pie, radialBar, radialArea, sparkline',
    props: chartPropsSchema,
    component: ({
      children: _children,
      sendMessage: _sendMessage,
      ...config
    }) => <ChartRenderer config={config as ChartConfig} />
  };
}
