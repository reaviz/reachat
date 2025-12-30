import React, { FC, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import {
  BarChart,
  BarSeries,
  LineChart,
  LineSeries,
  AreaChart,
  AreaSeries,
  PieChart,
  PieArcSeries,
  ScatterPlot,
  ScatterSeries,
  ScatterPoint,
  RadialBarChart,
  RadialBarSeries,
  RadialAreaChart,
  RadialAreaSeries,
  SparklineChart,
  ChartShallowDataShape
} from 'reaviz';
import type { ChartConfig, ChartType } from './plugins/remarkChart';

/**
 * Error boundary to catch runtime errors in chart rendering.
 */
interface ChartErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ChartErrorBoundary extends Component<
  { children: ReactNode; config: ChartConfig },
  ChartErrorBoundaryState
> {
  constructor(props: { children: ReactNode; config: ChartConfig }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChartRenderer error:', error, errorInfo);
    console.error('Chart config:', this.props.config);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-4 p-4 border border-red-300 dark:border-red-700 rounded bg-red-50 dark:bg-red-900/20">
          <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
            Chart rendering error: {this.state.error?.message}
          </div>
          <pre className="text-xs overflow-auto">
            <code>{JSON.stringify(this.props.config, null, 2)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface ChartRendererProps {
  /**
   * Chart configuration object containing type, data, and optional dimensions.
   */
  config: ChartConfig;

  /**
   * Additional CSS class name.
   */
  className?: string;
}

/**
 * A component that renders various chart types using the reaviz library.
 * This is designed to work with the remarkChart plugin for rendering
 * charts embedded in markdown content.
 */
export const ChartRenderer: FC<ChartRendererProps> = ({
  config,
  className
}) => {
  const { type, data, width = 400, height = 300, title } = config;

  const chartElement = useMemo(() => {
    // Cast data to reaviz's expected format
    const chartData = data as ChartShallowDataShape[];

    const chartProps = {
      width,
      height,
      data: chartData
    };

    switch (type as ChartType) {
      case 'bar':
        return (
          <BarChart
            {...chartProps}
            series={<BarSeries colorScheme="cybertron" />}
          />
        );

      case 'line':
        return (
          <LineChart
            {...chartProps}
            series={<LineSeries colorScheme="cybertron" />}
          />
        );

      case 'area':
        return (
          <AreaChart
            {...chartProps}
            series={<AreaSeries colorScheme="cybertron" />}
          />
        );

      case 'pie':
        return (
          <PieChart
            width={width}
            height={height}
            data={chartData}
            series={<PieArcSeries colorScheme="cybertron" />}
          />
        );

      case 'scatter':
        return (
          <ScatterPlot
            {...chartProps}
            series={
              <ScatterSeries point={<ScatterPoint color="cybertron" />} />
            }
          />
        );

      case 'radialBar':
        return (
          <RadialBarChart
            width={width}
            height={height}
            data={chartData}
            series={<RadialBarSeries colorScheme="cybertron" />}
          />
        );

      case 'radialArea':
        return (
          <RadialAreaChart
            width={width}
            height={height}
            data={chartData}
            series={<RadialAreaSeries colorScheme="cybertron" />}
          />
        );

      case 'sparkline':
        return (
          <SparklineChart width={width} height={height} data={chartData} />
        );

      default:
        return (
          <div className="text-red-500 p-4 border border-red-300 rounded">
            Unknown chart type: {type}
          </div>
        );
    }
  }, [type, data, width, height]);

  return (
    <ChartErrorBoundary config={config}>
      <div className={className}>
        {title && (
          <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
            {title}
          </div>
        )}
        <div className="flex items-center justify-center">{chartElement}</div>
      </div>
    </ChartErrorBoundary>
  );
};

/**
 * Validates and normalizes chart data to ensure all data points have numeric values.
 */
function validateChartData(
  data: unknown[]
): { key: string; data: number }[] | null {
  if (!Array.isArray(data)) {
    return null;
  }

  const validData: { key: string; data: number }[] = [];

  for (const item of data) {
    if (
      item &&
      typeof item === 'object' &&
      'key' in item &&
      'data' in item &&
      typeof (item as { data: unknown }).data === 'number'
    ) {
      validData.push({
        key: String((item as { key: unknown }).key),
        data: (item as { data: number }).data
      });
    } else {
      // Invalid data point found
      return null;
    }
  }

  return validData.length > 0 ? validData : null;
}

/**
 * Parses a chart configuration from a JSON string.
 * Returns null if parsing fails or data is invalid.
 */
export function parseChartConfig(value: string): ChartConfig | null {
  try {
    const config = JSON.parse(value);
    if (!config || !config.type || !config.data) {
      return null;
    }

    // Validate and normalize the data
    const validData = validateChartData(config.data);
    if (!validData) {
      console.warn('parseChartConfig: Invalid chart data format');
      return null;
    }

    return {
      ...config,
      data: validData
    } as ChartConfig;
  } catch (error) {
    console.warn('parseChartConfig: Failed to parse JSON', error);
    return null;
  }
}

/**
 * Checks if a className indicates a chart code block.
 */
function isChartClassName(className?: string): boolean {
  return className === 'language-chart';
}

/**
 * Extracts text content from React children.
 */
function getChildText(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getChildText).join('');
  }
  if (typeof children === 'object') {
    // Handle React elements
    if ('props' in children && (children as React.ReactElement).props) {
      const element = children as React.ReactElement;
      return getChildText(element.props.children);
    }
  }
  return '';
}

/**
 * Creates markdown components with chart support.
 * Pass the returned object to the Chat component's `markdownComponents` prop.
 *
 * The remarkChart plugin preprocesses chart code blocks, and this component
 * handles rendering them as actual charts using reaviz.
 *
 * @example
 * ```tsx
 * import { remarkChart, createChartComponents } from 'reachat';
 *
 * <Chat
 *   remarkPlugins={[remarkChart]}
 *   markdownComponents={createChartComponents()}
 * >
 *   ...
 * </Chat>
 * ```
 */
export function createChartComponents() {
  return {
    // Handle fenced code blocks (pre > code)
    pre: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => {
      // Check if the child is a code element with chart language
      if (children && typeof children === 'object' && 'props' in children) {
        const codeElement = children as React.ReactElement<{
          className?: string;
          children?: React.ReactNode;
        }>;

        if (isChartClassName(codeElement.props?.className)) {
          const codeContent = getChildText(codeElement.props?.children);

          if (codeContent) {
            const chartConfig = parseChartConfig(codeContent);

            if (chartConfig) {
              return <ChartRenderer config={chartConfig} className="my-4" />;
            }
          }

          // Chart code block but failed to parse - show error
          return (
            <div className="my-4 p-4 border border-red-300 dark:border-red-700 rounded bg-red-50 dark:bg-red-900/20">
              <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
                Failed to parse chart configuration
              </div>
              <pre className="text-xs overflow-auto">
                <code>{codeContent || 'No content'}</code>
              </pre>
            </div>
          );
        }
      }

      // Return normal pre for non-chart code blocks
      return <pre {...props}>{children}</pre>;
    }
  };
}
