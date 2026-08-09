import { useCallback, useEffect, useRef, useState } from 'react';
import { Message, Session } from '@/types';
import { getSessionMessages } from '@/utils/messages';
import {
  AgUiEvent,
  AgUiEventType,
  AgUiContext,
  AgUiMessage,
  AgUiRole,
  AgUiRunAgentInput,
  AgUiTool,
  AgUiToolCallInfo
} from './types';

export interface UseAgUiOptions {
  /**
   * URL of the AG-UI compatible agent endpoint.
   */
  agent: string;

  /**
   * Initial sessions to populate the chat.
   */
  initialSessions?: Session[];

  /**
   * Initial active session ID.
   */
  initialActiveSessionId?: string;

  /**
   * Tools to expose to the agent.
   */
  tools?: AgUiTool[];

  /**
   * Context to send with each run.
   */
  context?: AgUiContext[];

  /**
   * Additional properties forwarded to the agent.
   */
  forwardedProps?: Record<string, unknown>;

  /**
   * Custom headers for the HTTP request.
   */
  headers?: Record<string, string>;

  /**
   * Called when a tool call is received from the agent.
   */
  onToolCall?: (toolCall: AgUiToolCallInfo) => Promise<void> | void;

  /**
   * Called when the agent run encounters an error.
   */
  onError?: (error: Error) => void;

  /**
   * Called when an AG-UI event is received (for debugging/logging).
   */
  onEvent?: (event: AgUiEvent) => void;
}

export interface UseAgUiReturn {
  /**
   * All chat sessions.
   */
  sessions: Session[];

  /**
   * The currently active session ID.
   */
  activeSessionId: string | undefined;

  /**
   * Whether the agent is currently processing.
   */
  isLoading: boolean;

  /**
   * Select a session by ID.
   */
  selectSession: (sessionId: string) => void;

  /**
   * Delete a session by ID.
   */
  deleteSession: (sessionId: string) => void;

  /**
   * Create a new empty session.
   */
  createSession: () => void;

  /**
   * Send a message to the agent.
   */
  sendMessage: (message: string) => void;

  /**
   * Stop the current agent run.
   */
  stopMessage: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Appends a message to the given session.
 */
export function addMessageToSession(
  sessions: Session[],
  sessionId: string,
  message: Message
): Session[] {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      updatedAt: message.createdAt ?? new Date(),
      messages: [...getSessionMessages(s), message]
    };
  });
}

/**
 * Replaces the content of a message within the given session.
 */
export function updateMessageInSession(
  sessions: Session[],
  sessionId: string,
  messageId: string,
  content: string
): Session[] {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const updatedAt = new Date();
    return {
      ...s,
      updatedAt,
      messages: getSessionMessages(s).map(m => {
        if (m.id !== messageId) return m;
        return { ...m, content, updatedAt };
      })
    };
  });
}

const AG_UI_ROLES: AgUiRole[] = [
  'developer',
  'system',
  'assistant',
  'user',
  'tool'
];

/**
 * Maps a reachat message role onto an AG-UI role. Custom roles that have
 * no AG-UI equivalent are sent as `assistant`.
 */
function toAgUiRole(role: string): AgUiRole {
  return AG_UI_ROLES.includes(role as AgUiRole)
    ? (role as AgUiRole)
    : 'assistant';
}

/**
 * Converts reachat Session history into AG-UI messages.
 */
export function sessionsToAgUiMessages(session: Session): AgUiMessage[] {
  return getSessionMessages(session).map(message => {
    const result: AgUiMessage = {
      id: message.id,
      role: toAgUiRole(message.role),
      content: message.content
    };

    if (message.role === 'tool') {
      const { toolCallId, toolCallName } = message.metadata ?? {};
      if (toolCallId) {
        result.toolCallId = toolCallId;
      }
      if (toolCallName) {
        result.name = toolCallName;
      }
    }

    return result;
  });
}

/**
 * Parses a single SSE data line, returning the event or an Error
 * if the JSON is malformed.
 */
export function parseSSELine(line: string): AgUiEvent | Error | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith(':')) return null;

  if (trimmed.startsWith('data:')) {
    const data = trimmed.slice(5).trim();
    if (data === '[DONE]') return null;

    try {
      return JSON.parse(data) as AgUiEvent;
    } catch (err) {
      return new Error(
        `Failed to parse AG-UI event: ${err instanceof Error ? err.message : err}`
      );
    }
  }
  return null;
}

/**
 * Parses an SSE stream from a Response into AG-UI events.
 */
