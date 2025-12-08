import { Meta, StoryObj } from '@storybook/react';
import { Chat, ChatInput, SessionMessagePanel } from '../src';
import {
    fakeSessions,
  } from './examples';
import { useState, FC } from 'react';
import { OpenAI } from 'openai';
import { ChatPreBuiltResponses } from '../src'

export default {
    title: 'Demos/ChatPreBuiltResponses',
    component: ChatPreBuiltResponses
  } as Meta<typeof ChatPreBuiltResponses>;

  export const IndependentComponent: FC = () => {

    const initialOptions = [
      { id: '1', response: "I'm just browsing, thanks for asking." },
      { id: '2', response: 'I need support with my account.' },
      { id: '3', response: 'Tell me about your pricing.' },
    ];
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