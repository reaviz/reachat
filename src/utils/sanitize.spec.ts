import { describe, expect, it } from 'vitest';

import { sanitizeSVGCell } from './sanitize';

describe('sanitizeSVGCell', () => {
  it('should return plain text unchanged', () => {
    expect(sanitizeSVGCell('Hello World')).toBe('Hello World');
  });

  it('should trim whitespace', () => {
    expect(sanitizeSVGCell('  Hello World  ')).toBe('Hello World');
  });

  // Formula injection prevention
  it('should sanitize cells starting with =', () => {
    expect(sanitizeSVGCell('=1+2')).toBe('"\'=1+2"');
  });

  it('should sanitize cells starting with +', () => {
    expect(sanitizeSVGCell('+1234')).toBe('"\'+1234"');
  });

  it('should sanitize cells starting with -', () => {
    expect(sanitizeSVGCell('-500')).toBe('"\'-500"');
  });

  it('should sanitize cells starting with @', () => {
    expect(sanitizeSVGCell('@SUM(A1:A10)')).toBe('"\'@SUM(A1:A10)"');
  });

  // Quote handling
  it('should escape double quotes by doubling them', () => {
    expect(sanitizeSVGCell('Hello "World"')).toBe('"Hello ""World"""');
  });

  it('should handle single quotes without escaping', () => {
    expect(sanitizeSVGCell("Don't worry")).toBe("Don't worry");
  });

  // Special characters
  it('should quote cells containing newlines', () => {
    expect(sanitizeSVGCell('Hello\nWorld')).toBe('"Hello\nWorld"');
  });

  it('should quote cells containing carriage returns', () => {
    expect(sanitizeSVGCell('Hello\rWorld')).toBe('"Hello\rWorld"');
  });

  // Combined scenarios
  it('should handle formula with special characters', () => {
    expect(sanitizeSVGCell('=SUM(A1:A10);123')).toBe('"\'=SUM(A1:A10);123"');
  });

  it('should handle empty strings', () => {
    expect(sanitizeSVGCell('')).toBe('');
  });

  it('should handle whitespace-only strings', () => {
    expect(sanitizeSVGCell('   ')).toBe('');
  });
});
