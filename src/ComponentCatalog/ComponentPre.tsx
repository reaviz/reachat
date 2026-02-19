import React, { FC } from 'react';
import { ComponentRenderer } from './ComponentRenderer';
import { getChildText } from '@/Markdown/charts/chartHelpers';
import type { ComponentDefinitions, ComponentCatalogOptions } from './types';

export interface ComponentPreProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Creates a `pre` component override for react-markdown that intercepts
 * fenced code blocks with the configured language tag and renders them
 * via the ComponentRenderer.
 *
 * This follows the exact same pattern as ChartPre — it checks for a
 * `language-{tag}` className on the nested `<code>` element and, if
 * matched, extracts the text content and hands it off to the renderer.
 *
 * Any non-matching `<pre>` blocks are passed through as-is.
 */
export function createComponentPre(
  definitions: ComponentDefinitions,
  options?: ComponentCatalogOptions
): FC<ComponentPreProps> {
  const language = options?.language ?? 'component';
  const className = `language-${language}`;

  const ComponentPre: FC<ComponentPreProps> = ({ children, ...props }) => {
    if (children && typeof children === 'object' && 'props' in children) {
      const codeElement = children as React.ReactElement<{
        className?: string;
        children?: React.ReactNode;
      }>;

      if (codeElement.props?.className === className) {
        const codeContent = getChildText(codeElement.props?.children);

        if (codeContent) {
          return (
            <ComponentRenderer
              raw={codeContent}
              definitions={definitions}
              options={options}
            />
          );
        }
      }
    }

    return <pre {...props}>{children}</pre>;
  };

  ComponentPre.displayName = 'ComponentPre';
  return ComponentPre;
}
