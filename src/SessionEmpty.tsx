import { FC, ReactNode, useContext } from 'react';
import { SessionsContext } from './SessionsContext';
import { cn } from 'reablocks';

interface SessionEmptyProps {
  newSessionContent?: string | ReactNode;
}

export const SessionEmpty: FC<SessionEmptyProps> = ({
  newSessionContent = ''
}) => {
  const { theme } = useContext(SessionsContext);
  return <div className={cn(theme.empty)}>{newSessionContent}</div>;
};
