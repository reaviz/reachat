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
import { cn, List, ListItem, Avatar } from 'reablocks';
import { Mention } from '../Mentions';
import { getCursorRect } from './utils';

export interface MentionListProps {
  items: Mention[];
  command: (item: Mention) => void;
  isLoading?: boolean;
}

export interface MentionListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, isLoading }, ref) => {
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
        <List
          className={cn(
            'rounded-lg border shadow-lg overflow-hidden min-w-[200px]',
            'bg-white dark:bg-gray-800',
            'border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </List>
      );
    }

    if (items.length === 0) {
      return (
        <List
          className={cn(
            'rounded-lg border shadow-lg overflow-hidden min-w-[200px]',
            'bg-white dark:bg-gray-800',
            'border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
            No results found
          </div>
        </List>
      );
    }

    return (
      <List
        role="listbox"
        aria-label="Mentions"
        className={cn(
          'rounded-lg border shadow-lg overflow-hidden min-w-[220px] max-h-[300px] overflow-y-auto',
          'bg-white dark:bg-gray-800',
          'border-gray-200 dark:border-gray-700'
        )}
      >
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            role="option"
            aria-selected={index === selectedIndex}
            active={index === selectedIndex}
            dense
            className="cursor-pointer"
            onClick={() => selectItem(index)}
            start={
              item.avatar && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {typeof item.avatar === 'string' ? (
                    <Avatar src={item.avatar} name={item.name} size={32} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                      {item.avatar}
                    </div>
                  )}
                </div>
              )
            }
          >
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm block text-gray-900 dark:text-gray-100">
                {item.name}
              </span>
              {item.description && (
                <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    );
  }
);

MentionList.displayName = 'MentionList';

export interface CreateMentionExtensionOptions {
  mentions: Mention[];
  fetchMentions?: (query: string) => Promise<Mention[]>;
  onSelect?: (mention: Mention) => void;
}

export const createMentionExtension = ({
  mentions,
  fetchMentions,
  onSelect
}: CreateMentionExtensionOptions) => {
  let isLoading = false;
  let cachedQuery = '';
  let cachedResults: Mention[] = mentions;

  return MentionExtension.configure({
    HTMLAttributes: {
      class: 'mention-chip'
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
                isLoading
              },
              editor: props.editor
            });

            const editorElement = props.editor.view.dom;

            popup = tippy('body', {
              getReferenceClientRect: () => {
                // First try Tiptap's clientRect
                const tiptapRect = props.clientRect?.();
                if (tiptapRect && tiptapRect.width > 0) {
                  return tiptapRect;
                }
                // Fallback: get cursor position from editor
                try {
                  return getCursorRect(props.editor);
                } catch {
                  // Last resort: use editor element
                  return editorElement.getBoundingClientRect();
                }
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
              isLoading
            });

            const editorElement = props.editor.view.dom;

            popup?.[0]?.setProps({
              getReferenceClientRect: () => {
                const tiptapRect = props.clientRect?.();
                if (tiptapRect && tiptapRect.width > 0) {
                  return tiptapRect;
                }
                try {
                  return getCursorRect(props.editor);
                } catch {
                  return editorElement.getBoundingClientRect();
                }
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
