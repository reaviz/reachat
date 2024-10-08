import { FC, useContext, ReactElement } from 'react';
import { ConversationFile } from '@/types';
import { ChatContext } from '@/ChatContext';
import { Ellipsis, cn } from 'reablocks';
import FileIcon from '@/assets/file.svg?react';

export interface MessageFileProps extends ConversationFile {
  /**
   * Icon to show for delete.
   */
  fileIcon?: ReactElement;

  /**
   * Limit for the name.
   */
  limit?: number;
}

export const MessageFile: FC<MessageFileProps> = ({
  name,
  type,
  url,
  limit = 100,
  fileIcon = <FileIcon />
}) => {
  const { theme } = useContext(ChatContext);
  const isImage = type?.startsWith('image/');

  return (
    <figure
      className={cn(theme.messages.message.files.file.base)}
      onClick={() => {
        window.open(url, '_blank');
      }}
    >
      {isImage ? (
        <>
          <img src={url} className="h-10 w-10" />
        </>
      ) : (
        <>
          {fileIcon}
        </>
      )}
      {name && (
        <figcaption>
          {name && (
            <span className={cn(theme.messages.message.files.file.name)}>
              <Ellipsis value={name} limit={limit} />
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
