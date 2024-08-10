import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { SessionEmpty } from './SessionEmpty';
import { ChatContext } from '@/ChatContext';
import { Button, cn, useInfinityList } from 'reablocks';
import { AnimatePresence, motion } from 'framer-motion';
import { Conversation } from '@/types';
import { SessionMessage } from './SessionMessage/SessionMessage';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      when: 'beforeChildren'
    }
  }
};

interface SessionMessagesProps {
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

  /**
   * Render function for the session messages.
   */
  children?: (conversations: Conversation[]) => ReactNode;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  children,
  newSessionContent,
  limit = 10,
  showMoreText = 'Show more'
}) => {
  const { activeSession, theme } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
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
    showNext(limit);
    requestAnimationFrame(() => (contentRef.current.scrollTop = 0));
  }

  // Reverse the conversations so the last one is the first one
  const reversedConvos = useMemo(
    () => [...(activeSession?.conversations ?? [])].reverse(),
    [activeSession]
  );

  const { data, hasMore, showNext } = useInfinityList({
    items: reversedConvos,
    size: limit
  });

  // Reverse the data to the last one last now
  const reReversedConvo = useMemo(() => [...data].reverse(), [data]);

  // If we are not paging, just return the conversations
  const convosToRender = limit ? reReversedConvo : activeSession?.conversations;

  if (!activeSession) {
    return <SessionEmpty>{newSessionContent}</SessionEmpty>;
  }

  return (
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
            requestAnimationFrame(() => setIsAnimating(false));
          }}
        >
          {children
            ? children(convosToRender)
            : convosToRender.map((conversation, index) => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === conversation.length - 1}
                />
              ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
