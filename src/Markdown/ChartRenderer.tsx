import { FC, useMemo } from 'react';
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
    <div className={className}>
      {title && (
        <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
          {title}
        </div>
      )}
      <div className="flex items-center justify-center">{chartElement}</div>
    </div>
  );
};

/**
 * Parses a chart configuration from a JSON string.
 * Returns null if parsing fails.
 */
export function parseChartConfig(value: string): ChartConfig | null {
  try {
    const config = JSON.parse(value);
    if (config && config.type && config.data) {
      return config as ChartConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if a code block is a chart block.
 */
export function isChartCodeBlock(language: string | undefined): boolean {
  return language === 'chart' || language === 'language-chart';
}
