import { Button, cn } from 'reablocks';
import type { ChangeEvent, ReactElement } from 'react';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';

import { FileDropzone } from './FileDropzone';
import { FileInput } from './FileInput';
import type { RichTextInputRef } from './RichTextInput';
import { RichTextInput } from './RichTextInput';
import type { MentionItem, SlashCommandItem, SuggestionConfig } from './types';

export interface ChatInputProps {
  /**
   * Default value for the input field.
   */
  defaultValue?: string;

  /**
   * Allowed file extensions for upload (e.g., ['.pdf', '.docx']).
   */
  allowedFiles?: string[];

  /**
   * Allow multiple file uploads.
   */
  allowMultipleFiles?: boolean;

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
   * Icon to show for the dropzone overlay.
   */
  dropIcon?: ReactElement;

  /**
   * Text to show on the dropzone overlay.
   */
  dropText?: string;

  /**
   * Message to be displayed in the input field.
   */
  message?: string;

  /**
   * Class name to apply to the container.
   */
  className?: string;

  /**
   * Callback function to handle message change.
   */
  onMessageChange?: (message: string) => void;

  /**
   * Configuration for mentions (@user).
   * Provide items or an onSearch function to enable mentions.
   */
  mentions?: SuggestionConfig<MentionItem>;

  /**
   * Configuration for commands (/command).
   * Provide items or an onSearch function to enable commands.
   */
  commands?: SuggestionConfig<SlashCommandItem>;

  /**
   * Minimum height for the input (default: 24px)
   */
  minHeight?: number;

  /**
   * Maximum height for the input (default: 200px)
   */
  maxHeight?: number;

  /**
   * Whether to auto-focus the input on mount (default: true)
   */
  autoFocus?: boolean;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;

  /**
   * Send the message.
   */
  send: () => void;

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

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      allowMultipleFiles = false,
      placeholder = 'Type a message...',
      defaultValue,
      className,
      message: externalMessage,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      dropIcon,
      dropText,
      onMessageChange,
      mentions,
      commands,
      minHeight = 24,
      maxHeight = 200,
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
    const inputRef = useRef<RichTextInputRef | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (externalMessage !== undefined) {
        setMessage(externalMessage);
        inputRef.current?.setValue(externalMessage);
      }
    }, [externalMessage]);

    useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [activeSessionId, autoFocus]);

    const handleSendMessage = useCallback(() => {
      const currentMessage = inputRef.current?.getValue() || '';
      if (currentMessage.trim()) {
        sendMessage?.(currentMessage);
        setMessage('');
        inputRef.current?.setValue('');
      }
    }, [sendMessage]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      send: () => {
        handleSendMessage();
      },
      getValue: () => {
        return inputRef.current?.getValue() || '';
      },
      setValue: (value: string) => {
        setMessage(value);
        inputRef.current?.setValue(value);
        onMessageChange?.(value);
      },
      insertText: (text: string) => {
        inputRef.current?.insertText(text);
      }
    }));

    const handleSubmit = useCallback(
      (value: string) => {
        if (value.trim()) {
          sendMessage?.(value);
          setMessage('');
        }
      },
      [sendMessage]
    );

    const handleChange = useCallback(
      (value: string) => {
        setMessage(value);
        onMessageChange?.(value);
      },
      [onMessageChange]
    );

    const handleFileUpload = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && fileUpload) {
          if (allowMultipleFiles) {
            Array.from(files).forEach(file => fileUpload(file));
          } else {
            const file = files[0];
            if (file) {
              fileUpload(file);
            }
          }
        }
      },
      [fileUpload, allowMultipleFiles]
    );

    const mentionsConfig = mentions
      ? { ...mentions, trigger: mentions.trigger || '@' }
      : undefined;

    const commandsConfig = commands
      ? { ...commands, trigger: commands.trigger || '/' }
      : undefined;

    return (
      <div ref={containerRef} className={cn(theme.input.base, className)}>
        <FileDropzone
          allowedFiles={allowedFiles}
          multiple={allowMultipleFiles}
          disabled={disabled || isLoading}
          dropIcon={dropIcon}
          dropText={dropText}
          onFileDrop={fileUpload}
        >
          <div className={cn('relative flex-1', theme.input.input)}>
            <RichTextInput
              ref={inputRef}
              value={message}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder={placeholder}
              disabled={isLoading || disabled}
              autoFocus={autoFocus}
              minHeight={minHeight}
              maxHeight={maxHeight}
              className={theme.input.editor.container}
              mentions={mentionsConfig}
              commands={commandsConfig}
            />

            <div className={cn(theme.input.actions.base)}>
              {allowedFiles?.length > 0 && (
                <FileInput
                  allowedFiles={allowedFiles}
                  multiple={allowMultipleFiles}
                  onFileUpload={handleFileUpload}
                  disabled={disabled || isLoading}
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
        </FileDropzone>
      </div>
    );
  }
);
