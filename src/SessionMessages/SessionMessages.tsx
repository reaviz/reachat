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
import { Button, cn, IconButton, useInfinityList } from 'reablocks';
import { AnimatePresence, motion } from 'motion/react';
import { Conversation } from '@/types';
import debounce from 'lodash/debounce.js';
import { SessionMessage } from './SessionMessage/SessionMessage';
import ArrowDownIcon from '@/assets/arrow-down.svg?react';

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
   * Class name to apply to the root element.
   */
  className?: string;

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
  showScrollBottomButton?: boolean;

  /**
   * Render function for the session messages.
   */
  children?: (conversations: Conversation[]) => ReactNode;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  children,
  newSessionContent,
  limit = 10,
  className,
  showMoreText = 'Show more',
  showScrollBottomButton = false
}) => {
  const { activeSession, theme } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [iAtBottom, setIsAtBottom] = useState(true);
  useEffect(() => {
    if (!contentRef.current || !showScrollBottomButton) {
      return;
    }

    const handleScroll = debounce(() => {
      if (contentRef.current) {
        setIsAtBottom(
          contentRef.current.scrollHeight - contentRef.current.clientHeight ===
            contentRef.current.scrollTop
        );
      }
    }, 50);
    const currentRef = contentRef.current;
    currentRef.addEventListener('scroll', handleScroll);

    return () => currentRef.removeEventListener('scroll', handleScroll);
  }, [showScrollBottomButton]);

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
    <div className={cn('relative flex-1 overflow-y-hidden', className)}>
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
                if (contentRef.current) {
                  contentRef.current.scrollTop =
                    contentRef.current.scrollHeight;
                }
              })
            }
          >
            {children
              ? children(convosToRender)
              : convosToRender.map((conversation, index) => (
                  <SessionMessage
                    key={conversation.id}
                    conversation={conversation}
                    isLast={index === convosToRender.length - 1}
                  />
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!iAtBottom && showScrollBottomButton && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={theme.messages?.message?.scrollToBottom?.container}
          >
            <IconButton
              onClick={handleScrollToBottom}
              className={theme.messages?.message?.scrollToBottom?.button}
              size="sm"
            >
              <ArrowDownIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
