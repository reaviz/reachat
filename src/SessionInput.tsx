import { FC, useState, KeyboardEvent } from 'react';

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
}

export const SessionInput: FC<SessionInputProps> = ({ onSendMessage, isLoading, inputPlaceholder }) => {
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
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={inputPlaceholder}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        Send
      </button>
    </div>
  );
};