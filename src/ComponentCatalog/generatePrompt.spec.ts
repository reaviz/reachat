import { describe, it, expect } from 'vitest';
import { z } from 'zod';
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
        props: z.object({
          city: z.string(),
          temperature: z.number()
        }),
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
        props: z.object({}),
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
        props: z.object({
          variant: z.enum(['primary', 'secondary'])
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('"primary"');
    expect(prompt).toContain('"secondary"');
  });
});
