import { useState, useCallback } from 'react';
import { Session, Conversation } from './types';

export type LlmProvider = 'openai' | 'anthropic' | 'google';

export interface LlmOptions {
  provider: LlmProvider;
  apiKey: string;
}

export interface LlmResponse {
  text: string;
  isComplete: boolean;
}

export const useLlm = (options: LlmOptions) => {
  /*
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const streamResponse = useCallback(async (
    prompt: string,
    onUpdate: (response: LlmResponse) => void
  ): Promise<void> => {
    if (!prompt.trim()) {
      setError(new Error('Prompt cannot be empty'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiEndpoint = API_ENDPOINTS[options.provider];

      let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey}`
      };
      let body: any = { prompt, stream: true };

      switch (options.provider) {
        case 'openai':
          body = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            stream: true
          };
          break;
        case 'anthropic':
          body = {
            prompt: `Human: ${prompt}\n\nAssistant:`,
            model: 'claude-2',
            stream: true
          };
          break;
        case 'google':
          headers['x-goog-api-key'] = options.apiKey;
          delete headers['Authorization'];
          body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9 }
          };
          break;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedResponse += chunk;

        // Parse the chunk based on the provider
        let parsedChunk = '';
        switch (options.provider) {
          case 'openai':
            parsedChunk = parseOpenAIResponse(chunk);
            break;
          case 'anthropic':
            parsedChunk = parseAnthropicResponse(chunk);
            break;
          case 'google':
            parsedChunk = parseGoogleResponse(chunk);
            break;
        }

        onUpdate({
          text: accumulatedResponse,
          isComplete: false
        });
      }

      onUpdate({
        text: accumulatedResponse,
        isComplete: true
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const sendMessage = useCallback(async (
    session: Session,
    message: string
  ): Promise<Session> => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      question: message,
      response: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let updatedSession = {
      ...session,
      conversations: [...session.conversations, newConversation]
    };

    await streamResponse(message, (response) => {
      newConversation.response = response.text;
      newConversation.updatedAt = new Date();
      updatedSession = { ...updatedSession };
    });

    return updatedSession;
  }, [streamResponse]);

  return {
    isLoading,
    error,
    sendMessage
  };
  */
};

/*
const API_ENDPOINTS: Record<LlmProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/complete',
  google: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent',
};

// Helper functions to parse responses (these need to be implemented)
function parseOpenAIResponse(chunk: string): string {
  // Implementation needed
  return chunk;
}

function parseAnthropicResponse(chunk: string): string {
  // Implementation needed
  return chunk;
}

function parseGoogleResponse(chunk: string): string {
  // Implementation needed
  return chunk;
}
*/
