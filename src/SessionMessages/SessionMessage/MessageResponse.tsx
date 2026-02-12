import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'motion/react';
import { cn } from 'reablocks';
import { memo, PropsWithChildren, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { Plugin } from 'unified';

export interface MessageResponseProps extends PropsWithChildren {
  /**
   * Response to render.
   */
  response: string;

  /**
   * Whether the response is loading.
   */
  isLoading?: boolean;
}

export const MessageResponse = memo<MessageResponseProps>(
  ({ response, isLoading, children }) => {
    const { theme, isCompact, remarkPlugins } = useContext(ChatContext);
    const Comp = children ? Slot : 'div';
    return (
      <Comp
        data-compact={isCompact}
        className={cn(theme.messages.message.response)}
      >
        {children || (
          <>
            <Markdown remarkPlugins={remarkPlugins as Plugin[]}>
              {response}
            </Markdown>
            {isLoading && (
              <motion.div
                className={cn(theme.messages.message.cursor)}
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            )}
          </>
        )}
      </Comp>
    );
  }
);

MessageResponse.displayName = 'MessageResponse';
