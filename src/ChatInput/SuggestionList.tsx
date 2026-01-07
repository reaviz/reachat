import { FC, useContext, useRef, useEffect } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { InputPluginItem, InputTrigger } from './types';
import { ChatTheme, chatTheme as defaultTheme } from '@/theme';

export interface SuggestionListProps<T extends InputPluginItem> {
  items: T[];
  selectedIndex: number;
  trigger?: InputTrigger<T>;
  onSelect: (item: T) => void;
  onHover: (index: number) => void;
  theme?: ChatTheme;
}

export const SuggestionList: FC<SuggestionListProps<InputPluginItem>> = ({
  items,
  selectedIndex,
  trigger,
  onSelect,
  onHover,
  theme: themeProp
}) => {
  const context = useContext(ChatContext);
  const theme = themeProp ?? context?.theme ?? defaultTheme;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(
        '[data-selected="true"]'
      );
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    if (trigger?.renderEmpty) {
      return (
        <div className={cn(theme.input.popup.base)}>
          <div className={cn(theme.input.popup.empty)}>
            {trigger.renderEmpty('')}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn(theme.input.popup.base)}>
      {trigger?.renderHeader && (
        <div className={cn(theme.input.popup.header)}>
          {trigger.renderHeader()}
        </div>
      )}
      <div ref={listRef} className={cn(theme.input.popup.content)}>
        {items.map((item, index) => {
          const isHighlighted = index === selectedIndex;

          if (trigger?.renderItem) {
            return (
              <div
                key={item.id}
                data-selected={isHighlighted}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onHover(index)}
              >
                {trigger.renderItem(item, isHighlighted)}
              </div>
            );
          }

          return (
            <div
              key={item.id}
              role="option"
              aria-selected={isHighlighted}
              data-selected={isHighlighted}
              className={cn(
                theme.input.popup.item,
                isHighlighted && theme.input.popup.itemHighlighted,
                'cursor-pointer'
              )}
              onClick={() => onSelect(item)}
              onMouseEnter={() => onHover(index)}
            >
              {item.icon && (
                <span className={cn(theme.input.popup.itemIcon)}>
                  {item.icon}
                </span>
              )}
              <div className={cn(theme.input.popup.itemContent)}>
                <span className={cn(theme.input.popup.itemLabel)}>
                  {item.label}
                </span>
                {item.description && (
                  <span className={cn(theme.input.popup.itemDescription)}>
                    {item.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
