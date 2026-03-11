import { createContext } from 'react';

import type { ChatTheme } from './theme';
import { chatTheme } from './theme';

/**
 * Context for overriding the default Chat theme.
 * Useful for switching between theme variants (e.g. default vs unify).
 */
export const ChatThemeContext = createContext<ChatTheme>(chatTheme);
