import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';

export interface MessageResponseRecommendedProps extends PropsWithChildren {
  /**
   * Initial response to render.
   */
  response: string;

  /**
   * Follow-up response to render.
   */
  followUpResponse: string;

  /**
   * Whether the response is loading.
   */
  isLoading?: boolean;

  /**
   * Function to handle clicks on the response.
   */
  onClickResponse?: (response: string) => void;

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
> = ({
  response,
  followUpResponse,
  isLoading,
  children,
  onClickResponse,
  onClickFollowUpResponse
}) => {
  const { theme, isCompact, remarkPlugins } = useContext(ChatContext);
  const Comp = children ? Slot : 'div';

  return (
    <Comp
      data-compact={isCompact}
      className={cn(theme.messages.message.recommended)}
    >
      {children || (
        <>
          <div onClick={() => onClickResponse?.(response)}>
            {isImageUrl(response) ? (
              <figure>
                <img
                  src={response}
                  alt={response}
                  className={cn(theme.messages.message.rimage)}
                />
              </figure>
            ) : (
              <div className={cn(theme.messages.message.markdownBorder)}>
                <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
                  {response}
                </Markdown>
              </div>
            )}
          </div>
          <div onClick={() => onClickFollowUpResponse?.(followUpResponse)}>
            {isImageUrl(followUpResponse) ? (
              <figure>
                <img
                  src={followUpResponse}
                  alt={followUpResponse}
                  className={cn(theme.messages.message.rimage)}
                />
              </figure>
            ) : (
              <div className={cn(theme.messages.message.markdownBorder)}>
                <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
                  {followUpResponse}
                </Markdown>
              </div>
            )}
          </div>
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
