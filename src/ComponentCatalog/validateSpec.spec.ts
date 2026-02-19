import { describe, it, expect } from 'vitest';
import { validateSpec } from './validateSpec';
import type {
  ComponentDefinitions,
  ComponentCatalogError,
  ZodLike
} from './types';

// Minimal Zod-like schema for testing
function mockSchema(expectedKeys: string[]): ZodLike {
  return {
    parse: (v: unknown) => v,
    safeParse: (v: unknown) => {
      if (!v || typeof v !== 'object') {
        return {
          success: false as const,
          error: {
            issues: [
              { message: 'Expected object', path: [] as (string | number)[] }
            ]
          }
        };
      }
      for (const key of expectedKeys) {
        if (!(key in (v as Record<string, unknown>))) {
          return {
            success: false as const,
            error: {
              issues: [
                {
                  message: `Missing "${key}"`,
                  path: [key] as (string | number)[]
                }
              ]
            }
          };
        }
      }
      return { success: true as const, data: v };
    }
  };
}

const definitions: ComponentDefinitions = {
  WeatherCard: {
    description: 'Weather display',
    props: mockSchema(['city', 'temperature']),
    component: () => null
  },
  AlertBox: {
    description: 'Alert display',
    props: mockSchema(['title', 'message']),
    component: () => null
  }
};

/** Helper to extract the error from a failed result (works around TS 4.9 narrowing) */
function getError(
  result: ReturnType<typeof validateSpec>
): ComponentCatalogError {
  return (result as { ok: false; error: ComponentCatalogError }).error;
}

describe('validateSpec', () => {
  it('validates a single valid component spec', () => {
    const raw = JSON.stringify({
      type: 'WeatherCard',
      props: { city: 'SF', temperature: 72 }
    });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(true);
    const { specs } = result as { ok: true; specs: any[] };
    expect(specs).toHaveLength(1);
    expect(specs[0].type).toBe('WeatherCard');
    expect(specs[0].props).toEqual({ city: 'SF', temperature: 72 });
  });

  it('validates an array of component specs', () => {
    const raw = JSON.stringify([
      { type: 'WeatherCard', props: { city: 'SF', temperature: 72 } },
      { type: 'AlertBox', props: { title: 'Hi', message: 'Hello' } }
    ]);
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(true);
    const { specs } = result as { ok: true; specs: any[] };
    expect(specs).toHaveLength(2);
    expect(specs[0].type).toBe('WeatherCard');
    expect(specs[1].type).toBe('AlertBox');
  });

  it('returns error for invalid JSON', () => {
    const result = validateSpec('{ not valid json }', definitions);
    expect(result.ok).toBe(false);
    expect(getError(result).type).toBe('invalid_json');
  });

  it('returns error for unknown component', () => {
    const raw = JSON.stringify({
      type: 'NonExistent',
      props: {}
    });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(false);
    const error = getError(result);
    expect(error.type).toBe('unknown_component');
    expect(error.componentType).toBe('NonExistent');
  });

  it('returns error for invalid props', () => {
    const raw = JSON.stringify({
      type: 'WeatherCard',
      props: { city: 'SF' } // missing temperature
    });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(false);
    const error = getError(result);
    expect(error.type).toBe('invalid_props');
    expect(error.issues).toBeDefined();
  });

  it('returns error for missing type field', () => {
    const raw = JSON.stringify({ props: { city: 'SF' } });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(false);
    expect(getError(result).type).toBe('invalid_json');
  });

  it('validates nested children', () => {
    const raw = JSON.stringify({
      type: 'AlertBox',
      props: { title: 'Parent', message: 'Hello' },
      children: [
        { type: 'WeatherCard', props: { city: 'SF', temperature: 72 } }
      ]
    });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(true);
    const { specs } = result as { ok: true; specs: any[] };
    expect(specs[0].children).toHaveLength(1);
    expect(specs[0].children[0].type).toBe('WeatherCard');
  });

  it('returns error for invalid children', () => {
    const raw = JSON.stringify({
      type: 'AlertBox',
      props: { title: 'Parent', message: 'Hello' },
      children: [{ type: 'NonExistent', props: {} }]
    });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(false);
    expect(getError(result).type).toBe('unknown_component');
  });

  it('handles missing props gracefully (empty object)', () => {
    // schema requires city and temperature, so this should fail
    const raw = JSON.stringify({ type: 'WeatherCard' });
    const result = validateSpec(raw, definitions);
    expect(result.ok).toBe(false);
    expect(getError(result).type).toBe('invalid_props');
  });
});
