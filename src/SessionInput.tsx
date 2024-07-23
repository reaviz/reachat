import { FC, useState, KeyboardEvent, ReactElement, useRef, ChangeEvent } from 'react';
import { Button, Textarea } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import AttachIcon from '@/assets/paperclip.svg?react';
import { ChatTheme } from './theme';

interface SessionInputProps {
  theme?: ChatTheme;
  allowedFiles?: string[];

  /**
   * Indicates whether the sessions are currently loading.
   */
  isLoading?: boolean;

  /**
   * Placeholder text for the input field.
   */
  inputPlaceholder?: string;

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

  /**
   * Callback function to handle sending a new message.
   */
  onSendMessage?: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage?: () => void;

  /**
   * Callback function to handle file upload.
   */
  onFileUpload?: (file: File) => void;
}

export const SessionInput: FC<SessionInputProps> = ({
  theme,
  allowedFiles,
  onSendMessage,
  isLoading,
  inputPlaceholder,
  onStopMessage,
  onFileUpload,
  sendIcon = <SendIcon />,
  stopIcon = <StopIcon />,
  attachIcon = <AttachIcon />
}) => {
  const [message, setMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
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
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex mt-4">
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
            className="px-4 py-2 text-white rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            {attachIcon}
          </Button>
        </>
      )}
      <Textarea
        containerClassName="w-full"
        minRows={3}
        autoFocus
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={inputPlaceholder}
        disabled={isLoading}
      />
      <Button
        title="Send"
        className="px-4 py-2 text-white"
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        {sendIcon}
      </Button>
      {isLoading && (
        <Button
          title="Stop"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={onStopMessage}
        >
          {stopIcon}
        </Button>
      )}
    </div>
  );
};
