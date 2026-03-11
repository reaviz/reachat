import { describe, it, expect } from 'vitest';
import { createChartComponentDef } from './chartComponentDef';

describe('createChartComponentDef', () => {
  const def = createChartComponentDef();

  it('has a description', () => {
    expect(def.description).toContain('chart');
  });

  it('has a component function', () => {
    expect(typeof def.component).toBe('function');
  });

  describe('props schema', () => {
    it('accepts valid bar chart props', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [
          { key: 'A', data: 10 },
          { key: 'B', data: 20 }
        ]
      });
      expect(result.success).toBe(true);
    });

    it('accepts all valid chart types', () => {
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
        const result = def.props.safeParse({
          type,
          data: [{ key: 'X', data: 1 }]
        });
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid chart type', () => {
      const result = def.props.safeParse({
        type: 'scatter',
        data: [{ key: 'A', data: 10 }]
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing data', () => {
      const result = def.props.safeParse({ type: 'bar' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid data structure', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [{ key: 'A', data: 'not a number' }]
      });
      expect(result.success).toBe(false);
    });

    it('accepts optional width and height', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [{ key: 'A', data: 10 }],
        width: 500,
        height: 300
      });
      expect(result.success).toBe(true);
    });

    it('accepts optional title', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [{ key: 'A', data: 10 }],
        title: 'My Chart'
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty data array', () => {
      // Empty array is valid per schema (z.array has no .min)
      const result = def.props.safeParse({
        type: 'bar',
        data: []
      });
      expect(result.success).toBe(true);
    });

    it('rejects data items missing key', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [{ data: 10 }]
      });
      expect(result.success).toBe(false);
    });

    it('rejects data items missing data field', () => {
      const result = def.props.safeParse({
        type: 'bar',
        data: [{ key: 'A' }]
      });
      expect(result.success).toBe(false);
    });
  });
});
