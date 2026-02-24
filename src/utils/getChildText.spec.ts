import { describe, it, expect } from 'vitest';
import React from 'react';
import { getChildText } from './getChildText';

describe('getChildText', () => {
  it('returns empty string for null', () => {
    expect(getChildText(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(getChildText(undefined)).toBe('');
  });

  it('returns the string as-is', () => {
    expect(getChildText('hello world')).toBe('hello world');
  });

  it('converts numbers to strings', () => {
    expect(getChildText(42)).toBe('42');
  });

  it('concatenates array children', () => {
    expect(getChildText(['hello', ' ', 'world'])).toBe('hello world');
  });

  it('handles nested arrays', () => {
    expect(getChildText([['a', 'b'], 'c'])).toBe('abc');
  });

  it('extracts text from React elements', () => {
    const el = React.createElement('span', null, 'inner text');
    expect(getChildText(el)).toBe('inner text');
  });

  it('extracts text from deeply nested elements', () => {
    const inner = React.createElement('span', null, 'deep');
    const outer = React.createElement('div', null, inner);
    expect(getChildText(outer)).toBe('deep');
  });

  it('returns empty string for boolean children', () => {
    expect(getChildText(true as any)).toBe('');
    expect(getChildText(false as any)).toBe('');
  });

  it('handles mixed children in arrays', () => {
    const el = React.createElement('span', null, 'text');
    expect(getChildText(['prefix-', el, '-suffix'])).toBe('prefix-text-suffix');
  });

  it('returns empty string for empty array', () => {
    expect(getChildText([])).toBe('');
  });
});
