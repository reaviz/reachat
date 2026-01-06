import React, { FC, useContext } from 'react';
import { ChatContext } from '@/ChatContext';

export interface ChartErrorProps {
  /**
   * The visual style variant of the error display.
   * Defaults to 'error'.
   */
  variant?: 'error' | 'warning';

  /**
   * The heading text displayed at the top of the error.
   */
  title?: string;

  /**
   * The descriptive message explaining the error or warning.
   */
  message?: string;

  /**
   * The raw code or data that caused the error, displayed in a code block.
   */
  code?: string;
}

export const ChartError: FC<ChartErrorProps> = ({
  variant = 'error',
  title,
  message,
  code
}) => {
  const { theme } = useContext(ChatContext);
  const styles =
    variant === 'warning' ? theme.chart.warning : theme.chart.error;

  return (
    <div className={styles.base}>
      {title && <div className={styles.title}>{title}</div>}
      {message && <div>{message}</div>}
      {code && 'code' in styles && (
        <pre className={styles.code as string}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};
