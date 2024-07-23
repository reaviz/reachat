import { FC } from 'react';
import { useHotkeys } from 'reakeys';
import { cn, useComponentTheme } from 'reablocks';
import { ResponseTransformer, Session } from './types';
import { SessionsList } from './SessionsList';
import { SessionMessages } from './SessionMessages';
import { SessionInput } from './SessionInput';
import { ChatTheme, chatTheme } from './theme';

export interface SessionsProps {
  /**
   * The type of prompt to display. Companion prompts are smaller and are
   * meant to be displayed alongside other content. Full prompts are larger
   * and are meant to be displayed on their own.
   */
  viewType: 'companion' | 'console';

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
   * Array of transformer functions to apply to the response.
   */
  responseTransformers?: ResponseTransformer[];

  /**
   * Custom theme for the chat.
   */
  theme?: ChatTheme;

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

  /**
   * Callback function to handle creating a new session.
   */
  onCreateNewSession?: () => void;
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
  onCreateNewSession
}) => {
  // TODO: Make this hook more dynamic
  // const theme: ChatTheme = useComponentTheme('chat', customTheme);

  useHotkeys([
    {
      name: 'Create new session',
      category: 'Chat',
      keys: 'meta+shift+s',
      callback: event => {
        event.preventDefault();
        onNewSession?.();
      }
    }
  ]);

  return (
    <div className={cn(theme.base, {
      'p-4': viewType === 'companion',
      'flex w-full gap-5 h-full': viewType === 'console'
    })}>
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <SessionsList
            sessions={sessions}
            theme={theme}
            activeSessionId={activeSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
            onCreateNewSession={onCreateNewSession}
          />
          {activeSessionId && (
            <div className="flex-1">
              {sessions
                .filter(session => session.id === activeSessionId)
                .map(session => (
                  <SessionMessages
                    key={session.id}
                    session={session}
                    responseTransformers={responseTransformers}
                    inputPlaceholder={inputPlaceholder}
                    isLoading={isLoading}
                    theme={theme}
                    onSendMessage={onSendMessage}
                    onStopMessage={onStopMessage}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
