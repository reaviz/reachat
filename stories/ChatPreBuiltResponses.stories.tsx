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

    //   const initialResponses = [
//     {
//       id: 'no_thanks',
//       response: "I'm just browsing, thanks for asking."
//     },
//     {
//       id: 'support',
//       response: 'I need support with my account.'
//     }
//   ];

//   const followUpResponses = [
//     {
//       id: 'more_help',
//       response: 'What else can I help you with?'
//     },
//     {
//       id: 'thanks',
//       response: "You're welcome! Have a great day!"
//     }
//   ];


    return (
        <div className="dark:bg-gray-950 bg-white"
        style={{
          width: 400,
          height: 500,
          padding: 40
        }}>
            <ChatPreBuiltResponses
                // initialResponses={initialResponses}
                // followUpResponses={followUpResponses}
            />
        </div>
    );
}