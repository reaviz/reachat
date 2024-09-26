import { FC } from 'react';

interface ImageFileRendererProps {
  name?: string;
  url: string;
}

/**
 * Renderer for image files.
 */
const ImageFileRenderer: FC<ImageFileRendererProps> = ({ url }) => (
  <img src={url} alt="Image" className="h-10 w-10" />
);

export default ImageFileRenderer;
