import React from 'react';
import type { ChartConfig } from './plugins/remarkChart';

/**
 * Validates and normalizes chart data to ensure all data points have numeric values.
 */
export function validateChartData(
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
export function isChartClassName(className?: string): boolean {
  return className === 'language-chart';
}

/**
 * Extracts text content from React children.
 */
export function getChildText(children: React.ReactNode): string {
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
    if ('props' in children && (children as React.ReactElement).props) {
      const element = children as React.ReactElement;
      return getChildText(element.props.children);
    }
  }
  return '';
}
