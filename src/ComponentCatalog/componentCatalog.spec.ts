import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { componentCatalog } from './componentCatalog';
import type { ComponentDefinitions } from './types';

const definitions: ComponentDefinitions = {
  TestCard: {
    description: 'A test card',
    props: z.object({ title: z.string() }),
    component: () => null
  }
};

describe('componentCatalog', () => {
  it('returns an object with the expected shape', () => {
    const catalog = componentCatalog(definitions);
    expect(catalog).toHaveProperty('remarkPlugin');
    expect(catalog).toHaveProperty('components');
    expect(catalog).toHaveProperty('systemPrompt');
    expect(catalog).toHaveProperty('definitions');
  });

  it('exposes a pre component override', () => {
    const catalog = componentCatalog(definitions);
    expect(catalog.components).toHaveProperty('pre');
    expect(typeof catalog.components.pre).toBe('function');
  });

  it('remarkPlugin is a function', () => {
    const catalog = componentCatalog(definitions);
    expect(typeof catalog.remarkPlugin).toBe('function');
  });

  it('systemPrompt returns a non-empty string', () => {
    const catalog = componentCatalog(definitions);
    const prompt = catalog.systemPrompt();
    expect(prompt).toContain('TestCard');
    expect(prompt).toContain('A test card');
    expect(prompt).toContain('```component');
  });

  it('systemPrompt uses custom language tag', () => {
    const catalog = componentCatalog(definitions, { language: 'ui' });
    const prompt = catalog.systemPrompt();
    expect(prompt).toContain('```ui');
    expect(prompt).not.toContain('```component');
  });

  it('systemPrompt returns empty string for empty definitions', () => {
    const catalog = componentCatalog({});
    expect(catalog.systemPrompt()).toBe('');
  });

  it('exposes the original definitions', () => {
    const catalog = componentCatalog(definitions);
    expect(catalog.definitions).toBe(definitions);
  });
});
