import { FC, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn, List, ListItem, ListHeader, Kbd } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { SlashCommand, SlashCommandMenuProps } from './types';

/**
 * Groups commands by their category.
 */
const groupCommandsByCategory = (
  commands: SlashCommand[]
): Map<string, SlashCommand[]> => {
  const groups = new Map<string, SlashCommand[]>();

  commands.forEach(command => {
    const category = command.category || 'Commands';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(command);
  });

  return groups;
};

/**
 * Filters commands based on the search filter.
 */
const filterCommands = (
  commands: SlashCommand[],
  filter: string
): SlashCommand[] => {
  if (!filter) return commands;

  const lowerFilter = filter.toLowerCase();
  return commands.filter(
    cmd =>
      cmd.command.toLowerCase().includes(lowerFilter) ||
      cmd.label.toLowerCase().includes(lowerFilter) ||
      cmd.description?.toLowerCase().includes(lowerFilter)
  );
};

/**
 * SlashCommandMenu displays a list of available slash commands
 * that users can select using keyboard or mouse.
 */
export const SlashCommandMenu: FC<SlashCommandMenuProps> = ({
  commands,
  filter = '',
  activeIndex = 0,
  onSelect,
  onClose,
  renderCommand,
  className,
  maxHeight = 300,
  showDescriptions = true,
  groupByCategory = true,
  emptyContent
}) => {
  const { theme } = useContext(ChatContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Filter commands based on search
  const filteredCommands = useMemo(
    () => filterCommands(commands, filter),
    [commands, filter]
  );

  // Group commands if enabled
  const groupedCommands = useMemo(() => {
    if (!groupByCategory) {
      return new Map([['Commands', filteredCommands]]);
    }
    return groupCommandsByCategory(filteredCommands);
  }, [filteredCommands, groupByCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const handleSelect = useCallback(
    (command: SlashCommand) => {
      if (!command.disabled) {
        onSelect?.(command);
      }
    },
    [onSelect]
  );

  const slashCommandTheme = theme?.input?.slashCommand;

  if (filteredCommands.length === 0) {
    return (
      <List
        ref={menuRef}
        role="listbox"
        aria-label="Slash commands"
        className={cn(
          'rounded-lg border shadow-lg overflow-hidden min-w-[220px]',
          'bg-white dark:bg-gray-900',
          'border-gray-200 dark:border-gray-700',
          slashCommandTheme?.menu,
          className
        )}
      >
        <div
          className={cn(
            'p-4 text-center text-gray-500 dark:text-gray-400',
            slashCommandTheme?.empty
          )}
        >
          {emptyContent || 'No commands found'}
        </div>
      </List>
    );
  }

  let currentFlatIndex = 0;

  return (
    <List
      ref={menuRef}
      role="listbox"
      aria-label="Slash commands"
      className={cn(
        'rounded-lg border shadow-lg overflow-hidden min-w-[220px]',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
        slashCommandTheme?.menu,
        className
      )}
      style={{ maxHeight, overflowY: 'auto' }}
    >
      {Array.from(groupedCommands.entries()).map(
        ([category, categoryCommands]) => (
          <div key={category}>
            {groupByCategory && groupedCommands.size > 1 && (
              <ListHeader
                className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  'text-gray-500 dark:text-gray-400',
                  'bg-gray-50 dark:bg-gray-800/50',
                  'border-b border-gray-200 dark:border-gray-700',
                  slashCommandTheme?.category
                )}
              >
                {category}
              </ListHeader>
            )}
            {categoryCommands.map(command => {
              const flatIndex = currentFlatIndex++;
              const isActive = flatIndex === activeIndex;

              if (renderCommand) {
                return (
                  <div
                    key={command.id}
                    ref={isActive ? activeItemRef : undefined}
                    onClick={() => handleSelect(command)}
                  >
                    {renderCommand(command, isActive)}
                  </div>
                );
              }

              return (
                <ListItem
                  key={command.id}
                  ref={isActive ? activeItemRef : undefined}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={command.disabled}
                  active={isActive}
                  disabled={command.disabled}
                  dense
                  className={cn(
                    'cursor-pointer transition-colors duration-100',
                    slashCommandTheme?.item?.base,
                    isActive && slashCommandTheme?.item?.active,
                    command.disabled && slashCommandTheme?.item?.disabled
                  )}
                  onClick={() => handleSelect(command)}
                  start={
                    command.icon && (
                      <div
                        className={cn(
                          'w-5 h-5 flex items-center justify-center',
                          'text-gray-400 dark:text-gray-500',
                          '[&>svg]:w-full [&>svg]:h-full',
                          slashCommandTheme?.icon
                        )}
                      >
                        {command.icon}
                      </div>
                    )
                  }
                  end={
                    command.shortcut && (
                      <Kbd
                        keycode={command.shortcut}
                        className={slashCommandTheme?.shortcut}
                      />
                    )
                  }
                >
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        'font-medium text-sm block',
                        'text-gray-900 dark:text-gray-100',
                        slashCommandTheme?.label
                      )}
                    >
                      /{command.command}
                    </span>
                    {showDescriptions && command.description && (
                      <p
                        className={cn(
                          'text-xs truncate',
                          'text-gray-500 dark:text-gray-400',
                          slashCommandTheme?.description
                        )}
                      >
                        {command.description}
                      </p>
                    )}
                  </div>
                </ListItem>
              );
            })}
          </div>
        )
      )}
    </List>
  );
};
