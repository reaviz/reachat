import { Meta, StoryObj } from '@storybook/react';
import { Chat, ChatInput, Session, SessionMessages, SessionMessagePanel } from '../src';
import {
    fakeSessions,
  } from './examples';
import { useState, FC } from 'react';
import { OpenAI } from 'openai';
import { Input } from 'reablocks';
import { ChatPreBuiltResponses } from '../src'

export default {
    title: 'Demos/ChatPreBuiltResponses',
    component: ChatPreBuiltResponses
  } as Meta<typeof ChatPreBuiltResponses>;

  type Story = StoryObj<typeof ChatPreBuiltResponses>;

const endConversationOption = {
  id: 'all_done',
  response: "That's all I need, thanks!",
  followUpHeaderText: "Thanks for stopping by!",
  followUps: [
    { id: 'changed_mind', response: "Actually, I have another question." },
    { id: 'start_over', response: "Start over" }
  ]
};

const preBuiltResponses = [
  {
    id: 'browsing',
    response: "I'm just browsing, thanks for asking.",
    followUpHeaderText: "Thanks for stopping by!",
    followUps: [
      { id: 'changed_mind', response: "Actually, I changed my mind - I have a question." },
      { id: 'start_over', response: "Start over" }
    ]
  },
  {
    id: 'support',
    response: 'I need support with my account.',
    followUpHeaderText: "What kind of support do you need?",
    followUps: [
      { id: 'billing', response: "I have a billing question." },
      { id: 'technical', response: "I'm having a technical issue." },
      { id: 'password', response: "I need to reset my password." },
      { id: 'representative', response: "I'd like to speak to someone." },
      endConversationOption
    ]
  },
  {
    id: 'pricing',
    response: 'Tell me about your pricing.',
    followUpHeaderText: "What would you like to know about pricing?",
    followUps: [
      { id: 'compare', response: "How does this compare to competitors?" },
      { id: 'trial', response: "Is there a free trial?" },
      { id: 'enterprise', response: "Do you have enterprise pricing?" },
      endConversationOption
    ]
  }
];

  export const IndependentComponent: FC = () => {
    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
           <ChatPreBuiltResponses responses={preBuiltResponses} />
        </div>
    );
  }

  export const InsideChat: FC = () => {
    const handleSelectResponse = (response: string) => {
      console.log('Selected response:', response);
    }

    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
            <Chat sessions={fakeSessions} viewType="chat" onSendMessage={handleSelectResponse}>
                <SessionMessagePanel>
                    <div className="flex flex-col h-full justify-between">
                        <ChatPreBuiltResponses responses={preBuiltResponses} />
                        <ChatInput />
                    </div>
                </SessionMessagePanel>
            </Chat>
        </div>
    );
}