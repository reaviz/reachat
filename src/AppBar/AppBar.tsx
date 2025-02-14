import React, { ReactNode, FC, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '../ChatContext';

export interface AppBarProps {
  /**
   * Content to display in the header
   */
  content?: ReactNode;
}

export const AppBar: FC<AppBarProps> = ({ content }) => {
  const { theme } = useContext(ChatContext);

  return <div className={cn(theme?.header)}>{content}</div>;
};
