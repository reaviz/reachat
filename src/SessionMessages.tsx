import React, { useContext, useEffect, useRef } from 'react';
import { SessionMessage } from './SessionMessage';
import { Session } from './types';
import { SessionsContext } from './SessionsContext';
import { cn, DateFormat } from 'reablocks';

interface SessionMessagesProps {
  /**
   * Session to display.
   */
  session: Session;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  session
}) => {
  const { theme } = useContext(SessionsContext);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Scroll to the bottom of the content in animation queue
      requestAnimationFrame(() =>
        contentRef.current.scrollTop = contentRef.current.scrollHeight);
    }
  }, [session]);

  return (
    <div
      className={cn(theme.messages.base)}
    >
      <header className={cn(theme.messages.header)}>
        <h2 className={cn(theme.messages.title)}>
          {session.title}
        </h2>
        <DateFormat date={session.createdAt} />
      </header>
      <div
        className={cn(theme.messages.content)}
        ref={contentRef}
      >
        {session.conversations.map((conversation) => (
          <SessionMessage
            key={conversation.id}
            question={conversation.question}
            response={conversation.response || ''}
          />
        ))}
      </div>
    </div>
  );
};
