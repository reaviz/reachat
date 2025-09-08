import { FC, useContext } from 'react';
import { cn, List, ListItem } from 'reablocks';
import { CommandDropdownProps } from './types';
import { ChatContext } from '@/ChatContext';

export const CommandDropdown: FC<CommandDropdownProps> = ({
  commands,
  selectedIndex,
  noCommandsMessage = 'No commands found',
  onSelect
}) => {
  const { theme } = useContext(ChatContext);

  return (
    <List className={cn(theme.input.commands?.dropdown)}>
      {commands.length === 0 && (
        <ListItem className={cn(theme.input.commands?.item)}>
          <div className={cn(theme.input.commands?.empty)}>
            {noCommandsMessage}
          </div>
        </ListItem>
      )}
      {commands.map((command, index) => (
        <ListItem
          key={command.id}
          className={cn(theme.input.commands?.item, {
            [theme.input.commands?.itemSelected]: index === selectedIndex
          })}
          start={'icon' in command && command.icon && command.icon}
          onClick={() => onSelect(command)}
        >
          <div className="flex-1">
            <div className={cn(theme.input.commands?.label)}>
              /{command.label}
            </div>
            {'description' in command && command.description && (
              <div className={cn(theme.input.commands?.description)}>
                {command.description}
              </div>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
};
