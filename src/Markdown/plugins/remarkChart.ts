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
 * A remark plugin that preprocesses fenced code blocks with language "chart"
 * by validating and applying default dimensions to the chart configuration.
 *
 * The actual rendering is handled by the ChartRenderer component via
 * chartComponents.
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
    visit(tree, 'code', (node: Code) => {
      if (node.lang !== 'chart') {
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

        // Apply defaults and update the node value with the complete config
        const chartConfig: ChartConfig = {
          ...config,
          width: config.width ?? defaultWidth,
          height: config.height ?? defaultHeight
        };

        // Update the code block content with the processed config
        node.value = JSON.stringify(chartConfig);
      } catch (error) {
        console.warn('remarkChart: Failed to parse chart config:', error);
      }
    });
  };
};
