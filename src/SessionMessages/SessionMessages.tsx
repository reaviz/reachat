import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { SessionEmpty } from './SessionEmpty';
import { SessionMessage } from './SessionMessage';
import { SessionsContext } from '@/SessionsContext';
import { Button, cn, DateFormat, Ellipsis, useInfinityList } from 'reablocks';
import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence, motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07
    }
  }
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

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
  const { activeSession, theme, isLoading } = useContext(SessionsContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const MessageComponent = children ? Slot : SessionMessage;
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (contentRef.current) {
      // Scroll to the bottom of the content in animation queue
      requestAnimationFrame(
        () => (contentRef.current.scrollTop = contentRef.current.scrollHeight)
      );
    }
    // If we update the active session or load the page initially ( onAnimationComplete )
    // let's scroll to the bottom of the page.
  }, [activeSession, isAnimating]);

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
    return <SessionEmpty>{newSessionContent}</SessionEmpty>;
  }

  return (
    <div className={cn(theme.messages.base)}>
      <header className={cn(theme.messages.header)}>
        <h2 className={cn(theme.messages.title)}>
          <Ellipsis limit={125} value={activeSession.title} />
        </h2>
        <DateFormat className={cn(theme.messages.date)} date={activeSession.createdAt} />
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
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            key={activeSession?.id}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => {
              setIsAnimating(false);
            }}
          >
            {convosToRender.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                variants={messageVariants}
              >
                <MessageComponent
                  {...conversation}
                  isLoading={isLoading && index === convosToRender.length - 1}
                >
                  {children}
                </MessageComponent>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
