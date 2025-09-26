import { cn } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useContext } from 'react';

import { ChatContext } from '@/ChatContext';

export const SessionEmpty: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useContext(ChatContext);
  return <div className={cn(theme.empty)}>{children}</div>;
};
