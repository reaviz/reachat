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
import ArrowDownIcon from '../assets/arrow-down.svg?react';

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
   * Whether to display the scroll to bottom button.
   */
  isScrollToBottomButtonVisible?: boolean;

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
      mutationObserver.disconnect();
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
  showMoreText = 'Show more',
  isScrollToBottomButtonVisible = false
}) => {
  const { activeSession, theme } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [iAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (!contentRef.current || !isScrollToBottomButtonVisible) {
      return;
    }

    const handleScroll = debounce(() => {
      setIsAtBottom(
        contentRef.current.scrollHeight - contentRef.current.clientHeight ===
          contentRef.current.scrollTop
      );
    }, 50);
    contentRef.current.addEventListener('scroll', handleScroll);

    return () =>
      contentRef.current?.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  useEffect(() => {
    if (!contentRef.current || !messagesRef.current || isAnimating) {
      return;
    }

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
  }, [activeSession, isAnimating]);

  const handleShowMore = () => {
    showNext(limit);
    requestAnimationFrame(() => (contentRef.current.scrollTop = 0));
  };

  const handleScrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

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
    <div className="relative flex-1 overflow-y-hidden">
      <div
        className={cn(theme.messages.content, 'h-full')}
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
      <AnimatePresence>
        {!iAtBottom && isScrollToBottomButtonVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10"
          >
            <Button
              onClick={handleScrollToBottom}
              className="rounded-full p-2 shadow-lg"
              size="sm"
            >
              <ArrowDownIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
