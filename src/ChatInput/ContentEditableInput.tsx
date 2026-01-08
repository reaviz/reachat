import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
  useImperativeHandle,
  useContext
} from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { chatTheme } from '@/theme';
import { segmentText } from './utils/parseTriggers';

export interface ContentEditableInputRef {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  setValueWithCursor: (
    value: string,
    cursorPosition: number,
    onComplete?: () => void
  ) => void;
  insertTextAtCursor: (text: string) => void;
  getCursorPosition: () => number;
  setCursorPosition: (position: number) => void;
  getElement: () => HTMLDivElement | null;
  getCursorPixelPosition: () => { top: number; left: number } | null;
}

interface ContentEditableInputProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (position: number) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  /**
   * Trigger characters to highlight as tags (e.g., ['@', '/'])
   */
  triggers?: string[];
  /**
   * Custom className for trigger tags
   */
  triggerTagClassName?: string;
}

export const ContentEditableInput = forwardRef<
  ContentEditableInputRef,
  ContentEditableInputProps
>(
  (
    {
      value,
      onChange,
      onCursorChange,
      onKeyDown,
      placeholder = 'Type a message...',
      disabled = false,
      autoFocus = false,
      className,
      minHeight = 24,
      maxHeight = 200,
      triggers = [],
      triggerTagClassName
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isComposing = useRef(false);
    const lastRenderedValue = useRef(value);
    // Flag to prevent event loops during programmatic DOM updates
    const isProgrammaticUpdate = useRef(false);

    const getTextContent = useCallback((): string => {
      if (!editorRef.current) return '';
      return editorRef.current.textContent || '';
    }, []);

    // Get theme from context
    const { theme } = useContext(ChatContext);
    const tagTheme = theme?.input?.tag || chatTheme.input.tag;

    // Render HTML with trigger tags highlighted
    const renderContent = useCallback(
      (text: string, cursorPos: number): string => {
        if (!triggers.length) {
          return text;
        }

        const segments = segmentText(text, cursorPos, triggers);
        const htmlParts: string[] = [];

        for (const segment of segments) {
          if (segment.type === 'trigger' && segment.trigger) {
            // Render as a tag-like span
            const trigger = segment.trigger;
            // Determine tag style based on trigger type
            const isMention = trigger.trigger === '@';
            const isCommand = trigger.trigger === '/';
            const tagStyleClass = isMention
              ? tagTheme.mention
              : isCommand
                ? tagTheme.command
                : tagTheme.base;

            const tagClass = cn(
              tagTheme.base,
              tagStyleClass,
              triggerTagClassName
            );
            // Escape the content for HTML
            const escapedContent = segment.content
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            htmlParts.push(
              `<span class="${tagClass}" data-trigger="${trigger.trigger}" data-value="${trigger.value}">${escapedContent}</span>`
            );
          } else {
            // Escape HTML for text segments
            const escaped = segment.content
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            htmlParts.push(escaped);
          }
        }

        return htmlParts.join('');
      },
      [triggers, triggerTagClassName, tagTheme]
    );

    const getCursorPosition = useCallback((): number => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !editorRef.current) return 0;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);

      // Get text content length (ignoring HTML tags)
      return (
        editorRef.current.textContent?.substring(
          0,
          preCaretRange.toString().length
        ).length || 0
      );
    }, []);

    const setCursorPosition = useCallback((position: number) => {
      const editor = editorRef.current;
      if (!editor) return;

      const selection = window.getSelection();
      if (!selection) return;

      // Get all text nodes in order
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null
      );

      let currentPos = 0;
      let targetNode: Node | null = null;
      let targetOffset = 0;

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const nodeLength = node.textContent?.length || 0;

        if (currentPos + nodeLength >= position) {
          targetNode = node;
          targetOffset = position - currentPos;
          break;
        }

        currentPos += nodeLength;
      }

      if (targetNode) {
        try {
          const range = document.createRange();
          range.setStart(
            targetNode,
            Math.min(targetOffset, targetNode.textContent?.length || 0)
          );
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch {
          // Fallback: move to end
          const range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        // Move to end
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, []);

    const getCursorPixelPosition = useCallback((): {
      top: number;
      left: number;
    } | null => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !editorRef.current) return null;

      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);

      // Insert a temporary span to get accurate position
      const span = document.createElement('span');
      span.textContent = '\u200B'; // Zero-width space
      range.insertNode(span);

      const rect = span.getBoundingClientRect();
      const containerRect = editorRef.current.getBoundingClientRect();

      // Clean up
      const parent = span.parentNode;
      parent?.removeChild(span);
      // Normalize to merge adjacent text nodes
      parent?.normalize();

      // Restore selection
      selection.removeAllRanges();
      selection.addRange(range);

      return {
        top: rect.top - containerRect.top + editorRef.current.scrollTop,
        left: rect.left - containerRect.left + editorRef.current.scrollLeft
      };
    }, []);

    const insertTextAtCursor = useCallback(
      (text: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);

        // Move cursor after inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Trigger change
        const newValue = getTextContent();
        onChange(newValue);
        onCursorChange?.(getCursorPosition());
      },
      [onChange, onCursorChange, getTextContent, getCursorPosition]
    );

    const updateContent = useCallback(
      (newValue: string, cursorPos?: number, onComplete?: () => void) => {
        const editor = editorRef.current;
        if (!editor) return;

        const actualCursorPos = cursorPos ?? getCursorPosition();

        // Mark that we're doing a programmatic update
        isProgrammaticUpdate.current = true;

        if (triggers.length > 0) {
          const html = renderContent(newValue, actualCursorPos);
          editor.innerHTML = html;
        } else {
          editor.textContent = newValue;
        }

        lastRenderedValue.current = newValue;

        // Restore cursor position if provided
        if (cursorPos !== undefined) {
          // Use setTimeout to defer to after DOM updates
          setTimeout(() => {
            setCursorPosition(cursorPos);

            // Call onComplete after cursor is positioned and selection has updated
            // Need extra delay to ensure selectionchange event has fired
            if (onComplete) {
              setTimeout(() => {
                onComplete();
                // Reset flag after callback completes
                isProgrammaticUpdate.current = false;
              }, 50);
            } else {
              // Reset flag if no callback
              isProgrammaticUpdate.current = false;
            }
          }, 0);
        } else {
          // Reset flag after a microtask if no cursor positioning needed
          Promise.resolve().then(() => {
            isProgrammaticUpdate.current = false;
          });
          if (onComplete) {
            onComplete();
          }
        }
      },
      [getCursorPosition, setCursorPosition, triggers, renderContent]
    );

    const setValue = useCallback(
      (newValue: string) => {
        const hadFocus = document.activeElement === editorRef.current;
        const cursorPos = hadFocus ? getCursorPosition() : newValue.length;
        updateContent(newValue, Math.min(cursorPos, newValue.length));
      },
      [getCursorPosition, updateContent]
    );

    // Sync value from props when it changes externally
    useEffect(() => {
      if (isComposing.current) return;

      // Skip if we're doing a programmatic update
      if (isProgrammaticUpdate.current) return;

      const currentValue = getTextContent();
      if (currentValue !== value && lastRenderedValue.current !== value) {
        setValue(value);
      }
    }, [value, getTextContent, setValue]);

    // Auto focus
    useEffect(() => {
      if (autoFocus && editorRef.current) {
        editorRef.current.focus();
      }
    }, [autoFocus]);

    const setValueWithCursor = useCallback(
      (newValue: string, cursorPos: number, onComplete?: () => void) => {
        updateContent(newValue, cursorPos, onComplete);
      },
      [updateContent]
    );

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
      blur: () => editorRef.current?.blur(),
      getValue: getTextContent,
      setValue,
      setValueWithCursor,
      insertTextAtCursor,
      getCursorPosition,
      setCursorPosition,
      getElement: () => editorRef.current,
      getCursorPixelPosition
    }));

    const handleInput = useCallback(
      (e: FormEvent<HTMLDivElement>) => {
        if (isComposing.current) return;

        // Ignore input events from programmatic updates
        if (isProgrammaticUpdate.current) return;

        const newValue = e.currentTarget.textContent || '';

        // Don't call updateContent here - it interferes with cursor positioning during typing
        // Let the value sync back through the useEffect instead
        onChange(newValue);
        onCursorChange?.(getCursorPosition());
      },
      [onChange, onCursorChange, getCursorPosition]
    );

    const handleCompositionStart = useCallback(() => {
      isComposing.current = true;
    }, []);

    const handleCompositionEnd = useCallback(
      (e: FormEvent<HTMLDivElement>) => {
        isComposing.current = false;
        handleInput(e);
      },
      [handleInput]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
      },
      [onKeyDown]
    );

    const handlePaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');

      const selection = window.getSelection();
      const editor = editorRef.current;

      if (!selection || selection.rangeCount === 0 || !editor) {
        return;
      }

      const range = selection.getRangeAt(0);

      // Ensure the paste occurs within the editor
      if (!editor.contains(range.commonAncestorContainer)) {
        return;
      }

      // Replace current selection with the pasted text
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      // Move the caret to the end of the inserted text
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
    }, []);

    const handleSelectionChange = useCallback(() => {
      // Ignore selection changes from programmatic updates
      if (isProgrammaticUpdate.current) return;

      if (document.activeElement === editorRef.current && onCursorChange) {
        onCursorChange(getCursorPosition());
      }
    }, [onCursorChange, getCursorPosition]);

    useEffect(() => {
      document.addEventListener('selectionchange', handleSelectionChange);
      return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
      };
    }, [handleSelectionChange]);

    const isEmpty = !value;

    return (
      <div className="relative w-full">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            'outline-none whitespace-pre-wrap break-words overflow-y-auto w-full',
            'text-inherit font-inherit',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          style={{
            minHeight,
            maxHeight
          }}
          role="textbox"
          aria-placeholder={placeholder}
          aria-disabled={disabled}
          aria-multiline="true"
          tabIndex={disabled ? -1 : 0}
          suppressContentEditableWarning
        />
        {isEmpty && (
          <div
            className={cn(
              'absolute inset-0 pointer-events-none text-gray-400 dark:text-gray-500',
              'whitespace-pre-wrap break-words',
              className
            )}
            aria-hidden="true"
          >
            {placeholder}
          </div>
        )}
      </div>
    );
  }
);
