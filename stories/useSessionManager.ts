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

      // Generate mock options - organized by conversation flow
      const mockOptions: Record<string, { header: string; options: PreBuiltOption[] }> = {
        // Level 1: User is just browsing
        browsing: {
          header: "No problem! Feel free to look around. Need anything?",
          options: [
            { id: '1', response: "Actually, I do have a question" },
            { id: '2', response: "What are your most popular features?" },
            { id: '3', response: "That's all, thanks!" },
          ]
        },
        // Level 1: User needs support
        support: {
          header: "I'd be happy to help! What kind of support do you need?",
          options: [
            { id: '1', response: "I have a billing question" },
            { id: '2', response: "I'm having a technical issue" },
            { id: '3', response: "I need to reset my password" },
            { id: '4', response: "I'd like to speak to a representative" },
          ]
        },
        // Level 1: User asking about pricing
        pricing: {
          header: "Great question! What would you like to know about pricing?",
          options: [
            { id: '1', response: "What plans do you offer?" },
            { id: '2', response: "Is there a free trial?" },
            { id: '3', response: "Do you have enterprise pricing?" },
            { id: '4', response: "How does billing work?" },
          ]
        },
        // Level 2: Support - Billing
        billing: {
          header: "I can help with billing! What's your question?",
          options: [
            { id: '1', response: "I need to update my payment method" },
            { id: '2', response: "I have a charge I don't recognize" },
            { id: '3', response: "I want to cancel my subscription" },
            { id: '4', response: "Go back to support options" },
          ]
        },
        // Level 2: Support - Technical
        technical: {
          header: "Let's troubleshoot! What's happening?",
          options: [
            { id: '1', response: "The app is running slowly" },
            { id: '2', response: "I'm getting an error message" },
            { id: '3', response: "A feature isn't working" },
            { id: '4', response: "Go back to support options" },
          ]
        },
        // Level 2: Support - Password
        password: {
          header: "No problem! I'll help you reset your password.",
          options: [
            { id: '1', response: "Send me a reset email" },
            { id: '2', response: "I'm not receiving the reset email" },
            { id: '3', response: "Go back to support options" },
          ]
        },
        // Level 2: Support - Representative
        representative: {
          header: "I'll connect you with our team!",
          options: [
            { id: '1', response: "Schedule a call" },
            { id: '2', response: "Start a live chat" },
            { id: '3', response: "Send an email instead" },
            { id: '4', response: "Go back to support options" },
          ]
        },
        // Level 2: Pricing - Plans
        plans: {
          header: "We offer three plans: Basic, Pro, and Enterprise.",
          options: [
            { id: '1', response: "Tell me about the Basic plan" },
            { id: '2', response: "Tell me about the Pro plan" },
            { id: '3', response: "Tell me about Enterprise" },
            { id: '4', response: "Go back to pricing options" },
          ]
        },
        // Level 2: Pricing - Trial
        trial: {
          header: "Yes! We offer a 14-day free trial with full access.",
          options: [
            { id: '1', response: "Start my free trial" },
            { id: '2', response: "What happens after the trial?" },
            { id: '3', response: "Go back to pricing options" },
          ]
        },
        // Ending/Thank you
        thanks: {
          header: "Thanks for stopping by! Anything else I can help with?",
          options: [
            { id: '1', response: "Actually, I have another question" },
            { id: '2', response: "No, that's everything!" },
          ]
        },
        // Final goodbye
        goodbye: {
          header: "Great talking with you! Have a wonderful day! 👋",
          options: [
            { id: '1', response: "Start a new conversation" },
          ]
        },
        // Start/Reset - mirrors initial options
        start: {
          header: "Hi! What can I help you with?",
          options: [
            { id: '1', response: "I'm just browsing, thanks for asking." },
            { id: '2', response: "I need support with my account." },
            { id: '3', response: "Tell me about your pricing." },
          ]
        },
        // Default fallback
        default: {
          header: "Thanks for your message! How can I help further?",
          options: [
            { id: '1', response: "I need support with my account" },
            { id: '2', response: "Tell me about your pricing" },
            { id: '3', response: "That's all I needed, thanks!" },
          ]
        }
      };

      // Match message to appropriate category based on keywords
      const messageText = message.toLowerCase();
      let mockData = mockOptions.default;
      
      // Level 1 matches
      if (messageText.includes('browsing') || messageText.includes('just looking')) {
        mockData = mockOptions.browsing;
      } else if (messageText.includes('pricing') || messageText.includes('cost') || messageText.includes('price')) {
        mockData = mockOptions.pricing;
      } else if (messageText.includes('support') || messageText.includes('help') || messageText.includes('account')) {
        mockData = mockOptions.support;
      }
      // Level 2: Support sub-options
      else if (messageText.includes('billing') || messageText.includes('payment') || messageText.includes('charge')) {
        mockData = mockOptions.billing;
      } else if (messageText.includes('technical') || messageText.includes('issue') || messageText.includes('error')) {
        mockData = mockOptions.technical;
      } else if (messageText.includes('password') || messageText.includes('reset')) {
        mockData = mockOptions.password;
      } else if (messageText.includes('representative') || messageText.includes('speak') || messageText.includes('someone')) {
        mockData = mockOptions.representative;
      }
      // Level 2: Pricing sub-options
      else if (messageText.includes('plans') || messageText.includes('offer')) {
        mockData = mockOptions.plans;
      } else if (messageText.includes('trial') || messageText.includes('free')) {
        mockData = mockOptions.trial;
      }
      // Endings and restarts
      else if (messageText.includes('no,') && messageText.includes('everything')) {
        // "No, that's everything!" → goodbye
        mockData = mockOptions.goodbye;
      } else if (messageText.includes('start') && messageText.includes('new')) {
        // "Start a new conversation" → reset to beginning
        mockData = mockOptions.start;
      } else if (messageText.includes('thanks') || messageText.includes('that\'s all')) {
        mockData = mockOptions.thanks;
      } else if (messageText.includes('question') || messageText.includes('another')) {
        mockData = mockOptions.default;
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

