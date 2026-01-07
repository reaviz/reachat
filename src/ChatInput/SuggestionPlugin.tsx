import { Editor } from '@tiptap/core';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { InputPluginItem, InputTrigger, SlashCommandItem } from './types';
import { SuggestionList } from './SuggestionList';
import { ChatTheme, chatTheme as defaultTheme } from '@/theme';
import { ConnectedOverlay } from 'reablocks';
import { offset } from '@floating-ui/react';
import { createRoot, Root } from 'react-dom/client';
import { useState, useEffect, useCallback } from 'react';

export interface CreateSuggestionOptions<T extends InputPluginItem> {
  trigger: InputTrigger<T>;
  nodeName?: string;
  onSelect?: (item: T, editor: Editor) => void;
  theme?: ChatTheme;
}

interface SuggestionState<T> {
  selectedIndex: number;
  items: T[];
}

interface SuggestionOverlayProps<T extends InputPluginItem> {
  items: T[];
  selectedIndex: number;
  trigger: InputTrigger<T>;
  onSelect: (item: T) => void;
  onHover: (index: number) => void;
  onClose: () => void;
  getRect: () => DOMRect | null;
  theme: ChatTheme;
  open: boolean;
}

function SuggestionOverlay<T extends InputPluginItem>({
  items,
  selectedIndex,
  trigger,
  onSelect,
  onHover,
  onClose,
  getRect,
  theme,
  open
}: SuggestionOverlayProps<T>) {
  const [virtualRef, setVirtualRef] = useState<{
    top: number;
    left: number;
    height: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const rect = getRect();
    if (rect) {
      setVirtualRef({
        top: rect.top,
        left: rect.left,
        height: rect.height,
        width: rect.width
      });
    }
  }, [getRect]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!virtualRef) return null;

  return (
    <ConnectedOverlay
      open={open}
      reference={virtualRef}
      placement="top-start"
      modifiers={[offset(8)]}
      closeOnEscape
      closeOnBodyClick
      onClose={handleClose}
      content={() => (
        <div data-suggestion-popup="true">
          <SuggestionList
            items={items}
            selectedIndex={selectedIndex}
            trigger={trigger}
            onSelect={onSelect}
            onHover={onHover}
            theme={theme}
          />
        </div>
      )}
    />
  );
}

export function createSuggestion<T extends InputPluginItem>(
  options: CreateSuggestionOptions<T>
): Omit<SuggestionOptions<T>, 'editor'> {
  const { trigger, nodeName, onSelect, theme = defaultTheme } = options;
  const isSlashCommand = trigger.trigger === '/';

  return {
    char: trigger.trigger,
    allowSpaces: false,
    startOfLine: false,

    items: async ({ query }): Promise<T[]> => {
      const minLength = trigger.minQueryLength ?? 0;
      if (query.length < minLength) {
        return trigger.items?.slice(0, trigger.maxResults ?? 10) || [];
      }

      if (trigger.onSearch) {
        const results = await trigger.onSearch(query);
        return results.slice(0, trigger.maxResults ?? 10);
      }

      const lowerQuery = query.toLowerCase();
      return (trigger.items || [])
        .filter(
          item =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, trigger.maxResults ?? 10);
    },

    command: ({ editor, range, props: item }) => {
      if (isSlashCommand) {
        editor.chain().focus().deleteRange(range).run();

        const slashItem = item as unknown as SlashCommandItem;
        if (slashItem.value) {
          editor.commands.insertContent(slashItem.value);
        }

        onSelect?.(item, editor);
      } else {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent([
            {
              type: nodeName || 'mention',
              attrs: {
                id: item.id,
                label: item.label
              }
            },
            { type: 'text', text: ' ' }
          ])
          .run();

        onSelect?.(item, editor);
      }
    },

    render: () => {
      let root: Root | null = null;
      let container: HTMLDivElement | null = null;
      let state: SuggestionState<T> = { selectedIndex: 0, items: [] };
      let currentCommand: ((item: T) => void) | null = null;
      let getRect: (() => DOMRect | null) | null = null;
      let isOpen = false;

      const renderOverlay = () => {
        if (!root || !getRect) return;

        root.render(
          <SuggestionOverlay
            items={state.items}
            selectedIndex={state.selectedIndex}
            trigger={trigger}
            onSelect={(item: T) => currentCommand?.(item)}
            onHover={(index: number) => {
              state.selectedIndex = index;
              renderOverlay();
            }}
            onClose={() => cleanup()}
            getRect={getRect}
            theme={theme}
            open={isOpen}
          />
        );
      };

      const cleanup = () => {
        isOpen = false;
        renderOverlay();
        setTimeout(() => {
          root?.unmount();
          container?.remove();
          root = null;
          container = null;
          getRect = null;
        }, 100);
      };

      return {
        onStart: (props: SuggestionProps<T>) => {
          state = { selectedIndex: 0, items: props.items };
          currentCommand = props.command;
          getRect = props.clientRect ?? null;
          isOpen = true;

          container = document.createElement('div');
          document.body.appendChild(container);
          root = createRoot(container);

          renderOverlay();
        },

        onUpdate(props: SuggestionProps<T>) {
          state = { selectedIndex: 0, items: props.items };
          currentCommand = props.command;
          getRect = props.clientRect ?? null;

          renderOverlay();
        },

        onKeyDown(props: { event: KeyboardEvent }) {
          const { event } = props;

          if (event.key === 'Escape') {
            cleanup();
            return true;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            state.selectedIndex =
              (state.selectedIndex + state.items.length - 1) %
              state.items.length;
            renderOverlay();
            return true;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            state.selectedIndex =
              (state.selectedIndex + 1) % state.items.length;
            renderOverlay();
            return true;
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            const item = state.items[state.selectedIndex];
            if (item && currentCommand) {
              currentCommand(item);
            }
            return true;
          }

          return false;
        },

        onExit() {
          cleanup();
        }
      };
    }
  };
}
