import React, {
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import debounce from 'lodash.debounce';
import { SessionEmpty } from './SessionEmpty';
import { ChatContext } from '@/ChatContext';
import { Button, cn, useInfinityList } from 'reablocks';
import { AnimatePresence, motion } from 'motion/react';
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

const executeScrollLogic = (
  messagesRef: RefObject<HTMLDivElement>,
  contentRef: RefObject<HTMLDivElement>,
  mutationObserver: MutationObserver
) => {
  if (contentRef.current) {
    const atBottom =
      contentRef.current.scrollHeight - contentRef.current.clientHeight ===
      contentRef.current.scrollTop;
    if (atBottom) {
      // If we are at the bottom, don't scroll
      return;
    }
  }
  if (messagesRef.current) {
    const lastMessage = messagesRef.current
      .lastElementChild as HTMLElement | null;

    if (lastMessage) {
      lastMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Disconnect the mutation observer after the scroll
    mutationObserver.disconnect();
  }
};

const debouncedExecuteScrollLogic = debounce(executeScrollLogic, 100);

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  children,
  newSessionContent,
  limit = 10,
  showMoreText = 'Show more'
}) => {
  const { activeSession, theme } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (contentRef.current && messagesRef.current && !isAnimating) {
      // Create a mutation observer to listen for changes to call scroll after children animations complete
      const mutationObserver = new MutationObserver(() =>
        debouncedExecuteScrollLogic(messagesRef, contentRef, mutationObserver)
      );

      mutationObserver.observe(messagesRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      return () => mutationObserver.disconnect();
    }
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
    <div
      className={cn(theme.messages.content)}
      ref={contentRef}
      id={activeSession?.id}
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
      <AnimatePresence>
        <motion.div
          ref={messagesRef}
          variants={containerVariants}
          key={activeSession?.id}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() =>
            requestAnimationFrame(() => {
              setIsAnimating(false);
              // Scroll to the bottom of the container at initial load
              contentRef.current.scrollTop = contentRef.current.scrollHeight;
            })
          }
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
