import { Menu, MenuProps } from 'reablocks';
import { FC, ReactNode, RefObject, useEffect, useState } from 'react';

export interface QuickActionsRef {
  close: () => void;
}

interface QuickActionsProps extends MenuProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  trigger: string;
  className?: string;
  children: ReactNode | ((args: QuickActionsRef) => ReactNode);
}

export const QuickActions: FC<QuickActionsProps> = ({
  children,
  inputRef,
  trigger,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const inputEl = inputRef?.current;
    if (!inputEl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === trigger) {
        setOpen(true);
      }
    };

    inputEl.addEventListener('keydown', handleKeyDown);

    return () => {
      inputEl.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Menu
      placement="top-start"
      reference={inputRef}
      open={open}
      onClose={() => setOpen(false)}
      {...rest}
    >
      {() =>
        typeof children === 'function'
          ? children({ close: () => setOpen(false) })
          : children
      }
    </Menu>
  );
};
