import { offset } from '@floating-ui/react';
import type { Modifiers, Placement } from 'reablocks';
import { ConnectedOverlay } from 'reablocks';
import type { ReactNode } from 'react';
import { memo, useCallback, useRef, useState } from 'react';

const DEFAULT_MODIFIERS: Modifiers = [offset({ mainAxis: 0, crossAxis: -40 })];

export interface ChatBubbleProps {
  /**
   * The main content to be rendered.
   */
  children: ReactNode;

  /**
   * The content to be rendered in the trigger bubble.
   */
  bubbleContent: ReactNode;

  /**
   * The position of the chat bubble on the screen.
   * @default 'right-end'
   */
  position?: Placement;

  /**
   * Custom position modifiers.
   * @default [offset({ mainAxis: 0, crossAxis: -40 })]
   */
  modifiers?: Modifiers;

  /**
   * Additional CSS classes to apply to the chat bubble.
   */
  className?: string;
}

export const ChatBubble = memo(
  ({
    children,
    bubbleContent,
    position = 'right-end',
    modifiers = DEFAULT_MODIFIERS,
    className
  }: ChatBubbleProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);
    const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
    const renderContent = useCallback(() => <>{children}</>, [children]);

    return (
      <>
        <ConnectedOverlay
          placement={position}
          modifiers={modifiers}
          reference={ref.current}
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          content={renderContent}
        />
        <div ref={ref} className={className} onClick={handleToggle}>
          {bubbleContent}
        </div>
      </>
    );
  }
);
