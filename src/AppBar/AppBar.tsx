import { ReactNode, FC } from 'react';
import { cn, useComponentTheme } from 'reablocks';
import { ChatTheme, chatTheme } from '../theme';

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

export const AppBar: FC<AppBarProps> = ({
  content,
  theme: customTheme = chatTheme
}) => {
  const theme = useComponentTheme<ChatTheme>('chat', customTheme);

  return <div className={cn(theme.appbar)}>{content}</div>;
};
