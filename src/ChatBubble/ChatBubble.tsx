import { ConnectedOverlay, Modifiers, Placement } from 'reablocks';
import { memo, ReactNode, useRef, useState } from 'react';

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
   */
  modifiers?: Modifiers;

  /**
   * The DOM element where the chat bubble should be rendered.
   * @default document.body
   */
  portalTarget?: HTMLElement | null;

  /**
   * Additional CSS classes to apply to the chat bubble.
   */
  className?: string;
}

export const ChatBubble = memo<ChatBubbleProps>(
  ({
    children,
    bubbleContent,
    position = 'right-end',
    modifiers,
    className
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>();

    return (
      <>
        <ConnectedOverlay
          placement={position}
          modifiers={modifiers}
          reference={ref.current}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          content={() => <>{children}</>}
        />
        <div
          ref={ref}
          className={className}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {bubbleContent}
        </div>
      </>
    );
  }
);
