import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { SessionMessage } from './SessionMessage';
import { Session } from './types';
import { SessionsContext } from './SessionsContext';
import { Button, cn, DateFormat, useInfinityList } from 'reablocks';

interface SessionMessagesProps {
  /**
   * Session to display.
   */
  session: Session;

  /**
   * Limit the number of results returned. Clientside pagination.
   */
  limit?: number | null;

  /**
   * Text to display for the show more button.
   */
  showMoreText?: string;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  session,
  limit = 10,
  showMoreText = 'Show more'
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

  function handleShowMore() {
    showNext(10);
    requestAnimationFrame(() => contentRef.current.scrollTop = 0);
  }

  // Reverse the conversations so the last one is the first one
  const reversedConvos = useMemo(() => [...session.conversations].reverse(), [session]);

  const {
    data,
    hasMore,
    showNext
  } = useInfinityList({
    items: reversedConvos,
    limit
  });

  // Reverse the data to the last one last now
  const reReversedConvo = useMemo(() => [...data].reverse(), [data]);

  // If we are not paging, just return the conversations
  const convosToRender = limit ? reReversedConvo : session.conversations;

  return (
    <div className={cn(theme.messages.base)}>
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
        {hasMore && (
          <Button
            variant="outline"
            className={cn(theme.messages.showMore)}
            fullWidth
            onClick={handleShowMore}
          >
            {showMoreText}
          </Button>
        )}
        {convosToRender.map((conversation) => (
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
