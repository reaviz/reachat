import { Dispatch, SetStateAction } from 'react';
import { Session } from '@/types';
import { subHours } from 'date-fns';

/**
 * Creates an onSendMessage handler for story demos.
 * Appends a user message and a canned assistant message to the active session.
 */
export const createSendMessageHandler = (
  setSessions: Dispatch<SetStateAction<Session[]>>,
  activeId: string | undefined
) => (message: string) => {
  if (!activeId) return;

  const id = Date.now().toString();

  setSessions(prev =>
    prev.map(session =>
      session.id === activeId
        ? {
            ...session,
            messages: [
              ...(session.messages ?? []),
              {
                id: `${id}-user`,
                role: 'user',
                content: message,
                createdAt: new Date()
              },
              {
                id: `${id}-assistant`,
                role: 'assistant',
                content: 'This is a response to your question.',
                createdAt: new Date()
              }
            ]
          }
        : session
    )
  );
};

export const fakeSessions: Session[] = [
  {
    id: '1',
    title: 'Session 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'What is React?',
        createdAt: new Date()
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content:
          'React is a JavaScript library for building user interfaces.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'What is JSX?',
        createdAt: new Date()
      },
      {
        id: '2-assistant',
        role: 'assistant',
        content: 'JSX is a syntax extension for JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '2',
    title: 'Session 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'What is TypeScript?',
        createdAt: new Date()
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content: 'TypeScript is a typed superset of JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'What is a component?',
        createdAt: new Date()
      },
      {
        id: '2-assistant',
        role: 'assistant',
        content: 'A component is a reusable piece of UI.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

/**
 * Legacy shaped sessions used to demonstrate that the deprecated
 * `conversations` field still renders via the compatibility layer.
 */
export const legacyConversationSessions: Session[] = [
  {
    id: 'legacy-1',
    title: 'Legacy Session',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is React?',
        response: 'React is a JavaScript library for building user interfaces.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is JSX?',
        response: 'JSX is a syntax extension for JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export const sessionsWithFiles: Session[] = [
  {
    id: 'session-files',
    title: 'Session with Files',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'Here are some files I uploaded',
        createdAt: new Date(),
        files: [
          { name: 'document.pdf', size: 1024000, type: 'application/pdf' },
          {
            name: 'report.docx',
            size: 512000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        ]
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content:
          'Ive received your files. Let me know if you have any questions about them.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export const sessionWithSources: Session[] = [
  {
    id: 'session-sources',
    title: 'Session with Sources',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    messages: [
      {
        id: 'message-1',
        role: 'user',
        content: 'What are the main causes of climate change?',
        createdAt: new Date()
      },
      {
        id: 'message-2',
        role: 'assistant',
        content: `Climate change is primarily caused by human activities that release greenhouse gases into the atmosphere. The main causes include:

1. Burning of fossil fuels (coal, oil, and natural gas)
2. Deforestation and land-use changes
3. Industrial processes
4. Agriculture and livestock farming

These activities increase the concentration of greenhouse gases in the atmosphere, leading to the greenhouse effect and global warming.`,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: [
          {
            title: 'NASA: Causes of Climate Change',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1224px-NASA_logo.svg.png',
            url: 'https://climate.nasa.gov/causes/'
          },
          {
            title:
              'IPCC: Climate Change 2021: The Physical Science Basis and Global Warming Is the Last War We will Fight',
            url: 'https://www.ipcc.ch/report/ar6/wg1/'
          }
        ]
      }
    ]
  }
];

export const fakeSessionsWithEmbeds: Session[] = [
  {
    id: '1',
    title: 'Session with Embeds',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'Can you show me a video about React?',
        createdAt: new Date()
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content: `
## Watch this video

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ

These links showcase a video about React basics. You can click on either link to watch the video.`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'Do you have another video recommendation?',
        createdAt: new Date()
      },
      {
        id: '2-assistant',
        role: 'assistant',
        content: `
Certainly! Here's another great video about web development:

## Check out this tutorial

https://www.youtube.com/watch?v=dQw4w9WgXcQ

This video covers some interesting web development concepts.`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

/**
 * A session whose last message is from the user, so an assistant reply is
 * still pending. Pair with `isLoading` to render the pending placeholder.
 */
export const sessionsWithPendingResponse: Session[] = [
  {
    id: '1',
    title: 'Session with Pending Response',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'What is the capital of France?',
        createdAt: new Date()
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content: 'The capital of France is Paris.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'What is the largest planet in our solar system?',
        createdAt: new Date()
      }
    ]
  }
];

export const sessionWithDataDocs: Session[] = [
  {
    id: '1',
    title: 'Session with Data Docs',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'Summarize the contents of the CSV.',
        createdAt: new Date(),
        files: [{ name: 'sample.csv', size: 1024000, type: 'text/csv' }]
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content:
          'The CSV file contains a dataset with the following columns: Name, Age, Occupation, and City.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'How does this data align with this PDF?',
        createdAt: new Date(),
        files: [{ name: 'document.pdf', size: 1024000, type: 'application/pdf' }]
      }
    ]
  }
];

export const sessionWithCSVFiles: Session[] = [
  {
    id: '1',
    title: 'Session with CSV Files',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'Summarize the contents of the CSV.',
        createdAt: new Date(),
        files: [
          {
            name: 'sample.csv',
            size: 500,
            type: 'text/csv',
            url: 'https://gist.githubusercontent.com/RobVanGroenewoud/ba89ad7684df8cefe5c183adb498cc65/raw/f2eec6d2cb89f5d779e16b28ed0dab89d738ba96/sample.csv'
          }
        ]
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content:
          'The CSV file contains a dataset with the following columns: Name, HEX, RGB.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2-user',
        role: 'user',
        content: 'How does this data align with this PDF?',
        createdAt: new Date(),
        files: [{ name: 'document.pdf', size: 1024000, type: 'application/pdf' }]
      }
    ]
  }
];

export const chatTemplates = [
  {
    id: '1',
    title: 'Explore Components',
    message: 'Can you show me the main components available in Reachat?',
    icon: 'SendPlane'
  },
  {
    id: '2',
    title: 'Customize Chat UI',
    message: 'How can I customize the appearance of my Reachat interface?',
    icon: 'SendPlane'
  },
  {
    id: '3',
    title: 'Manage Sessions',
    message: 'What are the best practices for managing chat sessions in Reachat?',
    icon: 'SendPlane'
  },
  {
    id: '4',
    title: 'Tailwind Setup',
    message: 'How do I properly set up Tailwind CSS with Reachat?',
    icon: 'SendPlane'
  }
];

export const defaultSuggestions = [
  {
    id: '1',
    content: 'Tell me more about this topic'
  },
  {
    id: '2',
    content: 'Can you provide an example?'
  },
  {
    id: '3',
    content: 'What are the best practices?'
  }
];

export const sessionWithSuggestions: Session[] = [
  {
    id: 'session-suggestions',
    title: 'Session with Suggestions',
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: '1-user',
        role: 'user',
        content: 'What is React?',
        createdAt: new Date()
      },
      {
        id: '1-assistant',
        role: 'assistant',
        content:
          'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];
