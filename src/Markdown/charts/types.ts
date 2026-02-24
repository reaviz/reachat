/**
 * Supported chart types.
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
