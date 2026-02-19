import { ChartRenderer } from '@/Markdown/charts/ChartRenderer';
import type { ComponentDefinition, ZodLike } from './types';

/**
 * Zod-like schema that validates chart configuration objects.
 * This avoids a hard dependency on Zod while providing the same
 * safeParse/parse interface the catalog system expects.
 */
const chartPropsSchema: ZodLike<{
  type: string;
  data: { key: string; data: number }[];
  width?: number;
  height?: number;
  title?: string;
}> = {
  _def: {
    typeName: 'ZodObject',
    shape: {
      type: {
        _def: {
          typeName: 'ZodEnum',
          values: [
            'bar',
            'line',
            'area',
            'pie',
            'radialBar',
            'radialArea',
            'sparkline'
          ],
          description: 'Chart type'
        }
      },
      data: {
        _def: {
          typeName: 'ZodArray',
          type: {
            _def: {
              typeName: 'ZodObject',
              shape: {
                key: { _def: { typeName: 'ZodString' } },
                data: { _def: { typeName: 'ZodNumber' } }
              }
            }
          },
          description: 'Array of { key, data } data points'
        }
      },
      width: {
        _def: {
          typeName: 'ZodOptional',
          innerType: {
            _def: { typeName: 'ZodNumber', description: 'Chart width in px' }
          }
        }
      },
      height: {
        _def: {
          typeName: 'ZodOptional',
          innerType: {
            _def: { typeName: 'ZodNumber', description: 'Chart height in px' }
          }
        }
      },
      title: {
        _def: {
          typeName: 'ZodOptional',
          innerType: {
            _def: { typeName: 'ZodString', description: 'Chart title' }
          }
        }
      }
    }
  },
  parse(data: unknown) {
    const result = this.safeParse(data);
    if (!result.success) {
      throw new Error(
        result.error.issues[0]?.message ?? 'Invalid chart config'
      );
    }
    return result.data;
  },
  safeParse(data: unknown) {
    if (!data || typeof data !== 'object') {
      return {
        success: false as const,
        error: { issues: [{ message: 'Expected an object', path: [] }] }
      };
    }

    const obj = data as Record<string, unknown>;

    if (typeof obj.type !== 'string') {
      return {
        success: false as const,
        error: {
          issues: [{ message: '"type" must be a string', path: ['type'] }]
        }
      };
    }

    const validTypes = [
      'bar',
      'line',
      'area',
      'pie',
      'radialBar',
      'radialArea',
      'sparkline'
    ];
    if (!validTypes.includes(obj.type)) {
      return {
        success: false as const,
        error: {
          issues: [
            {
              message: `"type" must be one of: ${validTypes.join(', ')}`,
              path: ['type']
            }
          ]
        }
      };
    }

    if (!Array.isArray(obj.data)) {
      return {
        success: false as const,
        error: {
          issues: [{ message: '"data" must be an array', path: ['data'] }]
        }
      };
    }

    for (let i = 0; i < obj.data.length; i++) {
      const item = obj.data[i];
      if (
        !item ||
        typeof item !== 'object' ||
        typeof (item as any).key === 'undefined' ||
        typeof (item as any).data !== 'number'
      ) {
        return {
          success: false as const,
          error: {
            issues: [
              {
                message:
                  'Each data item must have a "key" and a numeric "data"',
                path: ['data', i]
              }
            ]
          }
        };
      }
    }

    return {
      success: true as const,
      data: {
        type: obj.type as string,
        data: (obj.data as any[]).map(d => ({
          key: String(d.key),
          data: d.data as number
        })),
        ...(typeof obj.width === 'number' ? { width: obj.width } : {}),
        ...(typeof obj.height === 'number' ? { height: obj.height } : {}),
        ...(typeof obj.title === 'string' ? { title: obj.title } : {})
      }
    };
  }
};

/**
 * Wraps `ChartRenderer` as a component definition so charts can
 * be registered in a `componentCatalog()`.
 *
 * The adapter renders a `ChartRenderer` internally using the same
 * config-based API, with reaviz as the underlying chart library.
 *
 * Because reaviz is an optional peer dependency, this adapter is
 * fully tree-shakeable — it only loads reaviz code when imported.
 *
 * @example
 * ```tsx
 * import { componentCatalog, createChartComponentDef } from 'reachat';
 *
 * const catalog = componentCatalog({
 *   Chart: createChartComponentDef(),
 *   // ... other components
 * });
 * ```
 *
 * The LLM can then output:
 * ```component
 * {
 *   "type": "Chart",
 *   "props": {
 *     "type": "bar",
 *     "data": [{ "key": "A", "data": 10 }, { "key": "B", "data": 20 }],
 *     "title": "My Chart"
 *   }
 * }
 * ```
 */
export function createChartComponentDef(): ComponentDefinition {
  return {
    description:
      'Renders a chart. Supported types: bar, line, area, pie, radialBar, radialArea, sparkline',
    props: chartPropsSchema,
    component: ({
      children: _children,
      sendMessage: _sendMessage,
      ...config
    }) => ChartRenderer({ config: config as any })
  };
}
