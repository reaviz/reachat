import { createContext } from 'react';
import { Session } from './types';

export interface SessionContextProps {
  sessions: Session[];
  activeSessionId: string | null;
}

export const SessionsContext = createContext<SessionContextProps>({
  sessions: [],
  activeSessionId: null
});
