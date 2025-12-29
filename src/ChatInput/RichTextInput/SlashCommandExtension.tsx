import { Extension } from '@tiptap/core';
import Suggestion, {
  SuggestionProps,
  SuggestionKeyDownProps
} from '@tiptap/suggestion';
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
import { cn, List, ListItem, Kbd } from 'reablocks';
import { SlashCommand } from '../SlashCommand';
import { getCursorRect } from './utils';

export interface SlashCommandListProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

export interface SlashCommandListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

export const SlashCommandList = forwardRef<
  SlashCommandListRef,
  SlashCommandListProps
>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item && !item.disabled) {
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
        setSelectedIndex(prev => {
          let newIndex = prev - 1;
          if (newIndex < 0) newIndex = items.length - 1;
          // Skip disabled items
          while (items[newIndex]?.disabled && newIndex !== prev) {
            newIndex = newIndex - 1;
            if (newIndex < 0) newIndex = items.length - 1;
          }
          return newIndex;
        });
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex(prev => {
          let newIndex = prev + 1;
          if (newIndex >= items.length) newIndex = 0;
          // Skip disabled items
          while (items[newIndex]?.disabled && newIndex !== prev) {
            newIndex = newIndex + 1;
            if (newIndex >= items.length) newIndex = 0;
          }
          return newIndex;
        });
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

  if (items.length === 0) {
    return null;
  }

  return (
    <List
      role="listbox"
      aria-label="Slash commands"
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
          aria-disabled={item.disabled}
          active={index === selectedIndex}
          disabled={item.disabled}
          dense
          className="cursor-pointer"
          onClick={() => selectItem(index)}
          start={
            item.icon && (
              <div className="w-5 h-5 flex items-center justify-center text-gray-500 dark:text-gray-400 [&>svg]:w-full [&>svg]:h-full">
                {item.icon}
              </div>
            )
          }
          end={item.shortcut && <Kbd keycode={item.shortcut} />}
        >
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm block text-gray-900 dark:text-gray-100">
              /{item.command}
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
});

SlashCommandList.displayName = 'SlashCommandList';

export interface CreateSlashCommandExtensionOptions {
  commands: SlashCommand[];
  onSelect?: (command: SlashCommand) => void;
}

export const createSlashCommandExtension = ({
  commands,
  onSelect
}: CreateSlashCommandExtensionOptions) => {
  return Extension.create({
    name: 'slashCommand',

    addOptions() {
      return {
        suggestion: {
          char: '/',
          startOfLine: true,
          command: ({
            editor,
            range,
            props
          }: {
            editor: any;
            range: any;
            props: SlashCommand;
          }) => {
            // Delete the slash and filter text
            editor.chain().focus().deleteRange(range).run();

            // Call the onSelect callback
            onSelect?.(props);
          }
        } as Partial<SuggestionProps<SlashCommand>>
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion<SlashCommand>({
          editor: this.editor,
          ...this.options.suggestion,
          items: ({ query }: { query: string }) => {
            const lowerQuery = query.toLowerCase();
            return commands.filter(
              cmd =>
                cmd.command.toLowerCase().includes(lowerQuery) ||
                cmd.label.toLowerCase().includes(lowerQuery) ||
                cmd.description?.toLowerCase().includes(lowerQuery)
            );
          },
          render: () => {
            let component: ReactRenderer<SlashCommandListRef> | null = null;
            let popup: TippyInstance<TippyProps>[] | null = null;

            return {
              onStart: (props: SuggestionProps<SlashCommand>) => {
                component = new ReactRenderer(SlashCommandList, {
                  props,
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

              onUpdate: (props: SuggestionProps<SlashCommand>) => {
                component?.updateProps(props);

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
        })
      ];
    }
  });
};
