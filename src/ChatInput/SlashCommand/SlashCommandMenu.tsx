import { FC, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from 'reablocks';
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

  // Flatten grouped commands for index tracking
  const flatCommands = useMemo(() => {
    const flat: SlashCommand[] = [];
    groupedCommands.forEach(cmds => {
      flat.push(...cmds);
    });
    return flat;
  }, [groupedCommands]);

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
      <div
        ref={menuRef}
        className={cn(
          'rounded-lg border shadow-lg overflow-hidden',
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
      </div>
    );
  }

  let currentFlatIndex = 0;

  return (
    <div
      ref={menuRef}
      className={cn(
        'rounded-lg border shadow-lg overflow-hidden',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
        slashCommandTheme?.menu,
        className
      )}
      style={{ maxHeight }}
    >
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {Array.from(groupedCommands.entries()).map(
          ([category, categoryCommands]) => (
            <div key={category}>
              {groupByCategory && groupedCommands.size > 1 && (
                <div
                  className={cn(
                    'px-3 py-2 text-xs font-semibold uppercase tracking-wide',
                    'text-gray-500 dark:text-gray-400',
                    'bg-gray-50 dark:bg-gray-800/50',
                    'border-b border-gray-200 dark:border-gray-700',
                    slashCommandTheme?.category
                  )}
                >
                  {category}
                </div>
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
                  <div
                    key={command.id}
                    ref={isActive ? activeItemRef : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 cursor-pointer',
                      'transition-colors duration-100',
                      {
                        'bg-blue-50 dark:bg-blue-900/30': isActive,
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50': !isActive,
                        'opacity-50 cursor-not-allowed': command.disabled
                      },
                      slashCommandTheme?.item?.base,
                      isActive && slashCommandTheme?.item?.active,
                      command.disabled && slashCommandTheme?.item?.disabled
                    )}
                    onClick={() => handleSelect(command)}
                  >
                    {command.icon && (
                      <div
                        className={cn(
                          'flex-shrink-0 w-5 h-5',
                          'text-gray-400 dark:text-gray-500',
                          '[&>svg]:w-full [&>svg]:h-full',
                          slashCommandTheme?.icon
                        )}
                      >
                        {command.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-medium text-sm',
                            'text-gray-900 dark:text-gray-100',
                            slashCommandTheme?.label
                          )}
                        >
                          /{command.command}
                        </span>
                        {command.shortcut && (
                          <span
                            className={cn(
                              'text-xs px-1.5 py-0.5 rounded',
                              'bg-gray-100 dark:bg-gray-800',
                              'text-gray-500 dark:text-gray-400',
                              slashCommandTheme?.shortcut
                            )}
                          >
                            {command.shortcut}
                          </span>
                        )}
                      </div>
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
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
