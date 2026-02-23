/**
 * @deprecated The `remarkChart` plugin has been replaced by
 * `remarkComponent` and the `componentCatalog()` system. Use
 * `componentCatalog({ Chart: createChartComponentDef() })` instead.
 * This export will be removed in a future major version.
 */
export {
  remarkComponent as remarkChart,
  type RemarkComponentOptions as RemarkChartOptions
} from './remarkComponent';

// Re-export chart types that were previously defined here
export type { ChartType, ChartConfig, ChartDataPoint } from '../charts/types';
