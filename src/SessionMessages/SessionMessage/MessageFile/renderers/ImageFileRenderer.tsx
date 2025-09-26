import type { FC } from 'react';

interface ImageFileRendererProps {
  /**
   * Name of the file.
   */
  name?: string;

  /**
   * URL of the file.
   */
  url: string;
}

/**
 * Renderer for image files.
 */
const ImageFileRenderer: FC<ImageFileRendererProps> = ({ url }) => (
  <img src={url} alt="Image" className="size-10" />
);

export default ImageFileRenderer;
