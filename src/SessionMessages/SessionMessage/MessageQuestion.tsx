import { Slot } from '@radix-ui/react-slot';
import { Button, cn } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import type { Plugin } from 'unified';

import { ChatContext } from '@/ChatContext';
import { Markdown } from '@/Markdown';
import type { ConversationFile } from '@/types';

import { MessageFiles } from './MessageFiles';

export interface MessageQuestionProps extends PropsWithChildren {
  /**
   * Number of lines to show before truncating.
   */
  previewLineClamp?: number | boolean;
  /**
   * Question to render.
   */
  question: string;

  /**
   * Array of sources referenced in the conversation
   */
  files?: ConversationFile[];
}

export const MessageQuestion: FC<MessageQuestionProps> = ({
  children,
  previewLineClamp = 3,
  ...props
}) => {
  const { theme, remarkPlugins } = useContext(ChatContext);
  const { question, files } = props;
  const Comp = children ? Slot : 'div';
  const [truncated, setTruncated] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const calculateTruncation = useCallback(() => {
    const el = ref.current;
    if (el) {
      setTruncated(el.scrollHeight > el.clientHeight);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || previewLineClamp === false) {
      return;
    }

    calculateTruncation();

    const resizeObserver = new ResizeObserver(() => {
      calculateTruncation();
    });

    resizeObserver.observe(el);

    // Also update when window size changes (some layouts don’t trigger ResizeObserver properly)
    window.addEventListener('resize', calculateTruncation);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateTruncation);
    };
  }, [calculateTruncation, previewLineClamp]);

  return (
    <Comp
      className={cn(theme.messages.message.question, {
        [theme.messages.message.overlay]: truncated
      })}
      {...props}
    >
      {children || (
        <>
          <MessageFiles files={files} />
          <div
            ref={ref}
            className={cn({
              [`line-clamp-${previewLineClamp}`]:
                !showAll && typeof previewLineClamp === 'number',
              'line-clamp-none': showAll || previewLineClamp === false
            })}
          >
            <Markdown remarkPlugins={remarkPlugins as Plugin[]} theme={theme}>
              {question}
            </Markdown>
          </div>
          {truncated && !showAll && (
            <Button
              variant="text"
              size="small"
              className={theme.messages.message.expand}
              onClick={() => setShowAll(true)}
            >
              Show more
            </Button>
          )}
        </>
      )}
    </Comp>
  );
};
