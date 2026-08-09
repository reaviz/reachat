import type { Conversation, Message, Session } from '@/types';

/**
 * Converts legacy `Conversation` pairs into a flat `Message` list.
 *
 * Each conversation becomes a `user` message and, when a response is
 * present, an `assistant` message immediately after it.
 */
export function conversationsToMessages(
  conversations: Conversation[]
): Message[] {
  if (!conversations?.length) {
    return [];
  }

  const messages: Message[] = [];
  for (const conversation of conversations) {
    messages.push({
      id: `${conversation.id}-question`,
      role: 'user',
      content: conversation.question,
      files: conversation.files,
      createdAt: conversation.createdAt
    });

    if (conversation.response !== undefined) {
      messages.push({
        id: `${conversation.id}-response`,
        role: 'assistant',
        content: conversation.response,
        sources: conversation.sources,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      });
    }
  }

  return messages;
}

/**
 * Returns `session.messages`, falling back to converting the deprecated
 * `session.conversations`. When both are present, `messages` wins.
 */
export function getSessionMessages(session?: Session | null): Message[] {
  if (!session) {
    return [];
  }

  if (session.messages) {
    return session.messages;
  }

  return conversationsToMessages(session.conversations ?? []);
}
