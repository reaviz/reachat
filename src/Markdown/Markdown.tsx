import { FC, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';
import { CodeHighlighter } from './CodeHighlighter';
import { cn } from 'reablocks';
import { TableComponent, TableHeaderCell, TableDataCell } from './Table';

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
    <ReactMarkdown
      remarkPlugins={remarkPlugins as PluggableList}
      components={{
        code: props => (
          <CodeHighlighter
            {...props}
            className="m-2 rounded"
          />
        ),
        table: props => <TableComponent {...props} className="table-auto w-full m-2" />,
        th: props => <TableHeaderCell {...props} className="px-4 py-2 text-left font-bold border-b border-gray-500" />,
        td: props => <TableDataCell {...props} className="px-4 py-2" />,
        a: props => <a {...props} className="text-blue-700 underline" />,
        p: props => <p {...props} className="mb-2" />
      }}
    >
      {children as string}
    </ReactMarkdown>
  );
};
