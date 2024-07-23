import { Button } from 'reablocks';
import { FC, useState, KeyboardEvent, ReactElement } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatTheme } from './theme';

interface SessionInputProps {
  theme?: ChatTheme;

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
   * Callback function to handle sending a new message.
   */
  onSendMessage?: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage?: () => void;
}

export const SessionInput: FC<SessionInputProps> = ({
  theme,
  onSendMessage,
  isLoading,
  inputPlaceholder,
  onStopMessage,
  sendIcon = <SendIcon />,
  stopIcon = <StopIcon />
}) => {
  const [message, setMessage] = useState<string>('');

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

  return (
    <div className="flex mt-4">
      <TextareaAutosize
        className="w-full p-2 border rounded"
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
