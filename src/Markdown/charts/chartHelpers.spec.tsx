import { describe, it, expect } from 'vitest';
import { parseChartConfig } from './chartHelpers';

describe('parseChartConfig', () => {
  it('parses valid chart config', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: [
        { key: 'A', data: 10 },
        { key: 'B', data: 20 }
      ],
      width: 400,
      height: 300
    });

    const result = parseChartConfig(json);
    expect(result).not.toBeNull();
    expect(result?.type).toBe('bar');
    expect(result?.data).toHaveLength(2);
    expect(result?.data[0].key).toBe('A');
    expect(result?.data[0].data).toBe(10);
  });

  it('parses config with title', () => {
    const json = JSON.stringify({
      type: 'line',
      data: [{ key: 'X', data: 50 }],
      title: 'Test Chart'
    });

    const result = parseChartConfig(json);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('Test Chart');
  });

  it('returns null for invalid JSON', () => {
    const result = parseChartConfig('invalid json');
    expect(result).toBeNull();
  });

  it('returns null for missing type', () => {
    const json = JSON.stringify({
      data: [{ key: 'A', data: 10 }]
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('returns null for missing data', () => {
    const json = JSON.stringify({
      type: 'bar'
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('returns null for non-numeric data values', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: [{ key: 'A', data: 'not a number' }]
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('returns null for data points missing key', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: [{ data: 10 }]
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('returns null for data points missing data value', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: [{ key: 'A' }]
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('returns null for empty data array', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: []
    });
    const result = parseChartConfig(json);
    expect(result).toBeNull();
  });

  it('converts key to string', () => {
    const json = JSON.stringify({
      type: 'bar',
      data: [{ key: 123, data: 10 }]
    });
    const result = parseChartConfig(json);
    expect(result).not.toBeNull();
    expect(result?.data[0].key).toBe('123');
  });

  it('handles all chart types', () => {
    const types = [
      'bar',
      'line',
      'area',
      'pie',
      'radialBar',
      'radialArea',
      'sparkline'
    ];
    for (const type of types) {
      const json = JSON.stringify({
        type,
        data: [{ key: 'A', data: 10 }]
      });
      const result = parseChartConfig(json);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(type);
    }
  });
});
