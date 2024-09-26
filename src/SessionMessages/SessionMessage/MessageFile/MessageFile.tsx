import { FC, useContext, ReactElement, Suspense, lazy, useMemo } from 'react';
import { ConversationFile } from '@/types';
import { ChatContext } from '@/ChatContext';
import { cn } from 'reablocks';
import FileIcon from '@/assets/file.svg?react';

const DefaultFileRenderer = lazy(() => import('./DefaultFileRenderer'));
const CSVFileRenderer = lazy(() => import('./CSVFileRenderer'));
const ImageFileRenderer = lazy(() => import('./ImageFileRenderer'));
const PDFFileRenderer = lazy(() => import('./PDFFileRenderer'));

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

/**
 * Base MessageFile component that routes to specific file renderers based on file type.
 */
export const MessageFile: FC<MessageFileProps> = ({
  name,
  type,
  url,
  limit = 100,
  fileIcon = <FileIcon />,
}) => {
  const { theme } = useContext(ChatContext);

  const fileTypeRendererMap: { [key: string]: FC<any> } = {
    'image/': ImageFileRenderer,
    'text/csv': CSVFileRenderer,
    'application/pdf': PDFFileRenderer,
  };

  const FileRenderer = useMemo(() => {
    const Renderer =
      Object.keys(fileTypeRendererMap).find((key) => type?.startsWith(key)) ??
      'default';
    return fileTypeRendererMap[Renderer] || DefaultFileRenderer;
  }, [type]);

  return (
    <div
      className={cn(theme.messages.message.files.file.base)}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <FileRenderer name={name} url={url} fileIcon={fileIcon} limit={limit} />
      </Suspense>
    </div>
  );
};
