import { FC, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { Card, cn } from 'reablocks';
import CopyIcon from '@/assets/copy.svg?react';
import ThumbsDownIcon from '@/assets/thumbs-down.svg?react';
import ThumbUpIcon from '@/assets/thumbs-up.svg?react';
import RefreshIcon from '@/assets/refresh.svg?react';
import { Conversation } from '@/types';
import { motion } from 'framer-motion';
import { MessageQuestion } from './MessageQuestion';
import { MessageResponse } from './MessageResponse';
import { MessageFiles } from './MessageFiles';
import { MessageSources } from './MessageSources';
import { MessageActions } from './MessageActions';

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

interface SessionMessageProps extends PropsWithChildren {
  /**
   * Conversation to render.
   */
  conversation: Conversation;

  /**
   * Whether the message is the last one in the list.
   */
  isLast?: boolean;
}

export const SessionMessage: FC<SessionMessageProps> = ({
  conversation,
  isLast,
  children
}) => {
  const { theme, isLoading } = useContext(ChatContext);

  return (
    <motion.div key={conversation.id} variants={messageVariants}>
      <Card className={cn(theme.messages.message.base)}>
        {children || (
          <>
            <MessageFiles files={conversation.files} />
            <MessageQuestion question={conversation.question} />
            <MessageResponse
              response={conversation.response}
              isLoading={isLast && isLoading}
            />
            <MessageSources sources={conversation.sources} />
            <MessageActions
              question={conversation.question}
              response={conversation.response}
              copyIcon={<CopyIcon />}
              thumbsUpIcon={<ThumbUpIcon />}
              thumbsDownIcon={<ThumbsDownIcon />}
              refreshIcon={<RefreshIcon />}
            />
          </>
        )}
      </Card>
    </motion.div>
  );
};
