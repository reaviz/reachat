import { Meta, StoryObj } from '@storybook/react';
import { Chat, Session } from '../src';
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
      <div
        className="dark:bg-gray-950 bg-white"
        style={{
          width: 350,
          height: 500,
          padding: 20,
          borderRadius: 5
        }}
      >

        <h1>HI THIS IS A PRE BUILT RESPONSES</h1>
        {/* <Chat
          viewType="chat"
          sessions={sessions}
          activeSessionId={activeId}
          onNewSession={() => {
            const newId = (sessions.length + 1).toLocaleString();
            setSessions([
              ...sessions,
              {
                id: newId,
                title: `New Session #${newId}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                conversations: []
              }
            ]);
            setActiveId(newId);
          }}
          onSelectSession={setActiveId}
          onDeleteSession={() => alert('delete!')}
        >
        </Chat> */}
      </div>
    );
}