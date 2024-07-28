import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { SessionsContext } from '@/SessionsContext';
import { cn } from 'reablocks';

interface SessionEmptyProps extends PropsWithChildren {
}

export const SessionEmpty: FC<SessionEmptyProps> = ({
  children
}) => {
  const { theme } = useContext(SessionsContext);
  return <div className={cn(theme.empty)}>{children}</div>;
};
