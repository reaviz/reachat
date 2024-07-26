import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { SessionEmpty } from './SessionEmpty';
import { SessionMessage } from './SessionMessage';
import { SessionsContext } from '@/SessionsContext';
import { Button, cn, DateFormat, useInfinityList } from 'reablocks';
import { Slot } from '@radix-ui/react-slot';

interface SessionMessagesProps extends PropsWithChildren {
  /**
   * Content to display when there are no sessions selected or a new session is started.
   */
  newSessionContent?: string | ReactNode;

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
  children,
  newSessionContent,
  limit = 10,
  showMoreText = 'Show more'
}) => {
  const { activeSession, theme } = useContext(SessionsContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const MessageComponent = children ? Slot : SessionMessage;

  useEffect(() => {
    if (contentRef.current) {
      // Scroll to the bottom of the content in animation queue
      requestAnimationFrame(
        () => (contentRef.current.scrollTop = contentRef.current.scrollHeight)
      );
    }
  }, [activeSession]);

  function handleShowMore() {
    showNext(10);
    requestAnimationFrame(() => (contentRef.current.scrollTop = 0));
  }

  // Reverse the conversations so the last one is the first one
  const reversedConvos = useMemo(
    () => [...activeSession?.conversations ?? []].reverse(),
    [activeSession]
  );

  const { data, hasMore, showNext } = useInfinityList({
    items: reversedConvos,
    limit
  });

  // Reverse the data to the last one last now
  const reReversedConvo = useMemo(() => [...data].reverse(), [data]);

  // If we are not paging, just return the conversations
  const convosToRender = limit ? reReversedConvo : activeSession?.conversations;

  if (!activeSession) {
    return <SessionEmpty newSessionContent={newSessionContent} />;
  }

  return (
    <div className={cn(theme.messages.base)}>
      <header className={cn(theme.messages.header)}>
        <h2 className={cn(theme.messages.title)}>{activeSession.title}</h2>
        <DateFormat date={activeSession.createdAt} />
      </header>
      <div className={cn(theme.messages.content)} ref={contentRef}>
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
        {convosToRender.map(conversation => (
          <MessageComponent
            key={conversation.id}
            question={conversation.question}
            response={conversation.response}
          >
            {children}
          </MessageComponent>
        ))}
      </div>
    </div>
  );
};
