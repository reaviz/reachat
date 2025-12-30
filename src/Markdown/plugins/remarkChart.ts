import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Code, Html } from 'mdast';

/**
 * Supported chart types for the remarkChart plugin.
 */
export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'scatter'
  | 'radialBar'
  | 'radialArea'
  | 'sparkline';

/**
 * Data point structure for charts.
 */
export interface ChartDataPoint {
  key: string;
  data: number | ChartDataPoint[];
}

/**
 * Configuration for chart rendering.
 */
export interface ChartConfig {
  type: ChartType;
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Options for the remarkChart plugin.
 */
export interface RemarkChartOptions {
  /**
   * Default width for charts.
   * @default 400
   */
  defaultWidth?: number;

  /**
   * Default height for charts.
   * @default 300
   */
  defaultHeight?: number;
}

/**
 * A remark plugin that transforms fenced code blocks with language "chart"
 * into custom chart elements that can be rendered by the ChartRenderer.
 *
 * Usage in markdown:
 * ```chart
 * {
 *   "type": "bar",
 *   "data": [
 *     { "key": "A", "data": 10 },
 *     { "key": "B", "data": 20 }
 *   ]
 * }
 * ```
 *
 * @param options - Plugin options
 */
export const remarkChart: Plugin<[RemarkChartOptions?], Root> = (
  options = {}
) => {
  const { defaultWidth = 400, defaultHeight = 300 } = options;

  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang !== 'chart' || !parent || index === undefined) {
        return;
      }

      try {
        const config = JSON.parse(node.value) as ChartConfig;

        // Validate required fields
        if (!config.type || !config.data) {
          console.warn(
            'remarkChart: Invalid chart config - missing type or data'
          );
          return;
        }

        // Apply defaults
        const chartConfig: ChartConfig = {
          ...config,
          width: config.width ?? defaultWidth,
          height: config.height ?? defaultHeight
        };

        // Replace the code node with an HTML node containing the chart data
        // The config is encoded in a data attribute that ChartRenderer can parse
        const escapedConfig = JSON.stringify(chartConfig)
          .replace(/&/g, '&amp;')
          .replace(/'/g, '&#39;')
          .replace(/"/g, '&quot;');

        const chartNode: Html = {
          type: 'html',
          value: `<div data-reaviz-chart="${escapedConfig}"></div>`
        };

        parent.children[index] = chartNode;
      } catch (error) {
        console.warn('remarkChart: Failed to parse chart config:', error);
      }
    });
  };
};
