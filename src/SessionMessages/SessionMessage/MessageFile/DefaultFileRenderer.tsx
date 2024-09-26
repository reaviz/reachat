import { FC, ReactElement } from 'react';
import FileIcon from '@/assets/file.svg?react';
import { Ellipsis, cn } from 'reablocks';

interface DefaultFileRendererProps {
  name?: string;
  url: string;
  limit?: number;
  fileIcon?: ReactElement;
}

/**
 * Default renderer for unspecified file types.
 */
const DefaultFileRenderer: FC<DefaultFileRendererProps> = ({
  name,
  limit = 100,
  fileIcon = <FileIcon />,
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
