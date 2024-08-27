import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';

export interface MessageResponseRecommendedProps extends PropsWithChildren {
  /**
   * Follow-up response to render (array of values).
   */
  followUpResponse: string[];

  /**
   * Whether the response is loading.
   */
  isLoading?: boolean;

  /**
   * Function to handle clicks on the follow-up response.
   */
  onClickFollowUpResponse?: (followUpResponse: string) => void;
}

// Helper function to check if the URL is a valid image URL
const isImageUrl = (url: string) => {
  return /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url);
};

export const MessageResponseRecommended: FC<
  MessageResponseRecommendedProps
> = ({ followUpResponse, isLoading, children, onClickFollowUpResponse }) => {
  const { theme, isCompact, remarkPlugins } = useContext(ChatContext);
  const Comp = children ? Slot : 'div';

  return (
    <Comp
      data-compact={isCompact}
      className={cn(theme.messages.message.recommended)}
    >
      {children || (
        <>
          {/* Map over follow-up responses to display them individually */}
          {followUpResponse.map((responseItem, index) => (
            <div
              key={index}
              onClick={() => onClickFollowUpResponse?.(responseItem)}
            >
              {isImageUrl(responseItem) ? (
                <figure>
                  <img
                    src={responseItem}
                    alt={responseItem}
                    className={cn(theme.messages.message.rimage)}
                  />
                </figure>
              ) : (
                <div className={cn(theme.messages.message.markdownBorder)}>
                  <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
                    {responseItem}
                  </Markdown>
                </div>
              )}
            </div>
          ))}

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
