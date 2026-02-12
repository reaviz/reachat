import {
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent
} from 'react';
import { Textarea, TextAreaRef, cn } from 'reablocks';
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
   * Minimum number of rows (default: 1)
   */
  minRows?: number;

  /**
   * Maximum number of rows before scrolling (default: 8)
   */
  maxRows?: number;

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
      minRows = 1,
      maxRows = 8,
      onSubmit,
      onChange
    },
    ref
  ) => {
    const { theme } = useContext(ChatContext);
    const textareaRef = useRef<TextAreaRef>(null);

    useEffect(() => {
      if (autoFocus) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }, [autoFocus]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      getValue: () => {
        return textareaRef.current?.inputRef?.current?.value || '';
      },
      setValue: (newValue: string) => {
        const textarea = textareaRef.current?.inputRef?.current;
        if (textarea) {
          onChange?.(newValue);
        }
      },
      insertText: (text: string) => {
        const textarea = textareaRef.current?.inputRef?.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const current = textarea.value;
        const newValue =
          current.substring(0, start) + text + current.substring(end);

        onChange?.(newValue);
        setTimeout(() => {
          const cursorPos = start + text.length;
          textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
    }));

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const text = textareaRef.current?.inputRef?.current?.value || '';
          if (text.trim() && onSubmit) {
            onSubmit(text);
          }
        }
      },
      [onSubmit]
    );

    return (
      <div className={cn('relative w-full', className)}>
        <Textarea
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          minRows={minRows}
          maxRows={maxRows}
          theme={{
            base: '',
            input: cn(
              'outline-none w-full resize-none',
              'text-inherit font-inherit bg-transparent',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              theme?.input?.editor?.base
            ),
            fullWidth: '',
            error: '',
            disabled: '',
            sizes: {
              small: '',
              medium: '',
              large: ''
            }
          }}
        />
      </div>
    );
  }
);

BasicInput.displayName = 'BasicInput';
