import { useState, useCallback } from 'react';
import { Session } from '../src';
import OpenAI from 'openai';

interface PreBuiltOption {
  id: string;
  response: string;
}

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

    // Since I don't have an api key, I'll use a mock responses

    if (dynamicOptions && !apiKey) {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate mock options
      const mockOptions : Record<string, { header: string; options: PreBuiltOption[] }> = {
        browsing: {
          header: "No problem! Let me know if you need anything.",
          options: [
            { id: '1', response: "Actually, I have a question" },
            { id: '2', response: "Show me popular features" },
            { id: '3', response: "Start over" },
          ]
        },
        support: {
          header: "I'd be happy to help! What kind of support do you need?",
          options: [
            { id: '1', response: "I have a billing question" },
            { id: '2', response: "I'm having a technical issue" },
            { id: '3', response: "I need to reset my password" },
            { id: '4', response: "I'd like to speak to someone" },
          ]
        },
        pricing: {
          header: "Great question! What would you like to know about pricing?",
          options: [
            { id: '1', response: "What plans do you offer?" },
            { id: '2', response: "Is there a free trial?" },
            { id: '3', response: "Do you have enterprise pricing?" },
            { id: '4', response: "How does billing work?" },
          ]
        },
        default: {
          header: "Thanks for your message! How can I help further?",
          options: [
            { id: '1', response: "Tell me more about this" },
            { id: '2', response: "I have another question" },
            { id: '3', response: "That's all I needed, thanks!" },
          ]
        }
      }

      // Match message to appropriate category based on keywords
      const messageText = message.toLowerCase();
      let mockData = mockOptions.default;
      
      if (messageText.includes('browsing') || messageText.includes('just looking')) {
        mockData = mockOptions.browsing;
      } else if (messageText.includes('support') || messageText.includes('help') || messageText.includes('account')) {
        mockData = mockOptions.support;
      } else if (messageText.includes('pricing') || messageText.includes('cost') || messageText.includes('price')) {
        mockData = mockOptions.pricing;
      }

      setCurrentOptions(mockData.options);
      setHeaderText(mockData.header);
      aiResponse = `[Mock] ${mockData.header}`;
      setIsLoading(false);
    }
    
    // If OpenAI is enabled and API key provided, get real response
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

