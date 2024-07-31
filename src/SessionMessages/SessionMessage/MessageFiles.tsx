import { ChatContext } from '@/ChatContext';
import { ConversationFile } from '@/types';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { MessageFile } from './MessageFile';
import { Slot } from '@radix-ui/react-slot';

interface MessageFilesProps extends PropsWithChildren {
  /**
   * Files to render.
   */
  files: ConversationFile[];
}

export const MessageFiles: FC<MessageFilesProps> = ({ files, children }) => {
  const { theme } = useContext(ChatContext);
  const Comp = children ? Slot : MessageFile;

  if (!files || files.length === 0) {
    return null;
  }

  return (
    files.length > 0 && (
      <div className={cn(theme.messages.message.files.base)}>
        {files.map((file, index) => (
          <Comp key={index} {...file}>
            {children}
          </Comp>
        ))}
      </div>
    )
  );
};
