export const parseResponse = (messages?: string | string[]) => {
  if (!messages || !messages.length) return '';

  const responses = Array.isArray(messages) ? messages : [messages];
  return responses.join('\n');
};