export async function* parseSSE(
  response: Response,
  signal: AbortSignal
): AsyncGenerator<AgUiEvent | Error> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const result = parseSSELine(line);
        if (result !== null) yield result;
      }
    }

    // Process any remaining data in the buffer after stream ends
    if (buffer.trim()) {
      const result = parseSSELine(buffer);
      if (result !== null) yield result;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * React hook that connects to an AG-UI protocol endpoint and provides
 * all the props needed for the reachat `<Chat>` component.
 *
 * @example
 * ```tsx
 * const agui = useAgUi({ agent: 'https://my-agent.example.com/run' });
 *
 * <Chat
 *   sessions={agui.sessions}
 *   activeSessionId={agui.activeSessionId}
 *   isLoading={agui.isLoading}
 *   onSelectSession={agui.selectSession}
 *   onDeleteSession={agui.deleteSession}
 *   onNewSession={agui.createSession}
 *   onSendMessage={agui.sendMessage}
 *   onStopMessage={agui.stopMessage}
 * >
 *   <SessionMessagePanel>
 *     <SessionMessages />
 *     <ChatInput />
 *   </SessionMessagePanel>
 * </Chat>
 * ```
 */
export function useAgUi({
  agent,
  initialSessions = [],
  initialActiveSessionId,
  tools = [],
  context = [],
  forwardedProps = {},
  headers = {},
  onToolCall,
  onError,
  onEvent
}: UseAgUiOptions): UseAgUiReturn {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    initialActiveSessionId
  );
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  // Refs to keep stable references in the async generator loop
  const onToolCallRef = useRef(onToolCall);
  onToolCallRef.current = onToolCall;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  // Abort in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(undefined);
      }
    },
    [activeSessionId]
  );

  const createSession = useCallback(() => {
    const id = generateId();
    const newSession: Session = {
      id,
      title: 'New Session',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
  }, []);

  const stopMessage = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      // Abort any in-flight request
      abortRef.current?.abort();

      const abortController = new AbortController();
      abortRef.current = abortController;

      // Determine the session to use
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = generateId();
        const newSession: Session = {
          id: sessionId,
          title: message.slice(0, 50),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sessionId);
      }

      const userMessageId = generateId();
      const now = new Date();

      // Add the user's message immediately
      setSessions(prev =>
        addMessageToSession(prev, sessionId, {
          id: userMessageId,
          role: 'user',
          content: message,
          createdAt: now
        })
      );

      setIsLoading(true);

      // Build the history for the agent
      const currentSession = sessions.find(s => s.id === sessionId);
      const historyMessages = currentSession
        ? sessionsToAgUiMessages(currentSession)
        : [];

      // Add the new message
      historyMessages.push({
        id: userMessageId,
        role: 'user',
        content: message
      });

      const runId = generateId();
      const input: AgUiRunAgentInput = {
        threadId: sessionId,
        runId,
        messages: historyMessages,
        tools,
        context,
        state: null,
        forwardedProps
      };

      try {
        const response = await fetch(agent, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...headers
          },
          body: JSON.stringify(input),
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(
            `Agent returned ${response.status}: ${response.statusText}`
          );
        }

        // Track the in-flight assistant message and any tool calls
        let assistantMessageId: string | null = null;
        let assistantText = '';
        const toolCalls = new Map<string, { name: string; args: string }>();

        // Appends a text delta, starting a new assistant message when
        // there is not one streaming (eg. after a tool call).
        const appendAssistantText = (delta: string) => {
          if (assistantMessageId === null) {
            assistantMessageId = generateId();
            assistantText = delta;
            const id = assistantMessageId;
            const content = assistantText;
            setSessions(prev =>
              addMessageToSession(prev, sessionId, {
                id,
                role: 'assistant',
                content,
                createdAt: new Date()
              })
            );
          } else {
            assistantText += delta;
            const id = assistantMessageId;
            const content = assistantText;
            setSessions(prev =>
              updateMessageInSession(prev, sessionId, id, content)
            );
          }
        };

        for await (const eventOrError of parseSSE(
          response,
          abortController.signal
        )) {
          if (eventOrError instanceof Error) {
            onErrorRef.current?.(eventOrError);
            continue;
          }

          const event = eventOrError;
          onEventRef.current?.(event);

          switch (event.type) {
            case AgUiEventType.TEXT_MESSAGE_CONTENT: {
              appendAssistantText(event.delta);
              break;
            }

            case AgUiEventType.TEXT_MESSAGE_CHUNK: {
              if (event.delta) {
                appendAssistantText(event.delta);
              }
              break;
            }

            case AgUiEventType.TOOL_CALL_START: {
              toolCalls.set(event.toolCallId, {
                name: event.toolCallName,
                args: ''
              });
              break;
            }

            case AgUiEventType.TOOL_CALL_ARGS: {
              const tc = toolCalls.get(event.toolCallId);
              if (tc) {
                tc.args += event.delta;
              }
              break;
            }

            case AgUiEventType.TOOL_CALL_END: {
              const tc = toolCalls.get(event.toolCallId);
              if (tc) {
                // Tool activity becomes its own message in the transcript
                setSessions(prev =>
                  addMessageToSession(prev, sessionId, {
                    id: generateId(),
                    role: 'tool',
                    content: tc.name,
                    createdAt: new Date(),
                    metadata: {
                      toolCallId: event.toolCallId,
                      toolCallName: tc.name,
                      args: tc.args
                    }
                  })
                );

                // Any text that follows starts a new assistant message
                assistantMessageId = null;
                assistantText = '';

                if (onToolCallRef.current) {
                  try {
                    await onToolCallRef.current({
                      toolCallId: event.toolCallId,
                      toolCallName: tc.name,
                      args: tc.args
                    });
                  } catch {
                    // Tool call handler errors are non-fatal
                  }
                }
              }
              toolCalls.delete(event.toolCallId);
              break;
            }

            case AgUiEventType.RUN_ERROR: {
              const err = new Error(event.message);
              onErrorRef.current?.(err);
              break;
            }

            case AgUiEventType.RUN_FINISHED: {
              // Run completed successfully
              break;
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User cancelled - not an error
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        onErrorRef.current?.(error);
      } finally {
        if (abortRef.current === abortController) {
          abortRef.current = null;
        }
        setIsLoading(false);
      }
    },
    [activeSessionId, agent, context, forwardedProps, headers, sessions, tools]
  );

  return {
    sessions,
    activeSessionId,
    isLoading,
    selectSession,
    deleteSession,
    createSession,
    sendMessage,
    stopMessage
  };
}
