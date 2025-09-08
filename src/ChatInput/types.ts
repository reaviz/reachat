import { ReactElement, RefObject } from 'react';

export interface SimpleCommand {
  id: string;
  label: string;
  value: string;
}

export interface RichCommand extends SimpleCommand {
  description?: string;
  icon?: ReactElement;
  action?: () => void;
  template?: string;
  visible?: boolean | ((context: any) => boolean);
}

export type SlashCommand = SimpleCommand | RichCommand;

export interface ChatInputProps {
  defaultValue?: string;
  allowedFiles?: string[];
  placeholder?: string;
  sendIcon?: ReactElement;
  stopIcon?: ReactElement;
  attachIcon?: ReactElement;
  commands?: SlashCommand[];
  onCommandSelect?: (command: SlashCommand) => void;
  commandFilter?: (command: SlashCommand, query: string) => boolean;
  maxCommandsVisible?: number;
}

export interface UseSlashCommandsOptions {
  commands: SlashCommand[];
  onCommandSelect?: (command: SlashCommand) => void;
  commandFilter?: (command: SlashCommand, query: string) => boolean;
  maxCommandsVisible?: number;
  inputRef: RefObject<HTMLTextAreaElement>;
  setMessage: (message: string) => void;
  message: string;
}

export interface CommandDropdownProps {
  commands: SlashCommand[];
  selectedIndex: number;
  noCommandsMessage?: string;
  onSelect: (command: SlashCommand) => void;
}
