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

  export const PreBuiltSample: FC = () => {


    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 350,
          height: 500,
        }}>
            <ChatPreBuiltResponses
                // initialResponses={initialResponses}
                // followUpResponses={followUpResponses}
            />
        </div>
    );
}