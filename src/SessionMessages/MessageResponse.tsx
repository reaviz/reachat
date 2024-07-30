import { SessionsContext } from '@/SessionsContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cn } from 'reablocks';
import { FC, ReactNode, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';
import remarkYoutube from 'remark-youtube';

export interface MessageResponseProps {
  /**
   * Response to render.
   */
  response: string;

  /**
   * Whether the response is loading.
   */
  isLoading?: boolean;

  /**
   * Children to render as MessageResponse slot.
   */
  children?: ReactNode;
}

export const MessageResponse: FC<MessageResponseProps> = ({
  response,
  isLoading,
  children
}) => {
  const { theme, remarkPlugins = [remarkGfm, remarkYoutube] } =
    useContext(SessionsContext);
  const Comp = children ? Slot : 'div';
  return (
    <Comp className={cn(theme.messages.message.response)}>
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
