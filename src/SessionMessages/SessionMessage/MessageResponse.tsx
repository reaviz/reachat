import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';
import remarkYoutube from 'remark-youtube';

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

export const MessageResponse: FC<MessageResponseProps> = ({
  response,
  isLoading,
  children
}) => {
  const {
    theme,
    isCompact,
    remarkPlugins = [remarkGfm, remarkYoutube]
  } = useContext(ChatContext);
  const Comp = children ? Slot : 'div';
  return (
    <Comp
      data-compact={isCompact}
      className={cn(theme.messages.message.response)}
    >
      {children || (
        <>
          <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
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
};
