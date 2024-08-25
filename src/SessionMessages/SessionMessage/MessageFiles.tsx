import { ChatContext } from '@/ChatContext';
import { ConversationFile } from '@/types';
import { cn } from 'reablocks';
import { FC, PropsWithChildren, useContext, useState } from 'react';
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
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!files || files.length === 0) {
    return null;
  }

  // Filter image files
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  const otherFiles = files.filter(file => !file.type.startsWith('image/'));

  return (
    <>
      {imageFiles.length > 3 ? (
        <div className={cn(theme.messages.message.files.base, expanded ? '' : 'masonry-grid')}>
          {imageFiles.slice(0, expanded ? imageFiles.length : 3).map((file, index) => (
            expanded ? (
              <Comp key={index} {...file}>
                {children}
              </Comp>
            ) : (
              <figure
                key={index}
                className={index === 0 ? "grid-item-large" : "grid-item-small"}
              >
                <img src={file.url} alt={file.name} className="masonry-item" />
                {index === 2 && imageFiles.length > 3 && !expanded && (
                  <div className="masonry-button-overlay" onClick={() => setExpanded(true)}>
                    +{imageFiles.length - 3}
                  </div>
                )}
              </figure>
            )
          ))}
        </div>
      ) : (
        <div className={cn(theme.messages.message.files.base)}>
          {imageFiles.map((file, index) => (
            <Comp key={index} {...file}>
              {children}
            </Comp>
          ))}
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className={cn(theme.messages.message.files.base)}>
          {otherFiles.map((file, index) => (
            <Comp key={index} {...file}>
              {children}
            </Comp>
          ))}
        </div>
      )}
    </>
  );
};
