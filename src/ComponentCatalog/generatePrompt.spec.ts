import { describe, it, expect } from 'vitest';
import { generatePrompt } from './generatePrompt';
import type { ComponentDefinitions } from './types';

describe('generatePrompt', () => {
  it('returns empty string for empty definitions', () => {
    expect(generatePrompt({})).toBe('');
  });

  it('generates prompt with component descriptions', () => {
    const defs: ComponentDefinitions = {
      WeatherCard: {
        description: 'Shows weather for a city',
        props: {
          _def: {
            typeName: 'ZodObject',
            shape: {
              city: { _def: { typeName: 'ZodString' } },
              temperature: { _def: { typeName: 'ZodNumber' } }
            }
          },
          parse: (v: unknown) => v,
          safeParse: (v: unknown) => ({ success: true, data: v })
        },
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('WeatherCard');
    expect(prompt).toContain('Shows weather for a city');
    expect(prompt).toContain('city');
    expect(prompt).toContain('string');
    expect(prompt).toContain('temperature');
    expect(prompt).toContain('number');
    expect(prompt).toContain('```component');
  });

  it('uses custom language tag', () => {
    const defs: ComponentDefinitions = {
      Test: {
        description: 'A test component',
        props: {
          _def: { typeName: 'ZodObject', shape: {} },
          parse: (v: unknown) => v,
          safeParse: (v: unknown) => ({ success: true, data: v })
        },
        component: () => null
      }
    };

    const prompt = generatePrompt(defs, 'ui');
    expect(prompt).toContain('```ui');
    expect(prompt).not.toContain('```component');
  });

  it('describes enum fields', () => {
    const defs: ComponentDefinitions = {
      Card: {
        description: 'A card',
        props: {
          _def: {
            typeName: 'ZodObject',
            shape: {
              variant: {
                _def: {
                  typeName: 'ZodEnum',
                  values: ['primary', 'secondary']
                }
              }
            }
          },
          parse: (v: unknown) => v,
          safeParse: (v: unknown) => ({ success: true, data: v })
        },
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('"primary"');
    expect(prompt).toContain('"secondary"');
  });
});
