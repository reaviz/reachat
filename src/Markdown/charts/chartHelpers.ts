import React from 'react';
import type { ChartConfig } from '@/Markdown/plugins/remarkChart';

/**
 * Validates that chart data is an array of objects with the required structure.
 * Each item must have a `key` (convertible to string) and `data` (number) property.
 *
 * @param data - The unknown data array to validate
 * @returns An array of validated chart data points with `key` and `data` properties,
 *          or `null` if the data is invalid or empty
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
 * Parses a JSON string into a validated ChartConfig object.
 * The JSON must contain a `type` and `data` property, where `data` is validated
 * using `validateChartData`.
 *
 * @param value - The JSON string to parse
 * @returns A validated ChartConfig object, or `null` if parsing fails or the config is invalid
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
 * Checks if the given className indicates a chart code block.
 * Used to identify markdown code blocks that should be rendered as charts.
 *
 * @param className - The className to check
 * @returns `true` if the className is 'language-chart', `false` otherwise
 */
export function isChartClassName(className?: string): boolean {
  return className === 'language-chart';
}

/**
 * Recursively extracts text content from React children.
 * Handles strings, numbers, arrays, and React elements by traversing
 * their children props.
 *
 * @param children - The React children to extract text from
 * @returns The concatenated text content as a string
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
