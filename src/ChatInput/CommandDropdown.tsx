import { FC, useContext } from 'react';
import { cn } from 'reablocks';
import { CommandDropdownProps } from './types';
import { CommandItem } from './CommandItem';
import { ChatContext } from '@/ChatContext';

export const CommandDropdown: FC<CommandDropdownProps> = ({
  commands,
  selectedIndex,
  onSelect
}) => {
  const { theme } = useContext(ChatContext);

  if (commands.length === 0) {
    return (
      <div
        className={cn(theme.input.commands?.dropdown)}
        role="listbox"
        id="command-listbox"
      >
        <div className={cn(theme.input.commands?.list)}>
          <div className={cn(theme.input.commands?.empty)}>
            No commands found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(theme.input.commands?.dropdown)}
      role="listbox"
      id="command-listbox"
      aria-label="Slash commands"
    >
      <div className={cn(theme.input.commands?.list)}>
        {commands.map((command, index) => (
          <CommandItem
            key={command.id}
            command={command}
            isSelected={index === selectedIndex}
            onSelect={onSelect}
            index={index}
          />
        ))}
      </div>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {commands.length} {commands.length === 1 ? 'command' : 'commands'}{' '}
        available
      </div>
    </div>
  );
};
