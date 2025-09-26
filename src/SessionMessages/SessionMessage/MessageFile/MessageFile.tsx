import { cn } from 'reablocks';
import type { FC, ReactElement } from 'react';
import { lazy, Suspense, useContext, useMemo } from 'react';

import FileIcon from '@/assets/file.svg?react';
import { ChatContext } from '@/ChatContext';
import type { ConversationFile } from '@/types';

const DefaultFileRenderer = lazy(
  () => import('./renderers/DefaultFileRenderer')
);
const CSVFileRenderer = lazy(() => import('./renderers/CSVFileRenderer'));
const ImageFileRenderer = lazy(() => import('./renderers/ImageFileRenderer'));
const PDFFileRenderer = lazy(() => import('./renderers/PDFFileRenderer'));

const FILE_TYPE_RENDERER_MAP: { [key: string]: FC<any> } = {
  'image/': ImageFileRenderer,
  'text/csv': CSVFileRenderer,
  'application/pdf': PDFFileRenderer
};

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
  fileIcon = <FileIcon />
}) => {
  const { theme } = useContext(ChatContext);

  // Based on the file type, we will render a specific file renderer.
  const FileRenderer = useMemo(() => {
    const Renderer =
      Object.keys(FILE_TYPE_RENDERER_MAP).find(key => type?.startsWith(key)) ??
      'default';
    return FILE_TYPE_RENDERER_MAP[Renderer] || DefaultFileRenderer;
  }, [type]);

  return (
    <div className={cn(theme.messages.message.files.file.base)}>
      <Suspense fallback={<div>Loading...</div>}>
        <FileRenderer name={name} url={url} fileIcon={fileIcon} limit={limit} />
      </Suspense>
    </div>
  );
};
