import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  type KeyboardEvent
} from 'react';
import { InputPluginItem, InputTrigger, ActiveTriggerState } from './types';

interface UseTriggerManagerCoreProps<
  T extends InputPluginItem = InputPluginItem
> {
  triggers: InputTrigger<T>[];
  value: string;
  cursorPosition: number;
  onChange: (value: string, cursorPosition: number) => void;
  getCursorPixelPosition: () => { top: number; left: number } | null;
}

interface UseTriggerManagerCoreResult<
  T extends InputPluginItem = InputPluginItem
> {
  activeTrigger: ActiveTriggerState | null;
  matchingItems: T[];
  isLoading: boolean;
  highlightedIndex: number;
  setHighlightedIndex: (index: number | ((prev: number) => number)) => void;
  handleKeyDown: (e: KeyboardEvent) => boolean;
  handleInputChange: (newValue: string, newCursorPosition: number) => void;
  selectItem: (item: T) => void;
  closePopup: () => void;
  currentTriggerConfig: InputTrigger<T> | null;
}

const SEARCH_DEBOUNCE_MS = 150;
const DEFAULT_MAX_RESULTS = 10;
const DEFAULT_MIN_QUERY_LENGTH = 0;

/**
 * Find if there's an active trigger at the current cursor position
 */
export function findActiveTrigger(
  value: string,
  cursorPosition: number,
  triggers: InputTrigger[]
): { trigger: string; query: string; startPosition: number } | null {
  const textBeforeCursor = value.substring(0, cursorPosition);

  for (const triggerConfig of triggers) {
    const triggerChar = triggerConfig.trigger;
    let lastTriggerPos = -1;

    // Find the last occurrence of this trigger before cursor
    for (let i = textBeforeCursor.length - 1; i >= 0; i--) {
      if (textBeforeCursor[i] === triggerChar) {
        // Valid trigger position (start of input or preceded by whitespace)
        if (i === 0 || /\s/.test(textBeforeCursor[i - 1])) {
          lastTriggerPos = i;
          break;
        }
      }
      // Stop if we hit whitespace (trigger must be contiguous)
      if (/\s/.test(textBeforeCursor[i])) {
        break;
      }
    }

    if (lastTriggerPos !== -1) {
      const query = textBeforeCursor.substring(lastTriggerPos + 1);
      // Ensure query doesn't contain whitespace
      if (!/\s/.test(query)) {
        return {
          trigger: triggerChar,
          query,
          startPosition: lastTriggerPos
        };
      }
    }
  }

  return null;
}

/**
 * Filter items based on query
 */
export function filterItems<T extends InputPluginItem>(
  items: T[],
  query: string,
  maxResults: number = DEFAULT_MAX_RESULTS
): T[] {
  if (!query) {
    return items.slice(0, maxResults);
  }

  const lowerQuery = query.toLowerCase();
  return items
    .filter(
      item =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, maxResults);
}

/**
 * Core trigger manager logic - works with any input type
 * Caller must provide getCursorPixelPosition function
 */
export function useTriggerManagerCore<
  T extends InputPluginItem = InputPluginItem
