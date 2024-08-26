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

  // Group image and other files
  const { imageFiles, otherFiles } = files.reduce((acc, file) => {
    if (file.type.startsWith('image/')) {
      acc.imageFiles.push(file);
    } else {
      acc.otherFiles.push(file);
    }

    return acc;
  }, { imageFiles: [] as ConversationFile[], otherFiles: [] as ConversationFile[] })

  return (
    <>
      {imageFiles.length > 3 ? (
        <div className={cn(theme.messages.message.files.base, expanded ? '' : 'grid grid-cols-3 gap-2 w-1/2')}>
          {imageFiles.slice(0, expanded ? imageFiles.length : 3).map((file, index) => (
            expanded ? (
              <Comp key={index} {...file}>
                {children}
              </Comp>
            ) : (
              <figure
                key={index}
                className={index === 0 ? "col-span-2 row-span-2" : "relative"}
              >
                <img src={file.url} alt={file.name} className="relative w-full h-full object-cover rounded-lg" />
                {index === 2 && imageFiles.length > 3 && !expanded && (
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-lg cursor-pointer" onClick={() => setExpanded(true)}>
                    +{(imageFiles.length - 3).toLocaleString()}
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
