import {
  CSSProperties,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useHotkeys } from 'reakeys';
import { cn, useComponentTheme } from 'reablocks';
import { Session } from './types';
import { ChatTheme, chatTheme } from './theme';
import { SessionsContext } from './SessionsContext';
import { PluggableList } from 'react-markdown/lib';

export interface SessionsProps extends PropsWithChildren {
  /**
   * The style to apply to the root element.
   */
  style?: CSSProperties;

  /**
   * The class name to apply to the root element.
   */
  className?: string;

  /**
   * The type of prompt to display. Companion prompts are smaller and are
   * meant to be displayed alongside other content. Full prompts are larger
   * and are meant to be displayed on their own.
   */
  viewType?: 'companion' | 'console';

  /**
   * The list of sessions to display.
   */
  sessions: Session[];

  /**
   * The ID of the currently active session.
   */
  activeSessionId?: string;

  /**
   * Custom theme for the chat.
   */
  theme?: ChatTheme;

  /**
   * Remark plugins to apply to the request/response.
   */
  remarkPlugins?: PluggableList[];

  /**
   * Whether to display a loading state.
   */
  isLoading?: boolean;

  /**
   * Callback function to handle when a session is selected.
   */
  onSelectSession?: (sessionId: string) => void;

  /**
   * Callback function to handle when a session is deleted.
   */
  onDeleteSession?: (sessionId: string) => void;

  /**
   * Callback function to handle creating a new session.
   */
  onNewSession?: () => void;
}

export const Sessions: FC<SessionsProps> = ({
  children,
  viewType = 'console',
  sessions,
  onSelectSession,
  onDeleteSession,
  isLoading,
  activeSessionId,
  theme: customTheme = chatTheme,
  onNewSession,
  remarkPlugins,
  style,
  className
}) => {
  const theme = useComponentTheme<ChatTheme>('chat', customTheme);
  const [internalActiveSessionID, setInternalActiveSessionID] = useState<
    string | undefined
  >(activeSessionId);

  useEffect(() => {
    setInternalActiveSessionID(activeSessionId);
  }, [activeSessionId]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      setInternalActiveSessionID(sessionId);
      onSelectSession?.(sessionId);
    },
    [onSelectSession]
  );

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      setInternalActiveSessionID(undefined);
      onDeleteSession?.(sessionId);
    },
    [onDeleteSession]
  );

  const handleCreateNewSession = useCallback(() => {
    setInternalActiveSessionID(undefined);
    onNewSession?.();
  }, [onNewSession]);

  useHotkeys([
    {
      name: 'Create new session',
      category: 'Chat',
      keys: 'meta+shift+s',
      callback: event => {
        event.preventDefault();
        handleCreateNewSession();
      }
    }
  ]);

  const activeSession = useMemo(
    () => sessions.find(session => session.id === internalActiveSessionID),
    [sessions, internalActiveSessionID]
  );

  const contextValue = useMemo(
    () => ({
      sessions,
      activeSession,
      remarkPlugins,
      theme,
      isLoading,
      activeSessionId: internalActiveSessionID,
      selectSession: handleSelectSession,
      deleteSession: handleDeleteSession,
      createSession: handleCreateNewSession
    }),
    [
      isLoading,
      theme,
      remarkPlugins,
      sessions,
      activeSession,
      internalActiveSessionID,
      handleSelectSession,
      handleDeleteSession,
      handleCreateNewSession
    ]
  );

  return (
    <SessionsContext.Provider value={contextValue}>
      <div
        className={cn(className, theme.base, {
          [theme.companion]: viewType === 'companion',
          [theme.console]: viewType === 'console'
        })}
        style={style}
      >
        {children}
      </div>
    </SessionsContext.Provider>
  );
};
