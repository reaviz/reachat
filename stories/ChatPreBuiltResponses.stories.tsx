import { Meta, StoryObj } from '@storybook/react';
import { Chat, ChatInput, Session, SessionMessages, SessionMessagePanel } from '../src';
import {
    fakeSessions,
    sessionWithSources,
    sessionsWithFiles
  } from './examples';
import { useState, FC } from 'react';
import { ChatPreBuiltResponses } from '../src'

export default {
    title: 'Demos/ChatPreBuiltResponses',
    component: ChatPreBuiltResponses
  } as Meta<typeof ChatPreBuiltResponses>;

  type Story = StoryObj<typeof ChatPreBuiltResponses>;

  const initialResponses = [
  {
    id: 'no_thanks',
    response: "I'm just browsing, thanks for asking."
  },
  {
    id: 'support',
    response: 'I need support with my account.'
  }
];

const followUpResponses = [
  {
    id: 'another_question',
    response: 'I have another question.'
  },
  {
    id: 'all_done',
    response: "That's all I need help with, thanks!"
  },
  {
      id: 'speak_to_representative',
      response: "I'd like to speak to a live representative."
    }
];

  export const PreBuiltResponsesInStory: FC = () => {
    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
           
           <ChatPreBuiltResponses
                initialResponses={initialResponses}
                followUpResponses={followUpResponses}
            />
                 
        </div>
    );
  }

  export const PreBuiltResponsesInChat: FC = () => {

    

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
                        <ChatPreBuiltResponses
                            initialResponses={initialResponses}
                            followUpResponses={followUpResponses}
                        />
                        <ChatInput />
                    </div>
                </SessionMessagePanel>
            </Chat>
        </div>
    );
}