import { Session } from '@/types';
import { subHours } from 'date-fns';

export const fakeSessions: Session[] = [
  {
    id: '1',
    title: 'Session 1',
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
  },
  {
    id: '2',
    title: 'Session 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is TypeScript?',
        response: 'TypeScript is a typed superset of JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is a component?',
        response: 'A component is a reusable piece of UI.',
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
    conversations: [
      {
        id: '1',
        question: 'Here are some files I uploaded',
        response:
          'Ive received your files. Let me know if you have any questions about them.',
        createdAt: new Date(),
        updatedAt: new Date(),
        files: [
          { name: 'document.pdf', size: 1024000, type: 'application/pdf' },
          {
            name: 'report.docx',
            size: 512000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        ]
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
    conversations: [
      {
        id: 'conversation-1',
        question: 'What are the main causes of climate change?',
        response: `Climate change is primarily caused by human activities that release greenhouse gases into the atmosphere. The main causes include:

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
    conversations: [
      {
        id: '1',
        question: 'Can you show me a video about React?',
        response: `
## Watch this video

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ

These links showcase a video about React basics. You can click on either link to watch the video.`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'Do you have another video recommendation?',
        response: `
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

export const sessionsWithPartialConversation: Session[] = [
  {
    id: '1',
    title: 'Session with Partial Conversation',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is the capital of France?',
        response: 'The capital of France is Paris.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is the largest planet in our solar system?',
        response: null, // No response yet
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export const sessionWithMessageResponseRecommended: Session[] = [
  {
    id: 'session-1',
    title: 'Session with Image',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conversation-1',
        question: 'What are the benefits of using React?',
        createdAt: new Date(),
        response:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
        followUpResponse:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png',
        updatedAt: new Date()
      }
    ]
  },
  {
    id: 'session-2',
    title: 'Session with Text',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conversation-2',
        question: 'What are the benefits of using React?',
        createdAt: new Date(),
        response:
          'React benefits include a declarative coding style, component-based architecture, virtual DOM, and a large community and ecosystem.',
        followUpResponse: `React's state management system, which allows components to maintain their own state and re-render only when necessary, makes it easier to build responsive and interactive UIs.`,
        updatedAt: new Date()
      }
    ]
  }
];
