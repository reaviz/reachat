import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  RefObject
} from 'react';
import { InputPluginItem, InputTrigger, ActiveTriggerState } from './types';
import { ContentEditableInputRef } from './ContentEditableInput';

interface UseTriggerManagerContentEditableProps<
  T extends InputPluginItem = InputPluginItem
> {
  triggers: InputTrigger<T>[];
  value: string;
  cursorPosition: number;
  onChange: (value: string, cursorPosition: number) => void;
  inputRef: RefObject<ContentEditableInputRef | null>;
}

interface UseTriggerManagerContentEditableResult<
  T extends InputPluginItem = InputPluginItem
> {
  activeTrigger: ActiveTriggerState | null;
  matchingItems: T[];
  isLoading: boolean;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
  handleInputChange: (newValue: string, newCursorPosition: number) => void;
  selectItem: (item: T) => void;
  closePopup: () => void;
  currentTriggerConfig: InputTrigger<T> | null;
}

function findActiveTrigger(
  value: string,
  cursorPosition: number,
  triggers: InputTrigger[]
): { trigger: string; query: string; startPosition: number } | null {
  const textBeforeCursor = value.substring(0, cursorPosition);

  for (const triggerConfig of triggers) {
    const triggerChar = triggerConfig.trigger;

    let lastTriggerPos = -1;
    for (let i = textBeforeCursor.length - 1; i >= 0; i--) {
      if (textBeforeCursor[i] === triggerChar) {
        if (i === 0 || /\s/.test(textBeforeCursor[i - 1])) {
          lastTriggerPos = i;
          break;
        }
      }
      if (/\s/.test(textBeforeCursor[i])) {
        break;
      }
    }

    if (lastTriggerPos !== -1) {
      const query = textBeforeCursor.substring(lastTriggerPos + 1);
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

function filterItems<T extends InputPluginItem>(
  items: T[],
  query: string,
  maxResults: number = 10
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

export function useTriggerManagerContentEditable<
  T extends InputPluginItem = InputPluginItem
>({
  triggers,
  value,
  cursorPosition,
  onChange,
  inputRef
}: UseTriggerManagerContentEditableProps<T>): UseTriggerManagerContentEditableResult<T> {
  const [activeTrigger, setActiveTrigger] = useState<ActiveTriggerState | null>(
    null
  );
  const [matchingItems, setMatchingItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Lock to prevent re-triggering immediately after selection
  const selectionLockRef = useRef(false);

  const currentTriggerConfig = useMemo(() => {
    if (!activeTrigger) return null;
    return (
      (triggers.find(
        t => t.trigger === activeTrigger.trigger
      ) as InputTrigger<T>) || null
    );
  }, [activeTrigger, triggers]);

  const prevTriggerRef = useRef<string | null>(null);
  const prevSearchKeyRef = useRef<string | null>(null);

  // Create a stable search key that only changes when we need to search
  const searchKey = activeTrigger
    ? `${activeTrigger.trigger}:${activeTrigger.query}:${activeTrigger.startPosition}`
    : null;

  useEffect(() => {
    if (!activeTrigger || !currentTriggerConfig) {
      setMatchingItems([]);
      prevTriggerRef.current = null;
      prevSearchKeyRef.current = null;
      return;
    }

    // Skip if search key hasn't changed (prevents re-searching on cursor position changes)
    if (searchKey === prevSearchKeyRef.current) {
      return;
    }
    prevSearchKeyRef.current = searchKey;

    const { query, trigger } = activeTrigger;
    const {
      items,
      onSearch,
      minQueryLength = 0,
      maxResults = 10
    } = currentTriggerConfig;

    if (prevTriggerRef.current !== trigger) {
      setHighlightedIndex(0);
      prevTriggerRef.current = trigger;
    }

    if (query.length < minQueryLength) {
      setMatchingItems((items?.slice(0, maxResults) as T[]) || []);
      return;
    }

    if (onSearch) {
      setIsLoading(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await onSearch(query);
          setMatchingItems(results.slice(0, maxResults) as T[]);
        } catch (error) {
          console.error('Error searching trigger items:', error);
          setMatchingItems([]);
        } finally {
          setIsLoading(false);
        }
      }, 150);
    } else {
      setMatchingItems(filterItems((items as T[]) || [], query, maxResults));
    }
  }, [searchKey, activeTrigger, currentTriggerConfig]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (newValue: string, newCursorPosition: number) => {
      // Skip if we just made a selection (prevents re-triggering)
      if (selectionLockRef.current) {
        return;
      }

      const trigger = findActiveTrigger(newValue, newCursorPosition, triggers);

      if (trigger && inputRef.current) {
        // Use native contenteditable cursor position - THE MAIN BENEFIT!
        const pixelPosition = inputRef.current.getCursorPixelPosition();

        if (pixelPosition) {
          // Only update if trigger, query, or startPosition changed
          // This prevents constant re-triggering on cursor position changes
          setActiveTrigger(prev => {
            if (
              prev &&
              prev.trigger === trigger.trigger &&
              prev.query === trigger.query &&
              prev.startPosition === trigger.startPosition
            ) {
              // Only update pixel position, don't trigger search effect
              return {
                ...prev,
                cursorPosition: pixelPosition
              };
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
    [triggers, inputRef]
  );

  const closePopup = useCallback(() => {
    setActiveTrigger(null);
    setMatchingItems([]);
    setHighlightedIndex(0);
  }, []);

  const selectItem = useCallback(
    (item: T) => {
      if (!activeTrigger || !currentTriggerConfig) return;

      // Lock to prevent re-triggering
      selectionLockRef.current = true;

      const { startPosition } = activeTrigger;

      let insertText = '';

      if (currentTriggerConfig.onSelect) {
        currentTriggerConfig.onSelect(item, (text: string) => {
          insertText = text;
        });
      }

      if (!insertText) {
        if ('value' in item && item.value) {
          insertText = item.value as string;
        } else {
          insertText = `${activeTrigger.trigger}${item.label}`;
        }
      }

      const beforeTrigger = value.substring(0, startPosition);
      const afterCursor = value.substring(cursorPosition);
      const newValue = beforeTrigger + insertText + ' ' + afterCursor;
      const newCursorPosition = startPosition + insertText.length + 1;

      // Close popup first to prevent flicker
      closePopup();
      onChange(newValue, newCursorPosition);

      // Set cursor position after value updates
      requestAnimationFrame(() => {
        inputRef.current?.setCursorPosition(newCursorPosition);
        inputRef.current?.focus();
        // Release lock after DOM updates
        requestAnimationFrame(() => {
          selectionLockRef.current = false;
        });
      });
    },
    [
      activeTrigger,
      currentTriggerConfig,
      value,
      cursorPosition,
      onChange,
      closePopup,
      inputRef
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): boolean => {
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
