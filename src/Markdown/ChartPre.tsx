import React, { FC } from 'react';
import { ChartRenderer } from './ChartRenderer';
import { ChartError } from './ChartError';
import {
  parseChartConfig,
  isChartClassName,
  getChildText
} from './chartHelpers';

export interface ChartPreProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export const ChartPre: FC<ChartPreProps> = ({ children, ...props }) => {
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
          return <ChartRenderer config={chartConfig} />;
        }
      }

      return (
        <ChartError
          title="Failed to parse chart configuration"
          code={codeContent || 'No content'}
        />
      );
    }
  }

  return <pre {...props}>{children}</pre>;
};

export function createChartComponents() {
  return {
    pre: ChartPre
  };
}
