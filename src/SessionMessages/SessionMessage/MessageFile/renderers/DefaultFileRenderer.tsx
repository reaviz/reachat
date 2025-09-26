import { cn, Ellipsis } from 'reablocks';
import type { FC, ReactElement } from 'react';

import FileIcon from '@/assets/file.svg?react';

interface DefaultFileRendererProps {
  /**
   * Limit for the name.
   */
  limit?: number;

  /**
   * Name of the file.
   */
  name?: string;

  /**
   * URL of the file.
   */
  url: string;

  /**
   * Icon to for file type.
   */
  fileIcon?: ReactElement;
}

/**
 * Default renderer for unspecified file types.
 */
const DefaultFileRenderer: FC<DefaultFileRendererProps> = ({
  name,
  limit = 100,
  fileIcon = <FileIcon />
}) => (
  <figure className="flex items-center gap-2">
    {fileIcon}
    {name && (
      <figcaption className={cn('file-name-class')}>
        <Ellipsis value={name} limit={limit} />
      </figcaption>
    )}
  </figure>
);

export default DefaultFileRenderer;
