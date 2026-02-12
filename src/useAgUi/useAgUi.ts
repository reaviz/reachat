import { useCallback, useEffect, useRef, useState } from 'react';
import { Session, Conversation } from '@/types';
import {
  AgUiEvent,
  AgUiEventType,
  AgUiContext,
  AgUiMessage,
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

export function addConversationToSession(
  sessions: Session[],
  sessionId: string,
  conversation: Conversation
): Session[] {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      updatedAt: conversation.createdAt,
      conversations: [...s.conversations, conversation]
    };
  });
}

export function updateConversationInSession(
  sessions: Session[],
  sessionId: string,
  conversationId: string,
  response: string
): Session[] {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      updatedAt: new Date(),
      conversations: s.conversations.map(c => {
        if (c.id !== conversationId) return c;
        return { ...c, response, updatedAt: new Date() };
      })
    };
  });
}

/**
 * Converts reachat Session/Conversation history into AG-UI messages.
 */
export function sessionsToAgUiMessages(session: Session): AgUiMessage[] {
  const messages: AgUiMessage[] = [];
  for (const conv of session.conversations) {
    messages.push({
      id: `${conv.id}-q`,
      role: 'user',
      content: conv.question
    });
    if (conv.response) {
      messages.push({
        id: `${conv.id}-r`,
        role: 'assistant',
        content: conv.response
      });
    }
  }
  return messages;
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
async function* parseSSE(
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
      conversations: []
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
          conversations: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sessionId);
      }

      const conversationId = generateId();
      const now = new Date();

      // Add the user's question immediately
      setSessions(prev =>
        addConversationToSession(prev, sessionId, {
          id: conversationId,
          question: message,
          createdAt: now
        })
      );

      setIsLoading(true);

      // Build the history for the agent
      const currentSession = [
        ...(sessions.find(s => s.id === sessionId)?.conversations ?? [])
      ];

      const historyMessages = sessionsToAgUiMessages({
        id: sessionId,
        conversations: currentSession
      });

      // Add the new message
      historyMessages.push({
        id: `${conversationId}-q`,
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

        // Track streaming response text and tool calls
        let responseText = '';
        const toolCalls = new Map<string, { name: string; args: string }>();

        // Helper to update the conversation response in-place
        const updateResponse = (text: string) => {
          setSessions(prev =>
            updateConversationInSession(prev, sessionId, conversationId, text)
          );
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
              responseText += event.delta;
              updateResponse(responseText);
              break;
            }

            case AgUiEventType.TEXT_MESSAGE_CHUNK: {
              if (event.delta) {
                responseText += event.delta;
                updateResponse(responseText);
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
              if (tc && onToolCallRef.current) {
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
