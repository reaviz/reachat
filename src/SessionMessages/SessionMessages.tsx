import debounce from 'lodash/debounce';
import { AnimatePresence, motion } from 'motion/react';
import { Button, cn, IconButton, useInfinityList } from 'reablocks';
import type { ReactNode, UIEventHandler } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import ArrowDownIcon from '@/assets/arrow-down.svg?react';
import { ChatContext } from '@/ChatContext';
import type { Conversation } from '@/types';

import { SessionEmpty } from './SessionEmpty';
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
   * Whether to automatically scroll to the bottom of the content.
   */
  autoScroll?: boolean;

  /**
   * Whether to display the scroll to bottom button.
   */
  showScrollBottomButton?: boolean;

  /**
   * Render function for the session messages.
   */
  children?: (conversations: Conversation[]) => ReactNode;

  /**
   * Whether to show the load more button.
   */
  showLoadMoreButton?: boolean;

  /**
   * Whether to disable the load more button.
   */
  loadMoreButtonDisabled?: boolean;

  /**
   * Scroll event handler.
   * @param e
   */
  onScroll?: UIEventHandler<HTMLDivElement>;

  /**
   * Load more event handler.
   */
  onLoadMore?: () => void;
}

export const SessionMessages: React.FC<SessionMessagesProps> = ({
  children,
  newSessionContent,
  limit = 10,
  className,
  showMoreText = 'Show more',
  autoScroll = true,
  showLoadMoreButton = false,
  showScrollBottomButton,
  loadMoreButtonDisabled,
  onScroll,
  onLoadMore
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
    if (contentRef.current && autoScroll) {
      // Scroll to the bottom of the content in animation queue
      requestAnimationFrame(
        () => (contentRef.current.scrollTop = contentRef.current.scrollHeight)
      );
    }
    // If we update the active session or load the page initially ( onAnimationComplete )
    // let's scroll to the bottom of the page.
  }, [activeSession, autoScroll, isAnimating]);

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
        className={cn(theme.messages.content, className, 'h-full')}
        ref={contentRef}
        id={activeSession?.id}
        onScrollCapture={onScroll}
      >
        {(showLoadMoreButton || hasMore) && (
          <Button
            disabled={loadMoreButtonDisabled}
            variant="outline"
            className={cn(theme.messages.showMore)}
            fullWidth
            onClick={onLoadMore ?? handleShowMore}
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
                if (contentRef.current && autoScroll) {
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
              size="small"
            >
              <ArrowDownIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
