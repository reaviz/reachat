import { useState, useCallback } from 'react';
import { Session } from '../src';
import OpenAI from 'openai';

interface UseSessionManagerOptions {
  apiKey?: string;
  useOpenAI?: boolean;
}

export const useSessionManager = (options: UseSessionManagerOptions = {}) => {
  const { apiKey, useOpenAI = false } = options;
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (message: string) => {
    const sessionId = activeSessionId || 'session-1';
    
    let aiResponse = 'Thanks for reaching out! How can I help further?';
    
    // If OpenAI is enabled and API key provided, get real response
    if (useOpenAI && apiKey) {
      setIsLoading(true);
      try {
        const openai = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true
        });

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }]
        });

        aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      } catch (error) {
        console.error('OpenAI API error:', error);
        aiResponse = 'Error getting response. Please check your API key.';
      } finally {
        setIsLoading(false);
      }
    }

    // Update sessions
    setSessions(prev => {
      const existingSession = prev.find(s => s.id === sessionId);

      if (!existingSession) {
        return [...prev, {
          id: sessionId,
          title: message.slice(0, 30),
          createdAt: new Date(),
          updatedAt: new Date(),
          conversations: [{
            id: Date.now().toString(),
            question: message,
            response: aiResponse,
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        }];
      } else {
        return prev.map(s => s.id === sessionId ? {
          ...s,
          updatedAt: new Date(),
          conversations: [...s.conversations, {
            id: Date.now().toString(),
            question: message,
            response: aiResponse,
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        } : s);
      }
    });

    setActiveSessionId(sessionId);
  }, [activeSessionId, apiKey, useOpenAI]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
  }, []);

  return {
    sessions,
    activeSessionId,
    isLoading,
    handleSendMessage,
    clearSessions,
    setActiveSessionId
  };
};

