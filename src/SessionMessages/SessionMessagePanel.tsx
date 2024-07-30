import { FC, PropsWithChildren, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';

export const SessionMessagePanel: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useContext(ChatContext);

  return (
    <div className={cn(theme.messages.base)}>
      <div className="flex-1 h-full flex flex-col">{children}</div>
    </div>
  );
};
