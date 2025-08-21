import { FC, useContext } from 'react';
import { cn } from 'reablocks';
import { CommandItemProps } from './types';
import { ChatContext } from '@/ChatContext';

export const CommandItem: FC<CommandItemProps> = ({
  command,
  isSelected,
  onSelect,
  index
}) => {
  const { theme } = useContext(ChatContext);

  const handleClick = () => {
    onSelect(command);
  };

  return (
    <div
      role="option"
      id={`command-${index}`}
      aria-selected={isSelected}
      className={cn(
        theme.input.commands?.item,
        isSelected && theme.input.commands?.itemSelected
      )}
      onClick={handleClick}
      onMouseDown={e => e.preventDefault()}
    >
      {'icon' in command && command.icon && (
        <span className={cn(theme.input.commands?.icon)}>{command.icon}</span>
      )}
      <div className="flex-1">
        <div className={cn(theme.input.commands?.label)}>/{command.label}</div>
        {'description' in command && command.description && (
          <div className={cn(theme.input.commands?.description)}>
            {command.description}
          </div>
        )}
      </div>
    </div>
  );
};
