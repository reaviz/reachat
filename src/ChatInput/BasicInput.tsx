import {
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ChangeEvent
} from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';

export interface BasicInputRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  insertText: (text: string) => void;
}

export interface BasicInputProps {
  /**
   * Current value of the input
   */
  value?: string;

  /**
   * Placeholder text when empty
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Whether to auto-focus on mount (default: true)
   */
  autoFocus?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Minimum height in pixels (default: 24)
   */
  minHeight?: number;

  /**
   * Maximum height in pixels (default: 200)
   */
  maxHeight?: number;

  /**
   * Callback when user submits (presses Enter)
   */
  onSubmit?: (value: string) => void;

  /**
   * Callback when input value changes
   */
  onChange?: (value: string) => void;
}

export const BasicInput = forwardRef<BasicInputRef, BasicInputProps>(
  (
    {
      value = '',
      placeholder = 'Type a message...',
      disabled = false,
      autoFocus = true,
      className,
      minHeight = 24,
      maxHeight = 200,
      onSubmit,
      onChange
    },
    ref
  ) => {
    const { theme } = useContext(ChatContext);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );
      textarea.style.height = `${newHeight}px`;
    }, [minHeight, maxHeight]);

    useEffect(() => {
      if (autoFocus) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }, [autoFocus]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      getValue: () => {
        return textareaRef.current?.value || '';
      },
      setValue: (newValue: string) => {
        if (textareaRef.current) {
          textareaRef.current.value = newValue;
          onChange?.(newValue);
          adjustHeight();
        }
      },
      insertText: (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const current = textarea.value;
        const newValue =
          current.substring(0, start) + text + current.substring(end);

        textarea.value = newValue;
        const cursorPos = start + text.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
        onChange?.(newValue);
        adjustHeight();
      }
    }));

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target.value);
        adjustHeight();
      },
      [onChange, adjustHeight]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const text = textareaRef.current?.value || '';
          if (text.trim() && onSubmit) {
            onSubmit(text);
            if (textareaRef.current) {
              textareaRef.current.value = '';
              adjustHeight();
            }
          }
        }
      },
      [onSubmit, adjustHeight]
    );

    return (
      <div className={cn('relative w-full', className)}>
        <textarea
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            'outline-none w-full overflow-y-auto resize-none',
            'text-inherit font-inherit bg-transparent',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            theme?.input?.editor?.base
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`
          }}
          role="textbox"
          aria-multiline="true"
          aria-placeholder={placeholder}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
        />
      </div>
    );
  }
);

BasicInput.displayName = 'BasicInput';
