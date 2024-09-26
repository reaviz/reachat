import { FC } from 'react';

interface PDFFileRendererProps {
  name?: string;
  url: string;
  fileIcon?: ReactElement;
}

/**
 * Renderer for PDF files.
 */
const PDFFileRenderer: FC<PDFFileRendererProps> = ({ name, url, fileIcon }) => (
  <figure className="csv-icon flex items-center gap-2" onClick={() => window.open(url, '_blank')}>
    {fileIcon}
    {name && <figcaption className="file-name">{name}</figcaption>}
  </figure>
);

export default PDFFileRenderer;
