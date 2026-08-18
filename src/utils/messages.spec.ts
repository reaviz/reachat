import { describe, it, expect } from 'vitest';
import type { Conversation, Message, Session } from '@/types';
import { conversationsToMessages, getSessionMessages } from './messages';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

describe('conversationsToMessages', () => {
  it('returns an empty array for an empty list', () => {
    expect(conversationsToMessages([])).toEqual([]);
  });

  it('returns an empty array for a nullish list', () => {
    expect(conversationsToMessages(undefined as unknown as [])).toEqual([]);
  });

  it('converts a question/response pair into two messages', () => {
    const conversations: Conversation[] = [
      {
        id: 'c1',
        question: 'hi',
        response: 'hello',
        createdAt,
        updatedAt
      }
    ];

    expect(conversationsToMessages(conversations)).toEqual([
      {
        id: 'c1-question',
        role: 'user',
        content: 'hi',
        files: undefined,
        createdAt
      },
      {
        id: 'c1-response',
        role: 'assistant',
        content: 'hello',
        sources: undefined,
        createdAt,
        updatedAt
      }
    ]);
  });

  it('omits the assistant message when response is undefined', () => {
    const messages = conversationsToMessages([
      { id: 'c1', question: 'hi', createdAt }
    ]);

    expect(messages).toHaveLength(1);
    expect(messages[0].role).toBe('user');
  });

  it('emits the assistant message when response is an empty string', () => {
    const messages = conversationsToMessages([
      { id: 'c1', question: 'hi', response: '', createdAt }
    ]);

    expect(messages).toHaveLength(2);
    expect(messages[1]).toEqual(
      expect.objectContaining({
        id: 'c1-response',
        role: 'assistant',
        content: ''
      })
    );
  });

  it('carries files on the user message and sources on the assistant message', () => {
    const files = [{ name: 'file.pdf' }];
    const sources = [{ title: 'Docs', url: 'https://example.com' }];

    const messages = conversationsToMessages([
      { id: 'c1', question: 'hi', response: 'hello', createdAt, files, sources }
    ]);

    expect(messages[0].files).toBe(files);
    expect(messages[0].sources).toBeUndefined();
    expect(messages[1].sources).toBe(sources);
    expect(messages[1].files).toBeUndefined();
  });

  it('preserves the order of multiple conversations', () => {
    const messages = conversationsToMessages([
      { id: 'c1', question: 'q1', response: 'r1', createdAt },
      { id: 'c2', question: 'q2', response: 'r2', createdAt }
    ]);

    expect(messages.map(m => m.id)).toEqual([
      'c1-question',
      'c1-response',
      'c2-question',
      'c2-response'
    ]);
    expect(messages.map(m => m.content)).toEqual(['q1', 'r1', 'q2', 'r2']);
  });

  it('does not mutate the source conversations', () => {
    const conversations: Conversation[] = [
      { id: 'c1', question: 'hi', response: 'hello', createdAt }
    ];
    const snapshot = JSON.stringify(conversations);

    conversationsToMessages(conversations);

    expect(JSON.stringify(conversations)).toEqual(snapshot);
  });
});

describe('getSessionMessages', () => {
  it('returns an empty array when no session is given', () => {
    expect(getSessionMessages()).toEqual([]);
    expect(getSessionMessages(null)).toEqual([]);
    expect(getSessionMessages(undefined)).toEqual([]);
  });

  it('returns an empty array for a session with neither field', () => {
    expect(getSessionMessages({ id: 's1' })).toEqual([]);
  });

  it('returns messages when present', () => {
    const messages: Message[] = [{ id: 'm1', role: 'user', content: 'hi' }];
    const session: Session = { id: 's1', messages };

    expect(getSessionMessages(session)).toBe(messages);
  });

  it('converts conversations when messages are absent', () => {
    const session: Session = {
      id: 's1',
      conversations: [
        { id: 'c1', question: 'hi', response: 'hello', createdAt }
      ]
    };

    expect(getSessionMessages(session).map(m => m.content)).toEqual([
      'hi',
      'hello'
    ]);
  });

  it('prefers messages when both are present', () => {
    const session: Session = {
      id: 's1',
      messages: [{ id: 'm1', role: 'user', content: 'from messages' }],
      conversations: [{ id: 'c1', question: 'from conversations', createdAt }]
    };

    expect(getSessionMessages(session).map(m => m.content)).toEqual([
      'from messages'
    ]);
  });

  it('prefers an empty messages array over conversations', () => {
    const session: Session = {
      id: 's1',
      messages: [],
      conversations: [{ id: 'c1', question: 'hi', createdAt }]
    };

    expect(getSessionMessages(session)).toEqual([]);
  });
});
