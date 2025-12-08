import { Meta, StoryObj } from '@storybook/react';
import { Chat, ChatInput, SessionMessagePanel } from '../src';
import {
    fakeSessions,
  } from './examples';
import { useState, FC } from 'react';
import { useSessionManager } from './useSessionManager';
import { OpenAI } from 'openai';
import { ChatPreBuiltResponses } from '../src'

export default {
    title: 'Demos/ChatPreBuiltResponses',
    component: ChatPreBuiltResponses
  } as Meta<typeof ChatPreBuiltResponses>;

  const initialOptions = [
    { id: '1', response: "I'm just browsing, thanks for asking." },
    { id: '2', response: 'I need support with my account.' },
    { id: '3', response: 'Tell me about your pricing.' },
  ];

  export const IndependentComponent: FC = () => {

    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
           <ChatPreBuiltResponses options={initialOptions} />
        </div>
    );
  }

  export const InsideChatWithAI: FC = () => {

    const [apiKey, setApiKey] = useState<string>('');

    const {
      sessions,
      currentOptions,
      isLoading,
      headerText,
      activeSessionId,
      handleSendMessage,
      setActiveSessionId
    } = useSessionManager({
      apiKey,
      useOpenAI: true,
      dynamicOptions: true,
      initialOptions,
      initialHeaderText: 'Hi, What can I help you with?',
    });

    const handleSelectOption = (option: { id: string; response: string }) => {
      handleSendMessage(option.response);
    }

    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
            <Chat
              sessions={sessions} 
              viewType="chat" 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            >
                <SessionMessagePanel>
                    <div className="flex flex-col h-full justify-between">
                        <ChatPreBuiltResponses
                          options={currentOptions}
                          headerText={headerText}
                          onSelectOption={handleSelectOption}
                          isLoading={isLoading}
                        />
                        <ChatInput />
                    </div>
                </SessionMessagePanel>
            </Chat>
        </div>
    );
}