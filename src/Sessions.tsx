import { FC, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'reakeys';
import { cn, useComponentTheme } from 'reablocks';
import { ResponseTransformer, Session } from './types';
import { SessionsList } from './SessionsList';
import { SessionMessages } from './SessionMessages';
import { SessionInput } from './SessionInput';
import { ChatTheme, chatTheme } from './theme';
import { SessionsContext } from './SessionsContext';

export interface SessionsProps extends PropsWithChildren {
  /**
   * The type of prompt to display. Companion prompts are smaller and are
   * meant to be displayed alongside other content. Full prompts are larger
   * and are meant to be displayed on their own.
   */
  viewType: 'companion' | 'console';

  /**
   * The list of allowed file types. If null or not defined, not file upload
   * will be allowed.
   */
  allowedFiles?: string[];

  /**
   * The list of sessions to display.
   */
  sessions: Session[];

  /**
   * The ID of the currently active session.
   */
  activeSessionId?: string;

  /**
   * Indicates whether the sessions are currently loading.
   */
  isLoading?: boolean;

  /**
   * Placeholder text for the input field.
   */
  inputPlaceholder?: string;

  /**
   * Default value for the input field.
   */
  inputDefaultValue?: string;

  /**
   * Text for the new session button.
   */
  newSessionText?: string;

  /**
   * Array of transformer functions to apply to the response.
   */
  responseTransformers?: ResponseTransformer[];

  /**
   * Custom theme for the chat.
   */
  theme?: ChatTheme;

  /**
   * Content to display when there are no sessions selected or a new session is started.
   */
  newSessionContent?: string | ReactNode;

  /**
   * Callback function to handle when a session is selected.
   */
  onSelectSession?: (sessionId: string) => void;

  /**
   * Callback function to handle when a session is deleted.
   */
  onDeleteSession?: (sessionId: string) => void;

  /**
   * Callback function to handle sending a new message.
   */
  onSendMessage?: (message: string) => void;

  /**
   * Callback function to handle stopping the current action.
   */
  onStopMessage?: () => void;

  /**
   * Callback function to handle creating a new session.
   */
  onNewSession?: () => void;
}

export const Sessions: FC<SessionsProps> = ({
  viewType = 'console',
  sessions,
  onSelectSession,
  onDeleteSession,
  isLoading,
  activeSessionId,
  responseTransformers = [],
  theme = chatTheme,
  inputPlaceholder = 'Type your message here...',
  onSendMessage,
  onStopMessage,
  onNewSession,
  newSessionContent = '',
  allowedFiles,
  newSessionText = 'New Session',
  inputDefaultValue
}) => {
  // TODO: Make this hook more dynamic
  // const theme: ChatTheme = useComponentTheme('chat', customTheme);

  const [internalActiveSessionID, setInternalActiveSessionID] = useState<string | undefined>(activeSessionId);

  useEffect(() => {
    setInternalActiveSessionID(activeSessionId);
  }, [activeSessionId]);

  function handleSelectSession(sessionId: string) {
    setInternalActiveSessionID(sessionId);
    onSelectSession?.(sessionId);
  }

  function handleDeleteSession(sessionId: string) {
    setInternalActiveSessionID(undefined);
    onDeleteSession?.(sessionId);
  }

  function handleCreateNewSession() {
    setInternalActiveSessionID(undefined);
    onNewSession?.();
  }

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

  const contextValue = useMemo(() => ({
    sessions,
    activeSessionId
  }), [sessions, activeSessionId]);

  return (
    <SessionsContext.Provider value={contextValue}>
      <div className={cn(theme.base, {
        'p-4': viewType === 'companion',
        'flex w-full gap-5 h-full': viewType === 'console'
      })}>
        <>
          <SessionsList
            sessions={sessions}
            theme={theme}
            newSessionText={newSessionText}
            activeSessionId={internalActiveSessionID}
            onSelectSession={handleSelectSession}
            onDeleteSession={onDeleteSession ? handleDeleteSession : null}
            onCreateNewSession={handleCreateNewSession}
          />
          <div className="flex-1 h-full flex flex-col">
            {internalActiveSessionID ? (
              <>
                {sessions
                  .filter(session => session.id === internalActiveSessionID)
                  .map(session => (
                    <SessionMessages
                      key={session.id}
                      session={session}
                      responseTransformers={responseTransformers}
                      theme={theme}
                    />
                  ))}
              </>
            ) : (
              <div className={cn(theme.empty)}>
                {newSessionContent}
              </div>
            )}
            <SessionInput
              theme={theme}
              inputDefaultValue={inputDefaultValue}
              inputPlaceholder={inputPlaceholder}
              isLoading={isLoading}
              allowedFiles={allowedFiles}
              onSendMessage={onSendMessage}
              onStopMessage={onStopMessage}
            />
          </div>
        </>
      </div>
    </SessionsContext.Provider>
  );
};
