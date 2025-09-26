import type { FC, ReactElement } from 'react';

interface PDFFileRendererProps {
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
 * Renderer for PDF files.
 */
const PDFFileRenderer: FC<PDFFileRendererProps> = ({ name, url, fileIcon }) => (
  <figure
    className="csv-icon flex items-center gap-2"
    onClick={() => window.open(url, '_blank')}
  >
    {fileIcon}
    {name && <figcaption className="file-name">{name}</figcaption>}
  </figure>
);

export default PDFFileRenderer;
