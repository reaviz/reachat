import { describe, it, expect } from 'vitest';
import { Session } from '@/types';
import { AgUiEventType } from './types';
import {
  parseSSELine,
  sessionsToAgUiMessages,
  addConversationToSession,
  updateConversationInSession
} from './useAgUi';

describe('parseSSELine', () => {
  it('parses a valid data line', () => {
    const event = parseSSELine(
      'data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"m1","delta":"hello"}'
    );
    expect(event).toEqual({
      type: AgUiEventType.TEXT_MESSAGE_CONTENT,
      messageId: 'm1',
      delta: 'hello'
    });
  });

  it('returns null for empty lines', () => {
    expect(parseSSELine('')).toBeNull();
    expect(parseSSELine('   ')).toBeNull();
  });

  it('returns null for SSE comments', () => {
    expect(parseSSELine(': keep-alive')).toBeNull();
  });

  it('returns null for [DONE] sentinel', () => {
    expect(parseSSELine('data: [DONE]')).toBeNull();
  });

  it('returns null for non-data fields', () => {
    expect(parseSSELine('event: message')).toBeNull();
    expect(parseSSELine('id: 123')).toBeNull();
  });

  it('returns an Error for malformed JSON', () => {
    const result = parseSSELine('data: {not json}');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain('Failed to parse AG-UI event');
  });

  it('handles data: with extra whitespace', () => {
    const event = parseSSELine(
      '  data:   {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}  '
    );
    expect(event).toEqual({
      type: AgUiEventType.RUN_FINISHED,
      threadId: 't1',
      runId: 'r1'
    });
  });
});

describe('sessionsToAgUiMessages', () => {
  it('converts conversations to user/assistant message pairs', () => {
    const session: Session = {
      id: 's1',
      conversations: [
        { id: 'c1', question: 'hi', response: 'hello', createdAt: new Date() }
      ]
    };

    const messages = sessionsToAgUiMessages(session);
    expect(messages).toEqual([
      { id: 'c1-q', role: 'user', content: 'hi' },
      { id: 'c1-r', role: 'assistant', content: 'hello' }
    ]);
  });

  it('omits assistant message when response is empty', () => {
    const session: Session = {
      id: 's1',
      conversations: [{ id: 'c1', question: 'hi', createdAt: new Date() }]
    };

    const messages = sessionsToAgUiMessages(session);
    expect(messages).toEqual([{ id: 'c1-q', role: 'user', content: 'hi' }]);
  });

  it('returns empty array for session with no conversations', () => {
    const session: Session = { id: 's1', conversations: [] };
    expect(sessionsToAgUiMessages(session)).toEqual([]);
  });
});

describe('addConversationToSession', () => {
  const sessions: Session[] = [
    { id: 's1', conversations: [], createdAt: new Date() },
    { id: 's2', conversations: [], createdAt: new Date() }
  ];

  it('appends conversation to the matching session', () => {
    const conv = { id: 'c1', question: 'hi', createdAt: new Date() };
    const result = addConversationToSession(sessions, 's1', conv);

    expect(result[0].conversations).toHaveLength(1);
    expect(result[0].conversations[0].question).toBe('hi');
    expect(result[1].conversations).toHaveLength(0);
  });

  it('updates the session updatedAt timestamp', () => {
    const now = new Date();
    const conv = { id: 'c1', question: 'hi', createdAt: now };
    const result = addConversationToSession(sessions, 's1', conv);

    expect(result[0].updatedAt).toBe(now);
  });

  it('does not mutate the original array', () => {
    const conv = { id: 'c1', question: 'hi', createdAt: new Date() };
    const result = addConversationToSession(sessions, 's1', conv);

    expect(result).not.toBe(sessions);
    expect(sessions[0].conversations).toHaveLength(0);
  });
});

describe('updateConversationInSession', () => {
  it('updates the response on the matching conversation', () => {
    const sessions: Session[] = [
      {
        id: 's1',
        conversations: [{ id: 'c1', question: 'hi', createdAt: new Date() }],
        createdAt: new Date()
      }
    ];

    const result = updateConversationInSession(sessions, 's1', 'c1', 'hello');
    expect(result[0].conversations[0].response).toBe('hello');
  });

  it('leaves non-matching conversations unchanged', () => {
    const sessions: Session[] = [
      {
        id: 's1',
        conversations: [
          { id: 'c1', question: 'hi', response: 'hey', createdAt: new Date() },
          { id: 'c2', question: 'bye', createdAt: new Date() }
        ],
        createdAt: new Date()
      }
    ];

    const result = updateConversationInSession(sessions, 's1', 'c2', 'later');
    expect(result[0].conversations[0].response).toBe('hey');
    expect(result[0].conversations[1].response).toBe('later');
  });
});
