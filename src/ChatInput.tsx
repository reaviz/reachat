import {
  FC,
  useState,
  KeyboardEvent,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext
} from 'react';
import { Button, Textarea, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import AttachIcon from '@/assets/paperclip.svg?react';
import { ChatContext } from './ChatContext';

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

export const ChatInput: FC<ChatInputProps> = ({
  allowedFiles,
  placeholder,
  defaultValue,
  sendIcon = <SendIcon />,
  stopIcon = <StopIcon />,
  attachIcon = <AttachIcon />
}) => {
  const { theme, isLoading, disabled, sendMessage, stopMessage, fileUpload } =
    useContext(ChatContext);
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        containerClassName={cn(theme.input.input)}
        minRows={1}
        autoFocus
        value={message}
        onChange={e => setMessage(e.target.value)}
        defaultValue={defaultValue}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isLoading || disabled}
      />
      {allowedFiles?.length > 0 && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={allowedFiles.join(',')}
            onChange={handleFileUpload}
          />
          <Button
            title="Upload"
            disabled={isLoading || disabled}
            className={cn(theme.input.upload)}
            onClick={() => fileInputRef.current?.click()}
          >
            {attachIcon}
          </Button>
        </>
      )}
      {isLoading && (
        <Button
          title="Stop"
          className={cn(theme.input.stop)}
          onClick={stopMessage}
          disabled={disabled}
        >
          {stopIcon}
        </Button>
      )}
      <Button
        title="Send"
        className={cn(theme.input.send)}
        onClick={handleSendMessage}
        disabled={isLoading || disabled}
      >
        {sendIcon}
      </Button>
    </div>
  );
};
