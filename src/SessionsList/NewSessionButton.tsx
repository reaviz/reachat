import { Button, cn } from 'reablocks';
import { FC, PropsWithChildren, useContext } from 'react';
import { SessionsContext } from '@/SessionsContext';
import { Slot } from '@radix-ui/react-slot';

interface NewSessionButtonProps extends PropsWithChildren {
  asChild?: boolean;
  newSessionText?: string;
}

export const NewSessionButton: FC<NewSessionButtonProps> = ({
  children,
  asChild,
  newSessionText = 'New Session'
}) => {
  const { theme, createSession } = useContext(SessionsContext);
  const Comp = asChild ? Slot : Button;
  return (
    <Comp
      fullWidth
      disableMargins
      color="primary"
      className={cn(theme.sessions.create)}
      onClick={createSession}
    >
      {asChild ? children : newSessionText}
    </Comp>
  );
};
