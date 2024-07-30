import { createContext } from 'react';
import { Session } from './types';
import { ChatTheme } from './theme';
import { PluggableList } from 'react-markdown/lib';

export interface ChatContextProps {
  sessions: Session[];
  activeSessionId: string | null;
  theme?: ChatTheme;
  isLoading?: boolean;
  activeSession?: Session | null;
  remarkPlugins?: PluggableList[];
  selectSession?: (sessionId: string) => void;
  deleteSession?: (sessionId: string) => void;
  createSession?: () => void;
}

export const ChatContext = createContext<ChatContextProps>({
  sessions: [],
  activeSessionId: null
});
