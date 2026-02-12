import {
  useState,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback
} from 'react';
import { Button, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { BasicInput, BasicInputRef } from './BasicInput';

export interface BasicChatInputProps {
  /**
   * Default value for the input field.
   */
  defaultValue?: string;

  /**
   * Allowed file types for upload.
   */
  allowedFiles?: string[];

  /**
   * Placeholder text for the input field.
   */
  placeholder?: string;

  /**
   * Icon to show for send.
   */
  sendIcon?: ReactElement;

  /**
   * Icon to show for stop.
   */
  stopIcon?: ReactElement;

  /**
   * Icon to show for attach.
   */
  attachIcon?: ReactElement;

  /**
   * Minimum number of rows (default: 1)
   */
  minRows?: number;

  /**
   * Maximum number of rows before scrolling (default: 8)
   */
  maxRows?: number;

  /**
   * Whether to auto-focus the input on mount (default: true)
   */
  autoFocus?: boolean;
}

export interface BasicChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;

  /**
   * Get the current input value.
   */
  getValue: () => string;

  /**
   * Set the input value.
   */
  setValue: (value: string) => void;

  /**
   * Insert text at the current cursor position.
   */
  insertText: (text: string) => void;
}

export const BasicChatInput = forwardRef<
  BasicChatInputRef,
  BasicChatInputProps
>(
  (
    {
      allowedFiles,
      placeholder = 'Type a message...',
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      minRows = 1,
      maxRows = 8,
      autoFocus = true
    },
    ref
  ) => {
    const {
      theme,
      isLoading,
      disabled,
      sendMessage,
      stopMessage,
      fileUpload,
      activeSessionId
    } = useContext(ChatContext);

    const [message, setMessage] = useState<string>(defaultValue || '');
    const inputRef = useRef<BasicInputRef | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [activeSessionId, autoFocus]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => {
        return inputRef.current?.getValue() || '';
      },
      setValue: (value: string) => {
        setMessage(value);
        inputRef.current?.setValue(value);
      },
      insertText: (text: string) => {
        inputRef.current?.insertText(text);
      }
    }));

    const handleSendMessage = useCallback(() => {
      const currentMessage = inputRef.current?.getValue();
      if (currentMessage.trim()) {
        sendMessage?.(currentMessage);
        setMessage('');
        inputRef.current?.setValue('');
      }
    }, [sendMessage]);

    const handleSubmit = useCallback(
      (value: string) => {
        if (value.trim()) {
          sendMessage?.(value);
          setMessage('');
        }
      },
      [sendMessage]
    );

    const handleChange = useCallback((value: string) => {
      setMessage(value);
    }, []);

    const handleFileUpload = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && fileUpload) {
          fileUpload(file);
        }
      },
      [fileUpload]
    );

    return (
      <div ref={containerRef} className={cn(theme.input.base)}>
        <div className={cn('relative flex-1', theme.input.input)}>
          <BasicInput
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            autoFocus={autoFocus}
            minRows={minRows}
            maxRows={maxRows}
            className={theme.input.editor.container}
          />

          <div className={cn(theme.input.actions.base)}>
            {allowedFiles?.length > 0 && (
              <FileInput
                allowedFiles={allowedFiles}
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
                disabled={disabled}
                attachIcon={attachIcon}
              />
            )}
            {isLoading && (
              <Button
                title="Stop"
                className={cn(theme.input.actions.stop)}
                onClick={stopMessage}
                disabled={disabled}
              >
                {stopIcon}
              </Button>
            )}
            <Button
              title="Send"
              className={cn(theme.input.actions.send)}
              onClick={handleSendMessage}
              disabled={isLoading || disabled}
            >
              {sendIcon}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
