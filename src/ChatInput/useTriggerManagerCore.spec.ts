import { describe, it, expect } from 'vitest';
import { findActiveTrigger, filterItems } from './useTriggerManagerCore';
import { InputPluginItem, InputTrigger } from './types';

describe('useTriggerManagerCore', () => {
  describe('findActiveTrigger', () => {
    const triggers: InputTrigger[] = [
      { trigger: '@', items: [] },
      { trigger: '/', items: [] },
      { trigger: '#', items: [] }
    ];

    it('should find trigger at start of text', () => {
      const result = findActiveTrigger('@john', 5, triggers);
      expect(result).toEqual({
        trigger: '@',
        query: 'john',
        startPosition: 0
      });
    });

    it('should find trigger after whitespace', () => {
      const result = findActiveTrigger('Hello @john', 11, triggers);
      expect(result).toEqual({
        trigger: '@',
        query: 'john',
        startPosition: 6
      });
    });

    it('should return null if trigger not at valid position', () => {
      const result = findActiveTrigger('test@john', 9, triggers);
      expect(result).toBeNull();
    });

    it('should return null if query contains whitespace', () => {
      const result = findActiveTrigger('@john doe', 9, triggers);
      expect(result).toBeNull();
    });

    it('should find most recent trigger before cursor', () => {
      const result = findActiveTrigger('@john @jane', 11, triggers);
      expect(result).toEqual({
        trigger: '@',
        query: 'jane',
        startPosition: 6
      });
    });

    it('should work with different trigger characters', () => {
      const result = findActiveTrigger('Use /command here', 12, triggers);
      expect(result).toEqual({
        trigger: '/',
        query: 'command',
        startPosition: 4
      });
    });

    it('should return null when cursor before trigger', () => {
      const result = findActiveTrigger('Hello @john', 3, triggers);
      expect(result).toBeNull();
    });

    it('should handle empty query', () => {
      const result = findActiveTrigger('Hello @', 7, triggers);
      expect(result).toEqual({
        trigger: '@',
        query: '',
        startPosition: 6
      });
    });
  });

  describe('filterItems', () => {
    const items: InputPluginItem[] = [
      { id: '1', label: 'John Doe', description: 'Engineer' },
      { id: '2', label: 'Jane Smith', description: 'Designer' },
      { id: '3', label: 'Bob Wilson', description: 'Product Manager' },
      { id: '4', label: 'Alice Brown', description: 'Marketing' }
    ];

    it('should return all items when query is empty', () => {
      const result = filterItems(items, '');
      expect(result).toEqual(items);
    });

    it('should filter by label (case insensitive)', () => {
      const result = filterItems(items, 'john');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter by description', () => {
      const result = filterItems(items, 'designer');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should respect maxResults parameter', () => {
      const result = filterItems(items, '', 2);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches', () => {
      const result = filterItems(items, 'xyz123');
      expect(result).toHaveLength(0);
    });

    it('should match partial strings', () => {
      const result = filterItems(items, 'o');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(item => item.label.toLowerCase().includes('o'))).toBe(
        true
      );
    });
  });
});
