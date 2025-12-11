import type { Meta } from '@storybook/react';
import { subHours } from 'date-fns';
import { cn } from 'reablocks';
import { useState } from 'react';

import type { Session } from '../src';
import {
  Chat,
  ChatInput,
  NewSessionButton,
  SessionGroups,
  SessionMessagePanel,
  SessionMessages,
  SessionMessagesHeader,
  SessionsList
} from '../src';
import AttachIcon from './assets/paperclip.svg?react';
import { sessionsWithFiles, sessionWithCSVFiles } from './examples';

export default {
  title: 'Demos/Files',
  component: Chat
} as Meta;

export const FileUploads = () => {
  const [sessions, setSessions] = useState(sessionsWithFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-files"
        onSendMessage={message =>
          setSessions(sessions => {
            const session = sessions[0];

            setSelectedFile(null);

            return [
              {
                ...session,
                conversations: [
                  ...session.conversations,
                  {
                    id: (Math.random() * 100).toString(),
                    createdAt: new Date(),
                    question: message,
                    ...(selectedFile
                      ? {
                          files: [
                            {
                              name: selectedFile.name,
                              size: selectedFile.size,
                              type: selectedFile.type
                            }
                          ]
                        }
                      : [])
                  }
                ]
              }
            ];
          })
        }
        onFileUpload={setSelectedFile}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            attachIcon={
              <AttachIcon className={cn({ 'text-green-500': selectedFile })} />
            }
            allowedFiles={['.pdf', '.docx']}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CSVPreview = () => {
  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
      style={{
        position: 'absolute',
        inset: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        sessions={sessionWithCSVFiles}
        activeSessionId="1"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput allowedFiles={['.pdf', '.docx', '.csv']} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const ImageFiles = () => {
  const staticImageFiles = [
    {
      id: '1',
      name: 'landscape.jpg',
      type: 'image/jpeg',
      url: 'https://picsum.photos/200?random=1'
    },
    {
      id: '2',
      name: 'portrait.jpg',
      type: 'image/jpeg',
      url: 'https://picsum.photos/200?random=2'
    },
    {
      id: '3',
      name: 'abstract.png',
      type: 'image/jpg',
      url: 'https://picsum.photos/200?random=3'
    },
    {
      id: '4',
      name: 'nature.jpg',
      type: 'image/jpeg',
      url: 'https://picsum.photos/200?random=4'
    }
  ];

  const sessionWithImages: Session[] = [
    {
      id: 'session-images',
      title: 'Multiple Image Files Showcase',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: 'Analyze these images and describe what you see.',
          response:
            "I'm sorry, but as an AI language model, I cannot actually see or analyze images. I can only process and respond to text input. If you'd like me to describe or analyze images, you would need to provide detailed textual descriptions of the images.",
          createdAt: new Date(),
          files: staticImageFiles
        },
        {
          id: 'conversation-2',
          question: 'Analyze these images and describe what you see.',
          response:
            "I'm sorry, but as an AI language model, I cannot actually see or analyze images. I can only process and respond to text input. If you'd like me to describe or analyze images, you would need to provide detailed textual descriptions of the images.",
          createdAt: new Date(),
          files: [staticImageFiles[0]]
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessionWithImages}
        activeSessionId="session-images"
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
