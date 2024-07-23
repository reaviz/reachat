import React from 'react';
import { SessionMessage } from './SessionMessage';
import { ResponseTransformer, Session } from './types';
import { SessionInput } from './SessionInput';
import { ChatTheme } from './theme';

interface SessionMessagesProps {
  /**
   * Session to display.
   */
  session: Session;

  /**
   * Response transformers to apply to the response.
   */
  responseTransformers?: ResponseTransformer[];

  /**
   * Theme to use for the session messages.
   */
  theme?: ChatTheme;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  session,
  responseTransformers,
  theme,
}) => {
  return (
    <div className="flex flex-col flex-1">
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
    </div>

  );
};
