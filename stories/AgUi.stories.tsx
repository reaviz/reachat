import { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  SessionsList,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  useAgUi
} from '../src';
import { Input } from 'reablocks';

export default {
  title: 'Demos/AG-UI Protocol',
  component: Chat
} as Meta;

export const Basic = () => {
  const [endpoint, setEndpoint] = useState('');

  const agui = useAgUi({
    agent: endpoint || 'http://localhost:3000/api/agent',
    onError: err => console.error('AG-UI error:', err),
    onEvent: event => console.log('AG-UI event:', event)
  });

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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ paddingBottom: 8, flexShrink: 0 }}>
        <Input
          placeholder="AG-UI agent endpoint URL"
          value={endpoint}
          onChange={e => setEndpoint((e.target as HTMLInputElement).value)}
        />
      </div>
      <Chat
        style={{ flex: 1, minHeight: 0 }}
        viewType="console"
        sessions={agui.sessions}
        activeSessionId={agui.activeSessionId}
        isLoading={agui.isLoading}
        onSelectSession={agui.selectSession}
        onDeleteSession={agui.deleteSession}
        onNewSession={agui.createSession}
        onSendMessage={agui.sendMessage}
        onStopMessage={agui.stopMessage}
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

export const WithToolCalls = () => {
  const [endpoint, setEndpoint] = useState('');

  const agui = useAgUi({
    agent: endpoint || 'http://localhost:3000/api/agent',
    tools: [
      {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'City name'
            }
          },
          required: ['location']
        }
      }
    ],
    onToolCall: async toolCall => {
      console.log('Tool called:', toolCall);
      if (toolCall.toolCallName === 'get_weather') {
        const args = JSON.parse(toolCall.args);
        return JSON.stringify({
          location: args.location,
          temperature: 72,
          condition: 'sunny'
        });
      }
      return '{}';
    },
    onError: err => console.error('AG-UI error:', err)
  });

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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ paddingBottom: 8, flexShrink: 0 }}>
        <Input
          placeholder="AG-UI agent endpoint URL"
          value={endpoint}
          onChange={e => setEndpoint((e.target as HTMLInputElement).value)}
        />
      </div>
      <Chat
        style={{ flex: 1, minHeight: 0 }}
        viewType="console"
        sessions={agui.sessions}
        activeSessionId={agui.activeSessionId}
        isLoading={agui.isLoading}
        onSelectSession={agui.selectSession}
        onDeleteSession={agui.deleteSession}
        onNewSession={agui.createSession}
        onSendMessage={agui.sendMessage}
        onStopMessage={agui.stopMessage}
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
