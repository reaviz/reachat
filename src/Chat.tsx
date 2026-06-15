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
import { Components } from 'react-markdown';
import { Session } from './types';
import { ChatTheme, chatTheme } from './theme';
import { ChatContext, ChatViewType } from './ChatContext';
import { Plugin } from 'unified';
import { AnimatePresence } from 'motion/react';
import { useDimensions } from './utils/useDimensions';
import type { ComponentCatalog } from './ComponentCatalog/types';

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
   * @default 'console'
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
   * @default chatTheme
   */
  theme?: ChatTheme;

  /**
   * Remark plugins to apply to the request/response.
   * @default undefined
   */
  remarkPlugins?: Plugin[];

  /**
   * Custom markdown components to override default rendering.
   * Use this to add support for custom elements like charts.
   */
  markdownComponents?: Components;

  /**
   * A component catalog created via `componentCatalog()`.
   * Enables dynamic component rendering from LLM responses using
   * fenced code blocks (e.g. ```component).
   *
   * This automatically wires in the necessary remark plugin and
   * markdown component overrides. For advanced control, use the
   * catalog's `remarkPlugin` and `components` properties directly
   * via the `remarkPlugins` and `markdownComponents` props instead.
   */
  components?: ComponentCatalog;

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
  remarkPlugins,
  markdownComponents,
  components: componentCatalog,
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

  // Merge catalog plugin/components when a componentCatalog is provided
  const mergedRemarkPlugins = useMemo(() => {
    if (!componentCatalog) {
      return remarkPlugins;
    }
    // Keep markdown defaults in Markdown component when users don't supply
    // explicit remark plugins.
    if (!remarkPlugins) {
      return undefined;
    }
    return [...(remarkPlugins ?? []), componentCatalog.remarkPlugin];
  }, [remarkPlugins, componentCatalog]);

  // User-provided markdownComponents spread last so they can override
  // catalog defaults (e.g. a custom `pre` handler).
  const mergedMarkdownComponents = useMemo(() => {
    if (!componentCatalog) return markdownComponents;
    return {
      ...componentCatalog.components,
      ...markdownComponents
    };
  }, [markdownComponents, componentCatalog]);

  const contextValue = useMemo(
    () => ({
      sessions,
      activeSession,
      remarkPlugins: mergedRemarkPlugins,
      markdownComponents: mergedMarkdownComponents,
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
      mergedRemarkPlugins,
      mergedMarkdownComponents,
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
