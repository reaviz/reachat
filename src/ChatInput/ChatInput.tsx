import {
  FC,
  useState,
  KeyboardEvent,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Button, Textarea, cn } from 'reablocks';
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
   * Icon to show for send.
   */
  stopIcon?: ReactElement;

  /**
   * Icon to show for attach.
   */
  attachIcon?: ReactElement;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  allowedFiles,
  placeholder,
  defaultValue,
  sendIcon = <SendIcon />,
  stopIcon = <StopIcon />,
  attachIcon
}, ref) => {
  const { theme, isLoading, disabled, sendMessage, stopMessage, fileUpload } =
    useContext(ChatContext);
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage?.(message);
      setMessage('');
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

  return (
    <div className={cn(theme.input.base)}>
      <Textarea
        inputRef={inputRef}
        containerClassName={cn(theme.input.input)}
        minRows={1}
        autoFocus
        value={message}
        defaultValue={defaultValue}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isLoading || disabled}
        onChange={e => setMessage(e.target.value)}
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
});
