import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useContext
} from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal
} from '@floating-ui/react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { TriggerOption } from '@/types';

export interface TriggerMenuProps {
  /**
   * List of options to display
   */
  options: TriggerOption[];

  /**
   * Whether options are currently loading
   */
  isLoading?: boolean;

  /**
   * Text to show when loading
   */
  loadingText?: string;

  /**
   * Text to show when no results found
   */
  noResultsText?: string;

  /**
   * Callback when an option is selected
   */
  onSelect: (option: TriggerOption) => void;

  /**
   * The query string for highlighting/filtering
   */
  query?: string;

  /**
   * Reference element to position the menu relative to
   */
  referenceElement?: HTMLElement | null;
}

export interface TriggerMenuRef {
  /**
   * Handle keyboard navigation
   */
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const TriggerMenu = forwardRef<TriggerMenuRef, TriggerMenuProps>(
  (
    {
      options,
      isLoading = false,
      loadingText = 'Loading...',
      noResultsText = 'No results found',
      onSelect,
      query = '',
      referenceElement
    },
    ref
  ) => {
    const { theme } = useContext(ChatContext);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { refs, floatingStyles } = useFloating({
      placement: 'top-start',
      middleware: [offset(8), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate,
      elements: {
        reference: referenceElement
      }
    });

    useEffect(() => {
      setSelectedIndex(0);
    }, [options, query]);

    const selectOption = useCallback(
      (index: number) => {
        const option = options[index];
        if (option) {
          onSelect(option);
        }
      },
      [options, onSelect]
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(prev => (prev <= 0 ? options.length - 1 : prev - 1));
          return true;
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex(prev => (prev >= options.length - 1 ? 0 : prev + 1));
          return true;
        }

        if (event.key === 'Enter') {
          selectOption(selectedIndex);
          return true;
        }

        if (event.key === 'Escape') {
          return true;
        }

        return false;
      }
    }));

    const handleItemClick = (index: number) => {
      selectOption(index);
    };

    return (
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={cn(theme.input.trigger.base)}
          role="listbox"
          aria-label="Suggestions"
        >
          {isLoading ? (
            <div className={cn(theme.input.trigger.loading)} role="status">
              {loadingText}
            </div>
          ) : options.length === 0 ? (
            <div className={cn(theme.input.trigger.empty)} role="status">
              {noResultsText}
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={cn(
                  theme.input.trigger.item.base,
                  index === selectedIndex && theme.input.trigger.item.active
                )}
                onClick={() => handleItemClick(index)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className={cn(theme.input.trigger.item.label)}>
                  {option.label}
                </span>
                {option.description && (
                  <span className={cn(theme.input.trigger.item.description)}>
                    {option.description}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </FloatingPortal>
    );
  }
);

TriggerMenu.displayName = 'TriggerMenu';
