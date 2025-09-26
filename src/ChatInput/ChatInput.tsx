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

import { FileInput } from './FileInput';

interface ChatInputProps {
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
   * Message to be displayed in the input field.
   */
  message?: string;

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
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      placeholder,
      defaultValue,
      message,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
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
      setInternalMessage(message || '');
    }, [message]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId, inputRef]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      send: () => {
        if (internalMessage.trim()) {
          sendMessage?.(internalMessage);
          setInternalMessage('');
        }
      }
    }));

    const handleSendMessage = () => {
      if (internalMessage.trim()) {
        sendMessage?.(internalMessage);
        setInternalMessage('');
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && fileUpload) {
        fileUpload(file);
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
      <div className={cn(theme.input.base)}>
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
    );
  }
);
