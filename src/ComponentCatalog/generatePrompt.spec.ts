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

  it('describes optional fields', () => {
    const defs: ComponentDefinitions = {
      Card: {
        description: 'A card',
        props: z.object({
          title: z.string(),
          subtitle: z.string().optional()
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('title: string');
    expect(prompt).toContain('subtitle: string?');
  });

  it('describes nested objects', () => {
    const defs: ComponentDefinitions = {
      Panel: {
        description: 'A panel',
        props: z.object({
          config: z.object({
            color: z.string()
          })
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('config');
    expect(prompt).toContain('color');
  });

  it('describes array fields', () => {
    const defs: ComponentDefinitions = {
      List: {
        description: 'A list',
        props: z.object({
          items: z.array(z.string())
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('items: string[]');
  });

  it('describes nullable fields', () => {
    const defs: ComponentDefinitions = {
      Card: {
        description: 'A card',
        props: z.object({
          label: z.string().nullable()
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('label: string | null');
  });

  it('includes field descriptions', () => {
    const defs: ComponentDefinitions = {
      Card: {
        description: 'A card',
        props: z.object({
          city: z.string().describe('City name')
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('// City name');
  });

  it('describes boolean fields', () => {
    const defs: ComponentDefinitions = {
      Toggle: {
        description: 'A toggle',
        props: z.object({
          enabled: z.boolean()
        }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('enabled: boolean');
  });

  it('handles multiple components', () => {
    const defs: ComponentDefinitions = {
      Alpha: {
        description: 'First component',
        props: z.object({ a: z.string() }),
        component: () => null
      },
      Beta: {
        description: 'Second component',
        props: z.object({ b: z.number() }),
        component: () => null
      }
    };

    const prompt = generatePrompt(defs);
    expect(prompt).toContain('Alpha');
    expect(prompt).toContain('Beta');
    expect(prompt).toContain('First component');
    expect(prompt).toContain('Second component');
  });
});
