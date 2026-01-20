export const parseResponse = (messages?: string | string[]) => {
  if (!messages || !messages.length) return '';

  return Array.isArray(messages) ? messages.join('\n') : messages;
};