>({
  triggers,
  value,
  cursorPosition,
  onChange,
  getCursorPixelPosition
}: UseTriggerManagerCoreProps<T>): UseTriggerManagerCoreResult<T> {
  const [activeTrigger, setActiveTrigger] = useState<ActiveTriggerState | null>(
    null
  );
  const [matchingItems, setMatchingItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionLockRef = useRef(false);
  const prevTriggerRef = useRef<string | null>(null);
  const prevSearchKeyRef = useRef<string | null>(null);
  const prevActiveTriggerKeyRef = useRef<string | null>(null);

  const currentTriggerConfig = useMemo(() => {
    if (!activeTrigger) return null;
    return (
      (triggers.find(
        t => t.trigger === activeTrigger.trigger
      ) as InputTrigger<T>) || null
    );
  }, [activeTrigger, triggers]);

  // Create a stable search key that only changes when we need to search
  const searchKey = activeTrigger
    ? `${activeTrigger.trigger}:${activeTrigger.query}:${activeTrigger.startPosition}`
    : null;

  // Reset highlighted index to 0 whenever popup opens (new trigger detected)
  useEffect(() => {
    if (activeTrigger) {
      const currentKey = `${activeTrigger.trigger}:${activeTrigger.query}:${activeTrigger.startPosition}`;
      // Always reset to 0 when we detect a new trigger (popup opens)
      if (prevActiveTriggerKeyRef.current !== currentKey) {
        setHighlightedIndex(0);
        prevActiveTriggerKeyRef.current = currentKey;
      }
    } else {
      prevActiveTriggerKeyRef.current = null;
    }
  }, [activeTrigger]);

  // Update matching items when trigger or query changes
  useEffect(() => {
    if (!activeTrigger || !currentTriggerConfig) {
      setMatchingItems([]);
      prevTriggerRef.current = null;
      prevSearchKeyRef.current = null;
      return;
    }

    // Skip if search key hasn't changed
    if (searchKey === prevSearchKeyRef.current) {
      return;
    }
    prevSearchKeyRef.current = searchKey;

    const { query, trigger } = activeTrigger;
    const {
      items,
      onSearch,
      minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
      maxResults = DEFAULT_MAX_RESULTS
    } = currentTriggerConfig;

    // Reset highlighted index when trigger character changes or when query changes
    if (prevTriggerRef.current !== trigger) {
      setHighlightedIndex(0);
      prevTriggerRef.current = trigger;
    } else {
      // Also reset to 0 when query changes (new search results)
      setHighlightedIndex(0);
    }

    // Check minimum query length
    if (query.length < minQueryLength) {
      setMatchingItems((items?.slice(0, maxResults) as T[]) || []);
      setHighlightedIndex(0);
      return;
    }

    // Async search
    if (onSearch) {
      setIsLoading(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await onSearch(query);
          setMatchingItems(results.slice(0, maxResults) as T[]);
          setHighlightedIndex(0);
        } catch (error) {
          console.error('Error searching trigger items:', error);
          setMatchingItems([]);
        } finally {
          setIsLoading(false);
        }
      }, SEARCH_DEBOUNCE_MS);
    } else {
      // Local filter
      const filtered = filterItems((items as T[]) || [], query, maxResults);
      setMatchingItems(filtered);
      setHighlightedIndex(0);
    }
  }, [searchKey, activeTrigger, currentTriggerConfig]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (newValue: string, newCursorPosition: number) => {
      // Skip if we just made a selection
      if (selectionLockRef.current) {
        return;
      }

      const trigger = findActiveTrigger(newValue, newCursorPosition, triggers);

      if (trigger) {
        const pixelPosition = getCursorPixelPosition();

        if (pixelPosition) {
          setActiveTrigger(prev => {
            // Only update pixel position if other properties unchanged
            if (
              prev &&
              prev.trigger === trigger.trigger &&
              prev.query === trigger.query &&
              prev.startPosition === trigger.startPosition
            ) {
              return { ...prev, cursorPosition: pixelPosition };
            }
            // Trigger or query changed, update everything
            return {
              trigger: trigger.trigger,
              query: trigger.query,
              startPosition: trigger.startPosition,
              cursorPosition: pixelPosition
            };
          });
        }
      } else {
        setActiveTrigger(null);
      }
    },
    [triggers, getCursorPixelPosition]
  );

  const closePopup = useCallback(() => {
    setActiveTrigger(null);
    setMatchingItems([]);
    setHighlightedIndex(0);
  }, []);

  const selectItem = useCallback(
    (item: T) => {
      if (!activeTrigger || !currentTriggerConfig) return;

      selectionLockRef.current = true;

      const { startPosition } = activeTrigger;
      let insertText = '';

      // Call custom onSelect if provided
      if (currentTriggerConfig.onSelect) {
        currentTriggerConfig.onSelect(item, (text: string) => {
          insertText = text;
        });
      }

      // Default formatting if no custom insert text
      if (!insertText) {
        if ('value' in item && item.value) {
          insertText = item.value as string;
        } else {
          insertText = `${activeTrigger.trigger}${item.label}`;
        }
      }

      // Calculate new value
      const beforeTrigger = value.substring(0, startPosition);
      const afterCursor = value.substring(cursorPosition);
      const newValue = beforeTrigger + insertText + ' ' + afterCursor;
      const newCursorPosition = startPosition + insertText.length + 1;

      closePopup();
      onChange(newValue, newCursorPosition);

      // Release lock after DOM updates
      requestAnimationFrame(() => {
        selectionLockRef.current = false;
      });
    },
    [
      activeTrigger,
      currentTriggerConfig,
      value,
      cursorPosition,
      onChange,
      closePopup
    ]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): boolean => {
      if (!activeTrigger || matchingItems.length === 0) {
        return false;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => (prev + 1) % matchingItems.length);
          return true;

        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(
            prev => (prev - 1 + matchingItems.length) % matchingItems.length
          );
          return true;

        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (matchingItems[highlightedIndex]) {
            selectItem(matchingItems[highlightedIndex]);
          }
          return true;

        case 'Escape':
          e.preventDefault();
          closePopup();
          return true;

        default:
          return false;
      }
    },
    [activeTrigger, matchingItems, highlightedIndex, selectItem, closePopup]
  );

  return {
    activeTrigger,
    matchingItems,
    isLoading,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    handleInputChange,
    selectItem,
    closePopup,
    currentTriggerConfig
  };
}
