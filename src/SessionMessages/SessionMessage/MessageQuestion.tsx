import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { Markdown } from '@/Markdown';
import { PluggableList } from 'react-markdown/lib';

export interface MessageQuestionProps extends PropsWithChildren {
  /**
   * Question to render.
   */
  question: string;
}

export const MessageQuestion: FC<MessageQuestionProps> = ({
  question,
  children
}) => {
  const { theme, remarkPlugins } =
    useContext(ChatContext);
  const Comp = children ? Slot : 'div';

  return (
    <Comp className={cn(theme.messages.message.question)}>
      {children || (
        <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
          {question}
        </Markdown>
      )}
    </Comp>
  );
};
