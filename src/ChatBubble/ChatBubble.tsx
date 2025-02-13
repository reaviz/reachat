import {
  ReactNode,
  CSSProperties,
  useCallback,
  useMemo,
  memo,
  useState,
  useRef,
  useEffect
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from 'reablocks';
import { motion, AnimatePresence } from 'motion/react';

export type Position =
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left'
  | 'top-right';

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
   * @default 'bottom-left'
   */
  position?: Position;

  /**
   * Custom CSS styles to override the default positioning.
   */
  customPosition?: CSSProperties;

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

const defaultPositions: Record<Position, string> = {
  'bottom-left': 'bottom-5 left-5',
  'bottom-right': 'bottom-5 right-5',
  'top-left': 'top-5 left-5',
  'top-right': 'top-5 right-5'
};

export const ChatBubble = memo<ChatBubbleProps>(
  ({
    children,
    bubbleContent,
    position = 'bottom-left',
    customPosition,
    portalTarget = typeof document !== 'undefined' ? document.body : null,
    className
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [bubbleRect, setBubbleRect] = useState<DOMRect | null>(null);

    useEffect(() => {
      if (bubbleRef.current) {
        setBubbleRect(bubbleRef.current.getBoundingClientRect());
      }
    }, [isOpen]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
      setIsOpen(prev => !prev);
    }, []);

    const getContentPosition = () => {
      if (!bubbleRect) return {};

      const positions: Record<Position, CSSProperties> = {
        'bottom-left': {
          bottom: `calc(100vh - ${bubbleRect.top}px)`,
          left: `${bubbleRect.right}px`
        },
        'bottom-right': {
          bottom: `calc(100vh - ${bubbleRect.top}px)`,
          right: `calc(100vw - ${bubbleRect.left}px)`
        },
        'top-left': {
          top: `${bubbleRect.bottom}px`,
          left: `${bubbleRect.right}px`
        },
        'top-right': {
          top: `${bubbleRect.bottom}px`,
          right: `calc(100vw - ${bubbleRect.left}px)`
        }
      };

      return positions[position];
    };

    const content = useMemo(
      () => (
        <>
          <div
            ref={bubbleRef}
            style={{
              ...customPosition,
              ...(portalTarget ? { position: 'absolute' } : {})
            }}
            onClick={handleToggle}
            className={cn(
              'z-[1000]',
              !portalTarget && 'fixed',
              defaultPositions[position],
              'cursor-pointer',
              className
            )}
            role="button"
            tabIndex={0}
            aria-label="Open chat"
          >
            {bubbleContent}
          </div>
          <AnimatePresence>
            {children && isOpen && bubbleRect && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[998]"
                  onClick={handleClose}
                />
                <motion.div
                  ref={contentRef}
                  initial={false}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    pointerEvents: 'auto'
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: position.includes('right') ? 20 : -20,
                    pointerEvents: 'none'
                  }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className={cn(
                    'fixed z-[999]',
                    position.includes('right') ? 'origin-right' : 'origin-left',
                    position.includes('top') ? 'origin-top' : 'origin-bottom'
                  )}
                  style={getContentPosition()}
                >
                  {children}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      ),
      [
        children,
        customPosition,
        portalTarget,
        position,
        className,
        bubbleContent,
        isOpen,
        handleClose,
        handleToggle,
        bubbleRect
      ]
    );

    if (!portalTarget) {
      return content;
    }

    try {
      return createPortal(content, portalTarget);
    } catch (error) {
      console.error('Failed to create portal for ChatBubble:', error);
      return content;
    }
  }
);
