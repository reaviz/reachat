import { FC, useState, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface SessionInputProps {
  /**
   * Indicates whether the sessions are currently loading.
   */
  isLoading?: boolean;

  /**
   * Placeholder text for the input field.
   */
  inputPlaceholder?: string;

  /**
   * Callback function to handle sending a new message.
   */
  onSendMessage: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage: () => void;
}

export const SessionInput: FC<SessionInputProps> = ({ onSendMessage, isLoading, inputPlaceholder, onStopMessage }) => {
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
    <div className="session-input mt-4">
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
      <div className="mt-2 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
        {isLoading && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={onStopMessage}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
