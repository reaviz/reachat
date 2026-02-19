import React, { FC, useMemo, useContext } from 'react';
import {
  BarChart,
  BarSeries,
  LineChart,
  LineSeries,
  AreaChart,
  AreaSeries,
  PieChart,
  PieArcSeries,
  RadialBarChart,
  RadialBarSeries,
  RadialAreaChart,
  RadialAreaSeries,
  SparklineChart,
  ChartShallowDataShape,
  LinearXAxis,
  LinearYAxis
} from 'reaviz';
import { cn } from 'reablocks';
import type { ChartConfig, ChartType } from './types';
import { ChatContext } from '@/ChatContext';
import { ChartError } from './ChartError';

export interface ChartRendererProps {
  /**
   * The chart configuration.
   */
  config: ChartConfig;

  /**
   * The class name to apply to the chart container.
   */
  className?: string;
}

export const ChartRenderer: FC<ChartRendererProps> = ({
  config,
  className
}) => {
  const { theme } = useContext(ChatContext);
  const { type, data, width = 400, height = 300, title } = config;

  const chartElement = useMemo(() => {
    const chartData: ChartShallowDataShape[] = data
      .filter(
        (d): d is { key: string; data: number } => typeof d.data === 'number'
      )
      .map(d => ({
        key: d.key,
        data: d.data
      }));

    if (!chartData || chartData.length === 0) {
      return <ChartError variant="warning" message="No chart data available" />;
    }

    for (const point of chartData) {
      if (typeof point.data !== 'number' || isNaN(point.data)) {
        return (
          <ChartError
            message={`Invalid data point: ${JSON.stringify(point)}`}
          />
        );
      }
    }

    const chartProps = {
      width,
      height,
      data: chartData
    };

    try {
      switch (type as ChartType) {
        case 'bar':
          return <BarChart {...chartProps} series={<BarSeries />} />;

        case 'line':
          return (
            <LineChart
              {...chartProps}
              xAxis={<LinearXAxis type="category" />}
              yAxis={<LinearYAxis type="value" />}
              series={<LineSeries />}
            />
          );

        case 'area':
          return (
            <AreaChart
              {...chartProps}
              xAxis={<LinearXAxis type="category" />}
              yAxis={<LinearYAxis type="value" />}
              series={<AreaSeries />}
            />
          );

        case 'pie':
          return (
            <PieChart
              width={width}
              height={height}
              data={chartData}
              series={<PieArcSeries />}
            />
          );

        case 'radialBar':
          return (
            <RadialBarChart
              width={width}
              height={height}
              data={chartData}
              series={<RadialBarSeries />}
            />
          );

        case 'radialArea':
          return (
            <RadialAreaChart
              width={width}
              height={height}
              data={chartData}
              series={<RadialAreaSeries />}
            />
          );

        case 'sparkline':
          return (
            <SparklineChart width={width} height={height} data={chartData} />
          );

        default:
          return <ChartError message={`Unknown chart type: ${type}`} />;
      }
    } catch (error) {
      return <ChartError message={`Chart render error: ${String(error)}`} />;
    }
  }, [type, data, width, height]);

  return (
    <div className={cn(theme.chart.base, className)}>
      {title && <div className={theme.chart.title}>{title}</div>}
      <div className={theme.chart.content}>{chartElement}</div>
    </div>
  );
};
