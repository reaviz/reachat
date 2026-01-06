import { Meta } from '@storybook/react';
import { subHours } from 'date-fns';
import {
  Chat,
  Session,
  remarkChart,
  chartComponents,
  SessionsList,
  SessionGroups,
  NewSessionButton,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader
} from '../src';

export default {
  title: 'Demos/Charts',
  component: Chat
} as Meta;

const barChartData = {
  type: 'bar',
  data: [
    { key: 'JavaScript', data: 35 },
    { key: 'Python', data: 28 },
    { key: 'TypeScript', data: 22 },
    { key: 'Go', data: 15 },
    { key: 'Rust', data: 10 }
  ],
  width: 450,
  height: 300,
  title: 'Programming Language Popularity'
};

const lineChartData = {
  type: 'line',
  data: [
    { key: 'Jan', data: 100 },
    { key: 'Feb', data: 150 },
    { key: 'Mar', data: 180 },
    { key: 'Apr', data: 220 },
    { key: 'May', data: 280 },
    { key: 'Jun', data: 350 }
  ],
  width: 450,
  height: 250,
  title: 'Monthly Revenue Growth'
};

const pieChartData = {
  type: 'pie',
  data: [
    { key: 'Desktop', data: 45 },
    { key: 'Mobile', data: 35 },
    { key: 'Tablet', data: 15 },
    { key: 'Other', data: 5 }
  ],
  width: 350,
  height: 300,
  title: 'Device Usage Distribution'
};

const areaChartData = {
  type: 'area',
  data: [
    { key: 'Week 1', data: 50 },
    { key: 'Week 2', data: 80 },
    { key: 'Week 3', data: 65 },
    { key: 'Week 4', data: 95 },
    { key: 'Week 5', data: 120 },
    { key: 'Week 6', data: 140 }
  ],
  width: 450,
  height: 250,
  title: 'Weekly User Engagement'
};

const sessionWithCharts: Session[] = [
  {
    id: 'session-charts',
    title: 'Data Analysis with Charts',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conversation-1',
        question: 'Can you show me the programming language popularity data as a bar chart?',
        response: `Sure! Here's a bar chart showing the popularity of programming languages based on recent survey data:

\`\`\`chart
${JSON.stringify(barChartData, null, 2)}
\`\`\`

As you can see, JavaScript leads the pack with 35% popularity, followed by Python at 28%. TypeScript has been growing rapidly and now sits at 22%.`,
        createdAt: subHours(new Date(), 1)
      },
      {
        id: 'conversation-2',
        question: 'What about the monthly revenue growth? Can you visualize that?',
        response: `Absolutely! Here's a line chart showing the monthly revenue growth for the first half of the year:

\`\`\`chart
${JSON.stringify(lineChartData, null, 2)}
\`\`\`

The trend shows consistent growth, with revenue increasing from $100K in January to $350K in June - a 250% increase over 6 months!`,
        createdAt: subHours(new Date(), 0.5)
      },
      {
        id: 'conversation-3',
        question: 'How about device usage? A pie chart would be great for that.',
        response: `Great choice! Pie charts are perfect for showing distribution. Here's the device usage breakdown:

\`\`\`chart
${JSON.stringify(pieChartData, null, 2)}
\`\`\`

Desktop still dominates at 45%, but mobile is catching up fast at 35%. Tablet usage is at 15%.`,
        createdAt: new Date()
      }
    ]
  }
];

const sessionWithMultipleCharts: Session[] = [
  {
    id: 'session-multi-charts',
    title: 'Quarterly Report',
    createdAt: subHours(new Date(), 2),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conversation-1',
        question: 'Can you give me a comprehensive analysis with multiple charts?',
        response: `Of course! Let me present the quarterly analysis with multiple visualizations.

## Revenue Trend

\`\`\`chart
${JSON.stringify(lineChartData, null, 2)}
\`\`\`

## User Engagement

\`\`\`chart
${JSON.stringify(areaChartData, null, 2)}
\`\`\`

## Market Share by Device

\`\`\`chart
${JSON.stringify(pieChartData, null, 2)}
\`\`\`

### Key Takeaways:
1. **Revenue** has grown 250% over 6 months
2. **User engagement** shows steady weekly increases
3. **Mobile adoption** is approaching desktop usage levels`,
        createdAt: new Date()
      }
    ]
  }
];

export const BarChartExample = () => {
  return (
    <div
      className="dark:bg-gray-950 bg-white"
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
        sessions={sessionWithCharts}
        activeSessionId="session-charts"
        remarkPlugins={[remarkChart]}
        markdownComponents={chartComponents}
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

export const MultipleCharts = () => {
  return (
    <div
      className="dark:bg-gray-950 bg-white"
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
        sessions={sessionWithMultipleCharts}
        activeSessionId="session-multi-charts"
        remarkPlugins={[remarkChart]}
        markdownComponents={chartComponents}
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

export const AllChartTypes = () => {
  const sparklineData = {
    type: 'sparkline',
    data: [
      { key: '1', data: 10 },
      { key: '2', data: 25 },
      { key: '3', data: 15 },
      { key: '4', data: 35 },
      { key: '5', data: 30 },
      { key: '6', data: 45 },
      { key: '7', data: 40 }
    ],
    width: 200,
    height: 50
  };

  const sessionAllCharts: Session[] = [
    {
      id: 'session-all-charts',
      title: 'Chart Types Showcase',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: 'Show me all the different chart types available.',
          response: `Here's a showcase of all available chart types:

## Bar Chart
\`\`\`chart
${JSON.stringify(barChartData, null, 2)}
\`\`\`

## Line Chart
\`\`\`chart
${JSON.stringify(lineChartData, null, 2)}
\`\`\`

## Area Chart
\`\`\`chart
${JSON.stringify(areaChartData, null, 2)}
\`\`\`

## Pie Chart
\`\`\`chart
${JSON.stringify(pieChartData, null, 2)}
\`\`\`

## Sparkline (inline mini-chart)
\`\`\`chart
${JSON.stringify(sparklineData, null, 2)}
\`\`\`

Each chart type is optimized for different use cases:
- **Bar charts** for comparisons
- **Line charts** for trends over time
- **Area charts** for cumulative data
- **Pie charts** for proportions
- **Sparklines** for compact inline visualizations`,
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
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
        sessions={sessionAllCharts}
        activeSessionId="session-all-charts"
        remarkPlugins={[remarkChart]}
        markdownComponents={chartComponents}
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

export const ChatViewWithCharts = () => {
  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5,
        maxWidth: 800,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <Chat
        viewType="chat"
        sessions={sessionWithCharts}
        activeSessionId="session-charts"
        remarkPlugins={[remarkChart]}
        markdownComponents={chartComponents}
      >
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
