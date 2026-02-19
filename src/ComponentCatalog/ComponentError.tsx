import { FC, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import type { ComponentCatalogError } from './types';

export interface ComponentErrorProps {
  /**
   * The error descriptor from validation.
   */
  error: ComponentCatalogError;
}

export const ComponentError: FC<ComponentErrorProps> = ({ error }) => {
  const { theme } = useContext(ChatContext);

  return (
    <div className={theme.component?.error?.base}>
      <div className={theme.component?.error?.title}>
        {error.type === 'unknown_component'
          ? 'Unknown Component'
          : error.type === 'invalid_props'
            ? 'Invalid Props'
            : error.type === 'render_error'
              ? 'Render Error'
              : 'Invalid Component'}
      </div>
      <div className={theme.component?.error?.message}>{error.message}</div>
      {error.issues && error.issues.length > 0 && (
        <ul className={theme.component?.error?.issues}>
          {error.issues.map((issue, i) => (
            <li key={i}>
              {issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''}
              {issue.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
