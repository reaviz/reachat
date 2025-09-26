import { cn } from 'reablocks';
import type { FC, ReactNode } from 'react';

import type { ChatTheme } from '@/theme';
import { chatTheme } from '@/theme';

export interface AppBarProps {
  /**
   * Content to display in the header
   */
  content?: ReactNode;

  /**
   * Custom theme for the appbar
   */
  theme?: ChatTheme;
}

export const AppBar: FC<AppBarProps> = ({ content, theme = chatTheme }) => {
  return <div className={cn(theme.appbar)}>{content}</div>;
};
