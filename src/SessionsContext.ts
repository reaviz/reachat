import { createContext } from 'react';
import { Session } from './types';

export interface SessionContextProps {
  sessions: Session[];
  activeSessionId: string | null;
  activeSession?: Session | null;
  selectSession?: (sessionId: string) => void;
  deleteSession?: (sessionId: string) => void;
  createSession?: () => void;
}

export const SessionsContext = createContext<SessionContextProps>({
  sessions: [],
  activeSessionId: null
});
