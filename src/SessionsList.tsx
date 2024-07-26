import { FC, PropsWithChildren, useContext } from 'react';
import { List, cn } from 'reablocks';
import { SessionsContext } from './SessionsContext';

export const SessionsList: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useContext(SessionsContext);

  return <List className={cn(theme.sessions.base)}>{children}</List>;
};
