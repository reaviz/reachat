import { describe, it, expect } from 'vitest';
import { Session } from '@/types';
import { AgUiEventType } from './types';
import {
  parseSSELine,
  parseSSE,
  sessionsToAgUiMessages,
  addMessageToSession,
  updateMessageInSession
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
  it('maps messages 1:1 by role', () => {
    const session: Session = {
      id: 's1',
      messages: [
        { id: 'm1', role: 'user', content: 'hi' },
        { id: 'm2', role: 'assistant', content: 'hello' },
        { id: 'm3', role: 'system', content: 'be nice' }
      ]
    };

    expect(sessionsToAgUiMessages(session)).toEqual([
      { id: 'm1', role: 'user', content: 'hi' },
      { id: 'm2', role: 'assistant', content: 'hello' },
      { id: 'm3', role: 'system', content: 'be nice' }
    ]);
  });

  it('maps tool messages with their tool call metadata', () => {
    const session: Session = {
      id: 's1',
      messages: [
        {
          id: 'm1',
          role: 'tool',
          content: 'get_weather',
          metadata: {
            toolCallId: 't1',
            toolCallName: 'get_weather',
            args: '{}'
          }
        }
      ]
    };

    expect(sessionsToAgUiMessages(session)).toEqual([
      {
        id: 'm1',
        role: 'tool',
        content: 'get_weather',
        toolCallId: 't1',
        name: 'get_weather'
      }
    ]);
  });

  it('maps custom roles to assistant', () => {
    const session: Session = {
      id: 's1',
      messages: [{ id: 'm1', role: 'status', content: 'thinking' }]
    };

    expect(sessionsToAgUiMessages(session)).toEqual([
      { id: 'm1', role: 'assistant', content: 'thinking' }
    ]);
  });

  it('converts legacy conversations to user/assistant messages', () => {
    const session: Session = {
      id: 's1',
      conversations: [
        { id: 'c1', question: 'hi', response: 'hello', createdAt: new Date() }
      ]
    };

    expect(sessionsToAgUiMessages(session)).toEqual([
      { id: 'c1-question', role: 'user', content: 'hi' },
      { id: 'c1-response', role: 'assistant', content: 'hello' }
    ]);
  });

  it('omits the assistant message when a legacy response is missing', () => {
    const session: Session = {
      id: 's1',
      conversations: [{ id: 'c1', question: 'hi', createdAt: new Date() }]
    };

    expect(sessionsToAgUiMessages(session)).toEqual([
      { id: 'c1-question', role: 'user', content: 'hi' }
    ]);
  });
});

describe('addMessageToSession', () => {
  it('does not mutate the original array', () => {
    const sessions: Session[] = [
      { id: 's1', messages: [], createdAt: new Date() }
    ];
    const result = addMessageToSession(sessions, 's1', {
      id: 'm1',
      role: 'user',
      content: 'hi',
      createdAt: new Date()
    });

    expect(result).not.toBe(sessions);
    expect(sessions[0].messages).toHaveLength(0);
    expect(result[0].messages).toHaveLength(1);
    expect(result[0].messages[0]).toEqual(
      expect.objectContaining({ id: 'm1', role: 'user', content: 'hi' })
    );
  });

  it('leaves other sessions untouched', () => {
    const other: Session = { id: 's2', messages: [] };
    const sessions: Session[] = [{ id: 's1', messages: [] }, other];

    const result = addMessageToSession(sessions, 's1', {
      id: 'm1',
      role: 'user',
      content: 'hi'
    });

    expect(result[1]).toBe(other);
  });

  it('appends onto legacy conversation sessions', () => {
    const sessions: Session[] = [
      {
        id: 's1',
        conversations: [
          { id: 'c1', question: 'hi', response: 'hello', createdAt: new Date() }
        ]
      }
    ];

    const result = addMessageToSession(sessions, 's1', {
      id: 'm1',
      role: 'user',
      content: 'again'
    });

    expect(result[0].messages.map(m => m.content)).toEqual([
      'hi',
      'hello',
      'again'
    ]);
  });
});

describe('updateMessageInSession', () => {
  it('updates the content of the matching message', () => {
    const sessions: Session[] = [
      {
        id: 's1',
        messages: [
          { id: 'm1', role: 'user', content: 'hi' },
          { id: 'm2', role: 'assistant', content: 'hel' }
        ],
        createdAt: new Date()
      }
    ];

    const result = updateMessageInSession(sessions, 's1', 'm2', 'hello');

    expect(result[0].messages[1].content).toBe('hello');
    expect(result[0].messages[1].updatedAt).toBeInstanceOf(Date);
    expect(result[0].messages[0].content).toBe('hi');
    expect(sessions[0].messages[1].content).toBe('hel');
  });

  it('is a no-op when the message id is unknown', () => {
    const sessions: Session[] = [
      {
        id: 's1',
        messages: [{ id: 'm1', role: 'assistant', content: 'hi' }]
      }
    ];

    const result = updateMessageInSession(sessions, 's1', 'nope', 'hello');
    expect(result[0].messages[0].content).toBe('hi');
  });
});
