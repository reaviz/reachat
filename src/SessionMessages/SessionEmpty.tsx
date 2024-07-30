import { FC, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { cn } from 'reablocks';

interface SessionEmptyProps extends PropsWithChildren {
}

export const SessionEmpty: FC<SessionEmptyProps> = ({
  children
}) => {
  const { theme } = useContext(ChatContext);
  return <div className={cn(theme.empty)}>{children}</div>;
};
