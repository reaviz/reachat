import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { Button, cn } from 'reablocks';
import { FC, PropsWithChildren, useContext, useState } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';
import { MessageFiles } from './MessageFiles';
import { ConversationFile } from '@/types';

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
  question,
  files,
  children
}) => {
  const { theme, remarkPlugins } =
    useContext(ChatContext);
  const Comp = children ? Slot : 'div';
  const [expanded, setExpanded] = useState(false);
  const isLong = question.length > 500;

  return (
    <Comp className={cn(theme.messages.message.question, {
      [theme.messages.message.overlay]: isLong && !expanded
    })}>
      <MessageFiles files={files} />
      {children || (
        <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
          {question}
        </Markdown>
      )}
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
    </Comp>
  );
};

