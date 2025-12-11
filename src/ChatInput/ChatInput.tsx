import { Button, cn, Textarea } from 'reablocks';
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react';
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

interface ChatInputProps {
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
   * Set the input value programmatically.
   */
  setValue: (value: string) => void;

  /**
   * Get the input value programmatically.
   */
  getValue: () => string;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      allowMultipleFiles = false,
      placeholder,
      defaultValue,
      className,
      message,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      dropIcon,
      dropText,
      onMessageChange
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
    const [internalMessage, setInternalMessage] = useState<string>('');
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      setInternalMessage(message);
    }, [message]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId, inputRef]);

    const handleSendMessage = () => {
      if (internalMessage.trim()) {
        sendMessage?.(internalMessage);
        setInternalMessage('');
      }
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      send: () => {
        handleSendMessage();
      },
      setValue: (value: string) => {
        setInternalMessage(value);
        onMessageChange?.(value);
      },
      getValue: () => {
        return internalMessage;
      }
    }));

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
    };

    const handleMessageChange = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInternalMessage(event.target.value);
        onMessageChange?.(event.target.value);
      },
      [onMessageChange]
    );

    return (
      <div className={cn(theme.input.base, className)}>
        <FileDropzone
          allowedFiles={allowedFiles}
          multiple={allowMultipleFiles}
          disabled={disabled || isLoading}
          dropIcon={dropIcon}
          dropText={dropText}
          onFileDrop={fileUpload}
        >
          <Textarea
            ref={inputRef}
            containerClassName={cn(theme.input.input)}
            minRows={1}
            autoFocus
            value={internalMessage}
            defaultValue={defaultValue}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            onChange={handleMessageChange}
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
        </FileDropzone>
      </div>
    );
  }
);
