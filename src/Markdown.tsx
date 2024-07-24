import { FC, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';

interface MarkdownWrapperProps extends PropsWithChildren {
  /**
   * Remark plugins to apply to the markdown content.
   */
  remarkPlugins?: PluggableList[];
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins = [remarkGfm]
}) => {
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins as PluggableList}>
      {children as string}
    </ReactMarkdown>
  );
};
