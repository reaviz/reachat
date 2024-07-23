import React from 'react';
import { SessionMessage } from './SessionMessage';
import { ResponseTransformer, Session } from './types';
import { SessionInput } from './SessionInput';
import { ChatTheme } from './theme';

interface SessionMessagesProps {
  session: Session;
  responseTransformers?: ResponseTransformer[];
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
   * Callback function to handle sending a new message.
   */
  onSendMessage?: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage?: () => void;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  session,
  responseTransformers,
  inputPlaceholder,
  isLoading,
  allowedFiles,
  onSendMessage,
  onStopMessage
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold">{session.title}</h2>
      <div className="mt-2 flex-1">
        {session.conversations.map((conversation) => (
          <SessionMessage
            key={conversation.id}
            question={conversation.question}
            response={conversation.response || ''}
            responseTransformers={responseTransformers}
          />
        ))}
      </div>
      <SessionInput
        inputPlaceholder={inputPlaceholder}
        isLoading={isLoading}
        allowedFiles={allowedFiles}
        onSendMessage={onSendMessage}
        onStopMessage={onStopMessage}
      />
    </div>

  );
};
