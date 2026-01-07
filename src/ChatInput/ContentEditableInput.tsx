import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
  FormEvent,
  useImperativeHandle
} from 'react';
import { cn } from 'reablocks';

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
      maxHeight = 200
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);
    const lastKnownValue = useRef(value);

    const getTextContent = useCallback((): string => {
      if (!editorRef.current) return '';
      return editorRef.current.textContent || '';
    }, []);

    const getCursorPosition = useCallback((): number => {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !editorRef.current) return 0;

      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      return preCaretRange.toString().length;
    }, []);

    const setCursorPosition = useCallback((position: number) => {
      const editor = editorRef.current;
      if (!editor) return;

      const selection = window.getSelection();
      if (!selection) return;

      const textNode = editor.firstChild;
      if (!textNode) {
        // Empty editor, just focus
        editor.focus();
        return;
      }

      const range = document.createRange();
      const textLength = textNode.textContent?.length || 0;
      const safePosition = Math.min(position, textLength);

      try {
        range.setStart(textNode, safePosition);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch {
        // Fallback: move to end
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

        // Use textContent to avoid XSS and keep it plain text
        editor.textContent = newValue;
        lastKnownValue.current = newValue;

        if (hadFocus) {
          // Try to restore cursor position
          const newPos = Math.min(cursorPos, newValue.length);
          requestAnimationFrame(() => {
            setCursorPosition(newPos);
          });
        }
      },
      [getCursorPosition, setCursorPosition]
    );

    // Sync value from props when it changes externally
    useEffect(() => {
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }

      const currentValue = getTextContent();
      if (currentValue !== value) {
        setValue(value);
      }
    }, [value, getTextContent, setValue]);

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
        onChange(newValue);
        onCursorChange?.(getCursorPosition());
      },
      [onChange, onCursorChange, getCursorPosition]
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
