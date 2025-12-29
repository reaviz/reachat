import MentionExtension from '@tiptap/extension-mention';
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, {
  Instance as TippyInstance,
  Props as TippyProps
} from 'tippy.js';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback
} from 'react';
import { cn } from 'reablocks';
import { Mention } from '../Mentions';

export interface MentionListProps {
  items: Mention[];
  command: (item: Mention) => void;
  isLoading?: boolean;
  theme?: {
    menu?: {
      base?: string;
      item?: string;
      itemActive?: string;
      itemAvatar?: string;
      itemContent?: string;
      itemName?: string;
      itemDescription?: string;
      loading?: string;
      empty?: string;
    };
  };
}

export interface MentionListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, isLoading, theme }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) {
          command(item);
        }
      },
      [items, command]
    );

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
          return true;
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex(prev => (prev + 1) % items.length);
          return true;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          selectItem(selectedIndex);
          return true;
        }

        if (event.key === 'Escape') {
          return true;
        }

        return false;
      }
    }));

    if (isLoading) {
      return (
        <div
          className={cn(
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'p-3 min-w-[200px]',
            theme?.menu?.base
          )}
        >
          <div
            className={cn(
              'text-sm text-gray-500 dark:text-gray-400',
              theme?.menu?.loading
            )}
          >
            Loading...
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div
          className={cn(
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'p-3 min-w-[200px]',
            theme?.menu?.base
          )}
        >
          <div
            className={cn(
              'text-sm text-gray-500 dark:text-gray-400',
              theme?.menu?.empty
            )}
          >
            No results found
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
          'overflow-hidden min-w-[220px] max-h-[300px] overflow-y-auto',
          theme?.menu?.base
        )}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              index === selectedIndex && 'bg-gray-100 dark:bg-gray-700',
              theme?.menu?.item,
              index === selectedIndex && theme?.menu?.itemActive
            )}
            onClick={() => selectItem(index)}
          >
            {item.avatar &&
              (typeof item.avatar === 'string' ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  className={cn(
                    'w-8 h-8 rounded-full object-cover',
                    theme?.menu?.itemAvatar
                  )}
                />
              ) : (
                <span
                  className={cn(
                    'w-8 h-8 flex items-center justify-center',
                    theme?.menu?.itemAvatar
                  )}
                >
                  {item.avatar}
                </span>
              ))}
            <div className={cn('flex-1 min-w-0', theme?.menu?.itemContent)}>
              <div
                className={cn(
                  'font-medium text-sm text-gray-900 dark:text-gray-100',
                  theme?.menu?.itemName
                )}
              >
                {item.name}
              </div>
              {item.description && (
                <div
                  className={cn(
                    'text-xs text-gray-500 dark:text-gray-400 truncate',
                    theme?.menu?.itemDescription
                  )}
                >
                  {item.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';

export interface CreateMentionExtensionOptions {
  mentions: Mention[];
  fetchMentions?: (query: string) => Promise<Mention[]>;
  onSelect?: (mention: Mention) => void;
  theme?: MentionListProps['theme'];
}

export const createMentionExtension = ({
  mentions,
  fetchMentions,
  onSelect,
  theme
}: CreateMentionExtensionOptions) => {
  let isLoading = false;
  let cachedQuery = '';
  let cachedResults: Mention[] = mentions;

  return MentionExtension.configure({
    HTMLAttributes: {
      class: 'mention text-blue-500 dark:text-blue-400 font-medium'
    },
    suggestion: {
      char: '@',
      items: async ({ query }: { query: string }) => {
        // If we have an async fetch function, use it
        if (fetchMentions) {
          // Use cached results if query hasn't changed
          if (query === cachedQuery && cachedResults.length > 0) {
            return cachedResults;
          }

          isLoading = true;
          cachedQuery = query;

          try {
            const results = await fetchMentions(query);
            cachedResults = results;
            isLoading = false;
            return results;
          } catch {
            isLoading = false;
            return [];
          }
        }

        // Otherwise filter the static mentions
        const lowerQuery = query.toLowerCase();
        return mentions.filter(
          m =>
            m.name.toLowerCase().includes(lowerQuery) ||
            m.description?.toLowerCase().includes(lowerQuery)
        );
      },
      command: ({
        editor,
        range,
        props
      }: {
        editor: any;
        range: any;
        props: Mention;
      }) => {
        // Insert the mention node
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              type: 'mention',
              attrs: {
                id: props.id,
                label: props.name
              }
            },
            { type: 'text', text: ' ' }
          ])
          .run();

        // Call the onSelect callback
        onSelect?.(props);
      },
      render: () => {
        let component: ReactRenderer<MentionListRef> | null = null;
        let popup: TippyInstance<TippyProps>[] | null = null;

        return {
          onStart: (props: SuggestionProps<Mention>) => {
            component = new ReactRenderer(MentionList, {
              props: {
                ...props,
                isLoading,
                theme
              },
              editor: props.editor
            });

            if (!props.clientRect) return;

            // Get the editor element for positioning fallback
            const editorElement = props.editor.view.dom;

            popup = tippy('body', {
              getReferenceClientRect: () => {
                const rect = props.clientRect?.();
                if (rect) return rect;
                // Fallback to editor element position
                return editorElement.getBoundingClientRect();
              },
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'top-start',
              popperOptions: {
                modifiers: [
                  {
                    name: 'flip',
                    options: {
                      fallbackPlacements: [
                        'bottom-start',
                        'top-end',
                        'bottom-end'
                      ]
                    }
                  },
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: 'viewport',
                      padding: 8
                    }
                  }
                ]
              }
            });
          },

          onUpdate: (props: SuggestionProps<Mention>) => {
            component?.updateProps({
              ...props,
              isLoading,
              theme
            });

            if (!props.clientRect) return;

            const editorElement = props.editor.view.dom;

            popup?.[0]?.setProps({
              getReferenceClientRect: () => {
                const rect = props.clientRect?.();
                if (rect) return rect;
                return editorElement.getBoundingClientRect();
              }
            });
          },

          onKeyDown: (props: SuggestionKeyDownProps) => {
            if (props.event.key === 'Escape') {
              popup?.[0]?.hide();
              return true;
            }

            return component?.ref?.onKeyDown(props) ?? false;
          },

          onExit: () => {
            popup?.[0]?.destroy();
            component?.destroy();
          }
        };
      }
    }
  });
};
