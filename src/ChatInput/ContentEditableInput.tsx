import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
  useImperativeHandle,
  useMemo,
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
    const isInternalChange = useRef(false);
    const lastKnownValue = useRef(value);
    const isRenderingRef = useRef(false);

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
        isInternalChange.current = true;
        lastKnownValue.current = newValue;
        onChange(newValue);
        onCursorChange?.(getCursorPosition());
      },
      [onChange, onCursorChange, getTextContent, getCursorPosition]
    );

    const setValue = useCallback(
      (newValue: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const hadFocus = document.activeElement === editor;
        const cursorPos = hadFocus ? getCursorPosition() : 0;

        isRenderingRef.current = true;

        if (triggers.length > 0) {
          // Render with trigger tags
          const html = renderContent(newValue, cursorPos);
          editor.innerHTML = html;
        } else {
          // Use textContent to avoid XSS and keep it plain text
          editor.textContent = newValue;
        }

        lastKnownValue.current = newValue;

        if (hadFocus) {
          // Try to restore cursor position
          const newPos = Math.min(cursorPos, newValue.length);
          requestAnimationFrame(() => {
            setCursorPosition(newPos);
            isRenderingRef.current = false;
          });
        } else {
          isRenderingRef.current = false;
        }
      },
      [getCursorPosition, setCursorPosition, triggers, renderContent]
    );

    // Sync value from props when it changes externally
    useEffect(() => {
      if (isInternalChange.current || isRenderingRef.current) {
        isInternalChange.current = false;
        return;
      }

      const currentValue = getTextContent();
      if (currentValue !== value) {
        setValue(value);
      }
    }, [value, getTextContent, setValue]);

    // Re-render when cursor position changes (to update which triggers are highlighted)
    useEffect(() => {
      if (
        triggers.length > 0 &&
        !isInternalChange.current &&
        !isRenderingRef.current
      ) {
        const currentValue = getTextContent();
        if (currentValue === value) {
          const cursorPos = getCursorPosition();
          const html = renderContent(value, cursorPos);
          const editor = editorRef.current;
          if (editor && editor.innerHTML !== html) {
            const hadFocus = document.activeElement === editor;
            const savedCursorPos = cursorPos;

            isRenderingRef.current = true;
            editor.innerHTML = html;

            if (hadFocus) {
              requestAnimationFrame(() => {
                setCursorPosition(savedCursorPos);
                isRenderingRef.current = false;
              });
            } else {
              isRenderingRef.current = false;
            }
          }
        }
      }
    }, [
      value,
      triggers,
      getTextContent,
      getCursorPosition,
      renderContent,
      setCursorPosition
    ]);

    // Auto focus
    useEffect(() => {
      if (autoFocus && editorRef.current) {
        editorRef.current.focus();
      }
    }, [autoFocus]);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
      blur: () => editorRef.current?.blur(),
      getValue: getTextContent,
      setValue,
      insertTextAtCursor,
      getCursorPosition,
      setCursorPosition,
      getElement: () => editorRef.current,
      getCursorPixelPosition
    }));

    const handleInput = useCallback(
      (e: FormEvent<HTMLDivElement>) => {
        const newValue = e.currentTarget.textContent || '';
        isInternalChange.current = true;
        lastKnownValue.current = newValue;

        // Re-render with trigger tags if needed
        if (triggers.length > 0 && !isRenderingRef.current) {
          const cursorPos = getCursorPosition();
          const html = renderContent(newValue, cursorPos);
          const editor = editorRef.current;
          if (editor && editor.innerHTML !== html) {
            const savedCursorPos = cursorPos;
            isRenderingRef.current = true;
            editor.innerHTML = html;
            requestAnimationFrame(() => {
              setCursorPosition(savedCursorPos);
              isRenderingRef.current = false;
            });
          }
        }

        onChange(newValue);
        onCursorChange?.(getCursorPosition());
      },
      [
        onChange,
        onCursorChange,
        getCursorPosition,
        triggers,
        renderContent,
        setCursorPosition
      ]
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
      // Use insertText to maintain undo stack
      document.execCommand('insertText', false, text);
    }, []);

    const handleSelectionChange = useCallback(() => {
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
              'absolute top-0 left-0 pointer-events-none text-gray-400 dark:text-gray-500',
              'whitespace-nowrap overflow-hidden text-ellipsis w-full'
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
