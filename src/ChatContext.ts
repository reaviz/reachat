import { createContext } from 'react';
import { Session } from './types';
import { ChatTheme } from './theme';
import { Plugin } from 'unified';

export type ChatViewType = 'chat' | 'companion' | 'console';

export interface ChatContextProps {
  sessions: Session[];
  disabled?: boolean;
  activeSessionId: string | null;
  theme?: ChatTheme;
  isLoading?: boolean;
  isCompact?: boolean;
  viewType?: ChatViewType;
  activeSession?: Session | null;
  remarkPlugins?: Plugin[];
  selectSession?: (sessionId: string) => void;
  deleteSession?: (sessionId: string) => void;
  createSession?: () => void;
  sendMessage?: (message: string) => void;
  stopMessage?: () => void;
  fileUpload?: (file: File) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  sessions: [],
  activeSessionId: null
});
