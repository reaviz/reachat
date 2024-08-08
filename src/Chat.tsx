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
import { ChatContext, ChatViewType } from './ChatContext';
import { PluggableList } from 'react-markdown/lib';
import { AnimatePresence } from 'framer-motion';
import { useDimensions } from './utils/useDimensions';
import remarkGfm from 'remark-gfm';
import remarkYoutube from 'remark-youtube';
import remarkMath from 'remark-math';

export interface ChatProps extends PropsWithChildren {
  /**
   * The style to apply to the root element.
   */
  style?: CSSProperties;

  /**
   * The class name to apply to the root element.
   */
  className?: string;

  /**
   * The type of prompt to display.
   *
   * - Companion: Smaller prompt screen with session lists.
   * - Console: Full screen experience.
   * - Chat: Only chat, no sessions.
   */
  viewType?: ChatViewType;

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
   * Whether to disable the chat.
   */
  disabled?: boolean;

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

  /**
   * Callback function to handle sending a new message.
   */
  onSendMessage?: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage?: () => void;

  /**
   * Callback function to handle file upload.
   */
  onFileUpload?: (file: File) => void;
}

export const Chat: FC<ChatProps> = ({
  children,
  viewType = 'console',
  sessions,
  onSelectSession,
  onDeleteSession,
  onSendMessage,
  onStopMessage,
  onFileUpload,
  isLoading,
  activeSessionId,
  theme: customTheme = chatTheme,
  onNewSession,
  remarkPlugins = [remarkGfm, remarkYoutube, remarkMath],
  disabled,
  style,
  className
}) => {
  const theme = useComponentTheme<ChatTheme>('chat', customTheme);
  const [internalActiveSessionID, setInternalActiveSessionID] = useState<
    string | null
  >(activeSessionId);

  const { width, observe } = useDimensions();
  const isCompact = viewType === 'companion' || (width && width < 767);

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
      remarkPlugins: remarkPlugins as PluggableList[],
      theme,
      disabled,
      isLoading,
      isCompact,
      viewType,
      activeSessionId: internalActiveSessionID,
      selectSession: handleSelectSession,
      deleteSession: handleDeleteSession,
      createSession: handleCreateNewSession,
      sendMessage: onSendMessage,
      stopMessage: onStopMessage,
      fileUpload: onFileUpload
    }),
    [
      isLoading,
      isCompact,
      viewType,
      disabled,
      theme,
      remarkPlugins,
      sessions,
      activeSession,
      internalActiveSessionID,
      handleSelectSession,
      handleDeleteSession,
      handleCreateNewSession,
      onSendMessage,
      onStopMessage,
      onFileUpload
    ]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <AnimatePresence initial={false}>
        <div
          ref={observe}
          className={cn(className, theme.base, {
            [theme.companion]: isCompact,
            [theme.console]: !isCompact
          })}
          style={style}
        >
          {children}
        </div>
      </AnimatePresence>
    </ChatContext.Provider>
  );
};
