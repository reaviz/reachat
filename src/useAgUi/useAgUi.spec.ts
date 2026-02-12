import { describe, it, expect } from 'vitest';
import { Session } from '@/types';
import { AgUiEventType } from './types';
import {
  parseSSELine,
  parseSSE,
  sessionsToAgUiMessages,
  addConversationToSession,
  updateConversationInSession
} from './useAgUi';

function makeSSEStream(chunks: string[]): Response {
  const encoder = new TextEncoder();
  let i = 0;
  const stream = new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
      } else {
        controller.close();
      }
    }
  });
  return { body: stream } as Response;
}

async function collectEvents(
  chunks: string[]
): Promise<(import('./types').AgUiEvent | Error)[]> {
  const response = makeSSEStream(chunks);
  const ac = new AbortController();
  const events: (import('./types').AgUiEvent | Error)[] = [];
  for await (const event of parseSSE(response, ac.signal)) {
    events.push(event);
  }
  return events;
}

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

describe('parseSSE', () => {
  it('parses a complete stream in one chunk', async () => {
    const events = await collectEvents([
      'data: {"type":"RUN_STARTED","threadId":"t1","runId":"r1"}\n\ndata: {"type":"TEXT_MESSAGE_CONTENT","messageId":"m1","delta":"hi"}\n\ndata: {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}\n\n'
    ]);
    expect(events).toHaveLength(3);
    expect(events[0]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_STARTED })
    );
    expect(events[1]).toEqual(
      expect.objectContaining({
        type: AgUiEventType.TEXT_MESSAGE_CONTENT,
        delta: 'hi'
      })
    );
    expect(events[2]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_FINISHED })
    );
  });

  it('handles events split across chunks', async () => {
    const events = await collectEvents([
      'data: {"type":"RUN_ST',
      'ARTED","threadId":"t1","runId":"r1"}\n\n',
      'data: {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}\n\n'
    ]);
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_STARTED })
    );
    expect(events[1]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_FINISHED })
    );
  });

  it('handles trailing data without final newline', async () => {
    const events = await collectEvents([
      'data: {"type":"RUN_STARTED","threadId":"t1","runId":"r1"}'
    ]);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_STARTED })
    );
  });

  it('skips SSE comments and empty lines between events', async () => {
    const events = await collectEvents([
      ': keep-alive\n\ndata: {"type":"RUN_STARTED","threadId":"t1","runId":"r1"}\n\n: another comment\n\ndata: {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}\n\n'
    ]);
    expect(events).toHaveLength(2);
  });

  it('yields Error for malformed JSON without stopping the stream', async () => {
    const events = await collectEvents([
      'data: {bad json}\n\ndata: {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}\n\n'
    ]);
    expect(events).toHaveLength(2);
    expect(events[0]).toBeInstanceOf(Error);
    expect(events[1]).toEqual(
      expect.objectContaining({ type: AgUiEventType.RUN_FINISHED })
    );
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
});

describe('addConversationToSession', () => {
  it('does not mutate the original array', () => {
    const sessions: Session[] = [
      { id: 's1', conversations: [], createdAt: new Date() }
    ];
    const conv = { id: 'c1', question: 'hi', createdAt: new Date() };
    const result = addConversationToSession(sessions, 's1', conv);

    expect(result).not.toBe(sessions);
    expect(sessions[0].conversations).toHaveLength(0);
    expect(result[0].conversations).toHaveLength(1);
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
});
