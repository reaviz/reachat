import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Code } from 'mdast';

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
 * into chart configuration nodes that can be rendered by the ChartRenderer.
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

        // Replace the code node with a custom node that preserves chart config
        // We use the 'html' type with a special data attribute that can be
        // detected by the Markdown component's custom renderer
        const chartNode = {
          type: 'code',
          lang: 'chart',
          meta: null,
          value: JSON.stringify(chartConfig),
          data: {
            hName: 'div',
            hProperties: {
              'data-chart': 'true',
              'data-chart-config': JSON.stringify(chartConfig)
            }
          }
        };

        parent.children[index] = chartNode as unknown as Code;
      } catch (error) {
        console.warn('remarkChart: Failed to parse chart config:', error);
      }
    });
  };
};
