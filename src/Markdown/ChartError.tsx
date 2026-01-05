import React, { FC, useContext } from 'react';
import { ChatContext } from '@/ChatContext';

export interface ChartErrorProps {
  variant?: 'error' | 'warning';
  title?: string;
  message?: string;
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
        <pre className={styles.code}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};
