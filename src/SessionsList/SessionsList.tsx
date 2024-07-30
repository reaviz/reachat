import { FC, PropsWithChildren, useContext } from 'react';
import { List, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';

export const SessionsList: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useContext(ChatContext);

  return <List className={cn(theme.sessions.base)}>{children}</List>;
};
