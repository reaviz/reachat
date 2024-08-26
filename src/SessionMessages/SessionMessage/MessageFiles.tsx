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
  const { imageFiles, otherFiles } = files.reduce(
    (acc, file) => {
      if (file.type.startsWith('image/')) {
        acc.imageFiles.push(file);
      } else {
        acc.otherFiles.push(file);
      }

      return acc;
    },
    {
      imageFiles: [] as ConversationFile[],
      otherFiles: [] as ConversationFile[]
    }
  );

  // Renders the image files based on the current expansion state
  const renderImageFiles = (images: ConversationFile[]) => {
    return !expanded && imageFiles.length > 3
      ? images.slice(0, 3).map((image, index) => (
          <figure
            key={index}
            className={index === 0 ? 'col-span-2 row-span-2' : 'relative'}
          >
            <img
              src={image.url}
              alt={image.name}
              className="relative w-full h-full object-cover rounded-lg"
            />
            {index === 2 && (
              <div
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 rounded-lg cursor-pointer"
                onClick={() => setExpanded(true)}
              >
                +{(imageFiles.length - 3).toLocaleString()}
              </div>
            )}
          </figure>
        ))
      : images.map((image, index) => (
          <Comp key={index} {...image}>
            {children}
          </Comp>
        ));
  };

  return (
    <div
      className={cn(
        theme.messages.message.files.base,
        imageFiles.length < 4 || expanded ? '' : 'grid grid-cols-3 gap-2 w-1/2'
      )}
    >
      {imageFiles.length > 0 && renderImageFiles(imageFiles)}

      {otherFiles.length > 0 &&
        otherFiles.map((file, index) => (
          <Comp key={index} {...file}>
            {children}
          </Comp>
        ))}
    </div>
  );
};
