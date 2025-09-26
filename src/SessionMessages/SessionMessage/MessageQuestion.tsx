import { Slot } from '@radix-ui/react-slot';
import { Button, cn } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useContext, useState } from 'react';
import type { Plugin } from 'unified';

import { ChatContext } from '@/ChatContext';
import { Markdown } from '@/Markdown';
import type { ConversationFile } from '@/types';

import { MessageFiles } from './MessageFiles';

export interface MessageQuestionProps extends PropsWithChildren {
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
  ...props
}) => {
  const { theme, remarkPlugins } = useContext(ChatContext);
  const { question, files } = props;
  const Comp = children ? Slot : 'div';
  const [expanded, setExpanded] = useState(false);
  const isLong = question.length > 500;

  return (
    <Comp
      className={cn(theme.messages.message.question, {
        [theme.messages.message.overlay]: isLong && !expanded
      })}
      {...props}
    >
      {children || (
        <>
          <MessageFiles files={files} />
          <Markdown remarkPlugins={remarkPlugins as Plugin[]}>
            {question}
          </Markdown>
          {isLong && !expanded && (
            <Button
              variant="link"
              size="small"
              className={theme.messages.message.expand}
              onClick={() => setExpanded(true)}
            >
              Show more
            </Button>
          )}
        </>
      )}
    </Comp>
  );
};
