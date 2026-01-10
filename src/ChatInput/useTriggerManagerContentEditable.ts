import React, { useCallback, RefObject, useRef } from 'react';
import { InputPluginItem, InputTrigger } from './types';
import { ContentEditableInputRef } from './ContentEditableInput';
import { useTriggerManagerCore } from './useTriggerManagerCore';

interface UseTriggerManagerContentEditableProps<
  T extends InputPluginItem = InputPluginItem
> {
  triggers: InputTrigger<T>[];
  value: string;
  cursorPosition: number;
  onChange: (value: string, cursorPosition: number) => void;
  inputRef: RefObject<ContentEditableInputRef | null>;
}

/**
 * Trigger manager for ContentEditable inputs
 * Wraps useTriggerManagerCore with ContentEditable-specific cursor position logic
 */
export function useTriggerManagerContentEditable<
  T extends InputPluginItem = InputPluginItem
>({
  triggers,
  value,
  cursorPosition,
  onChange,
  inputRef
}: UseTriggerManagerContentEditableProps<T>) {
  // Lock to prevent trigger re-detection while a selection is being inserted
  // This prevents race conditions where onChange triggers handleInputChange before cursor is positioned
  const selectionLockRef = useRef(false);
  // Track the operation ID to know when it's safe to unlock
  const currentOperationIdRef = useRef(0);

  const getCursorPixelPosition = useCallback(() => {
    return inputRef.current?.getCursorPixelPosition() || null;
  }, [inputRef]);

  const coreResult = useTriggerManagerCore({
    triggers,
    value,
    cursorPosition,
    onChange,
    getCursorPixelPosition
  });

  // Override handleInputChange to add selection lock check
  const handleInputChange = useCallback(
    (newValue: string, newCursorPosition: number) => {
      // Skip if we just made a selection
      if (selectionLockRef.current) {
        return;
      }
      coreResult.handleInputChange(newValue, newCursorPosition);
    },
    [coreResult]
  );

  // Override selectItem to use ContentEditable-specific cursor positioning
  const selectItem = useCallback(
    (item: T) => {
      if (!coreResult.activeTrigger || !coreResult.currentTriggerConfig) return;

      const operationId = ++currentOperationIdRef.current;

      // Set lock to prevent trigger re-detection
      selectionLockRef.current = true;

      const { startPosition } = coreResult.activeTrigger;
      let insertText = '';

      if (coreResult.currentTriggerConfig.onSelect) {
        coreResult.currentTriggerConfig.onSelect(item, (text: string) => {
          insertText = text;
        });
      }

      if (!insertText) {
        if ('value' in item && item.value) {
          insertText = item.value as string;
        } else {
          insertText = `${coreResult.activeTrigger.trigger}${item.label}`;
        }
      }

      // Replace spaces with non-breaking spaces to keep multi-word mentions as single units
      // This allows the parser to recognize "@Bob Wilson" as one complete mention
      insertText = insertText.replace(/ /g, '\u00A0');

      // Get fresh values from the input ref to avoid stale closure values
      const currentValue = inputRef.current?.getValue() || value;
      const currentCursorPosition =
        inputRef.current?.getCursorPosition() || cursorPosition;

      const beforeTrigger = currentValue.substring(0, startPosition);
      const afterCursor = currentValue.substring(currentCursorPosition);
      const newValue = beforeTrigger + insertText + ' ' + afterCursor;
      const newCursorPosition = startPosition + insertText.length + 1;

      coreResult.closePopup();

      // Update the input element with the new value and cursor position
      if (inputRef.current) {
        // Use onComplete to call onChange AFTER cursor is positioned
        inputRef.current.setValueWithCursor(newValue, newCursorPosition, () => {
          // Only proceed if this is still the current operation (not superseded)
          if (currentOperationIdRef.current !== operationId) {
            return;
          }

          // Call onChange with the cursor already in the correct position
          onChange(newValue, newCursorPosition);

          // Release lock after the browser's next paint to ensures all selection/input events have propagated
          requestAnimationFrame(() => {
            if (currentOperationIdRef.current !== operationId) {
              return;
            }

            selectionLockRef.current = false;

            // Re-check for triggers in case user typed during the lock period
            const currentValue = inputRef.current?.getValue() || '';
            const currentCursor = inputRef.current?.getCursorPosition() || 0;
            coreResult.handleInputChange(currentValue, currentCursor);
          });
        });
        inputRef.current.focus();
      }
    },
    [coreResult, value, cursorPosition, onChange, inputRef]
  );

  // Override handleKeyDown to use our overridden selectItem
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): boolean => {
      if (!coreResult.activeTrigger || coreResult.matchingItems.length === 0) {
        return false;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          coreResult.setHighlightedIndex(
            (prev: number) => (prev + 1) % coreResult.matchingItems.length
          );
          return true;

        case 'ArrowUp':
          e.preventDefault();
          coreResult.setHighlightedIndex(
            (prev: number) =>
              (prev - 1 + coreResult.matchingItems.length) %
              coreResult.matchingItems.length
          );
          return true;

        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (coreResult.matchingItems[coreResult.highlightedIndex]) {
            // Use OUR overridden selectItem, not the core one
            selectItem(coreResult.matchingItems[coreResult.highlightedIndex]);
          }
          return true;

        case 'Escape':
          e.preventDefault();
          coreResult.closePopup();
          return true;

        default:
          return false;
      }
    },
    [coreResult, selectItem]
  );

  return {
    ...coreResult,
    selectItem,
    handleInputChange,
    handleKeyDown
  };
}
