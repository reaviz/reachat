export * from './types';
export * from './ChartRenderer';
export * from './ComponentError';

/**
 * @deprecated Use `componentCatalog({ Chart: createChartComponentDef() })`
 * instead. This export will be removed in a future major version.
 */
export const chartComponents = {} as Record<string, never>;
