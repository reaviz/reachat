import { useState, useCallback } from 'react';
import { Session } from '../src';
import OpenAI from 'openai';
import { PreBuiltOption, matchMessageToCategory } from './mockResponses';

interface DynamicOptionsResult {
  response: string;
  headerText: string;
  options: PreBuiltOption[];
}

interface UseSessionManagerOptions {
  apiKey?: string;
  useOpenAI?: boolean;
  dynamicOptions?: boolean;
  initialOptions?: PreBuiltOption[];
  initialHeaderText?: string;
}

export const useSessionManager = (options: UseSessionManagerOptions = {}) => {
  const {
    apiKey,
    useOpenAI = false,
    dynamicOptions = false,
    initialOptions = [],
    initialHeaderText = 'Hi, What can I help you with?'
  } = options;
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<PreBuiltOption[]>(initialOptions);
  const [headerText, setHeaderText] = useState(initialHeaderText);

  const handleSendMessage = useCallback(async (message: string) => {
    const sessionId = activeSessionId || 'session-1';
    let aiResponse = 'Thanks for reaching out! How can I help further?';

    // Mock mode: use mock responses when no API key
    if (dynamicOptions && !apiKey) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockData = matchMessageToCategory(message);
      setCurrentOptions(mockData.options);
      setHeaderText(mockData.header);
      aiResponse = mockData.header;
      setIsLoading(false);
    }
    
    // OpenAI mode: use real API when key is provided
    if (useOpenAI && apiKey) {
      setIsLoading(true);
      try {
        const openai = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true
        });

        if (dynamicOptions) {
          // Get structured JSON response with dynamic options
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant. When the user sends a message, respond with:
1. A brief helpful response to their query
2. 3-4 follow-up options they might want to ask next

Respond in JSON format:
{
  "response": "Your helpful response here",
  "headerText": "A question prompting next action",
  "options": [
    { "id": "1", "response": "Follow-up option 1" },
    { "id": "2", "response": "Follow-up option 2" },
    { "id": "3", "response": "Follow-up option 3" }
  ]
}`
              },
              { role: 'user', content: message }
            ],
            response_format: { type: 'json_object' }
          });

          const aiResult: DynamicOptionsResult = JSON.parse(
            completion.choices[0]?.message?.content || '{}'
          );

          aiResponse = aiResult.response || 'Thanks for reaching out!';

          if (aiResult.options) {
            setCurrentOptions(aiResult.options);
          }
          if (aiResult.headerText) {
            setHeaderText(aiResult.headerText);
          }
        } else {
          // Standard text response
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }]
          });

          aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        }
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
  }, [activeSessionId, apiKey, useOpenAI, dynamicOptions]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
  }, []);

  return {
    sessions,
    activeSessionId,
    currentOptions,
    headerText,
    isLoading,
    handleSendMessage,
    clearSessions,
    setActiveSessionId
  };
};
