import { describe, it, expect } from 'vitest';
import { parseTriggers, segmentText } from './parseTriggers';

describe('parseTriggers', () => {
  const triggers = ['@', '/'];

  it('should find a single mention at start of text', () => {
    const result = parseTriggers('@john hello', 11, triggers);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      trigger: '@',
      value: 'john',
      start: 0,
      end: 5,
      fullText: '@john'
    });
  });

  it('should find a mention after whitespace', () => {
    const result = parseTriggers('hello @jane', 11, triggers);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      trigger: '@',
      value: 'jane',
      start: 6,
      end: 11,
      fullText: '@jane'
    });
  });

  it('should find multiple mentions', () => {
    const result = parseTriggers('@john and @jane', 15, triggers);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('john');
    expect(result[1].value).toBe('jane');
  });

  it('should find mixed triggers', () => {
    const result = parseTriggers('@john /help @jane', 17, triggers);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ trigger: '@', value: 'john' });
    expect(result[1]).toMatchObject({ trigger: '/', value: 'help' });
    expect(result[2]).toMatchObject({ trigger: '@', value: 'jane' });
  });

  it('should not find trigger when cursor is inside it', () => {
    const result = parseTriggers('@john', 3, triggers);
    expect(result).toHaveLength(0);
  });

  it('should not match trigger in middle of word', () => {
    const result = parseTriggers('test@john', 9, triggers);
    expect(result).toHaveLength(0);
  });

  it('should not include empty triggers', () => {
    const result = parseTriggers('@ hello', 7, triggers);
    expect(result).toHaveLength(0);
  });

  it('should handle trigger at end of text', () => {
    const result = parseTriggers('hello @john', 11, triggers);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('john');
  });

  it('should handle non-breaking spaces as part of trigger value', () => {
    const result = parseTriggers('@john\u00A0doe test', 15, triggers);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('john\u00A0doe');
  });

  it('should return empty array for text with no triggers', () => {
    const result = parseTriggers('hello world', 11, triggers);
    expect(result).toHaveLength(0);
  });

  it('should sort results by start position', () => {
    const result = parseTriggers('/cmd @user #tag', 15, ['/', '@', '#']);
    expect(result[0].start).toBeLessThan(result[1].start);
    expect(result[1].start).toBeLessThan(result[2].start);
  });
});

describe('segmentText', () => {
  const triggers = ['@', '/'];

  it('should segment text with a single trigger', () => {
    const result = segmentText('hello @john world', 17, triggers);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ type: 'text', content: 'hello ' });
    expect(result[1]).toMatchObject({ type: 'trigger', content: '@john' });
    expect(result[2]).toMatchObject({ type: 'text', content: ' world' });
  });

  it('should handle trigger at start', () => {
    const result = segmentText('@john hello', 11, triggers);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ type: 'trigger', content: '@john' });
    expect(result[1]).toMatchObject({ type: 'text', content: ' hello' });
  });

  it('should handle trigger at end', () => {
    const result = segmentText('hello @john', 11, triggers);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ type: 'text', content: 'hello ' });
    expect(result[1]).toMatchObject({ type: 'trigger', content: '@john' });
  });

  it('should handle text with no triggers', () => {
    const result = segmentText('hello world', 11, triggers);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'text',
      content: 'hello world',
      start: 0,
      end: 11
    });
  });

  it('should handle multiple consecutive triggers', () => {
    const result = segmentText('@john @jane', 11, triggers);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ type: 'trigger', content: '@john' });
    expect(result[1]).toMatchObject({ type: 'text', content: ' ' });
    expect(result[2]).toMatchObject({ type: 'trigger', content: '@jane' });
  });

  it('should include trigger metadata in trigger segments', () => {
    const result = segmentText('hi @john', 8, triggers);
    const triggerSegment = result.find(s => s.type === 'trigger');
    expect(triggerSegment?.trigger).toBeDefined();
    expect(triggerSegment?.trigger?.value).toBe('john');
  });

  it('should not segment trigger being typed (cursor inside)', () => {
    const result = segmentText('hello @jo', 8, triggers);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ type: 'text', content: 'hello @jo' });
  });

  it('should handle empty text', () => {
    const result = segmentText('', 0, triggers);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'text',
      content: '',
      start: 0,
      end: 0
    });
  });
});
