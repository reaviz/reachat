import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import {
  MessageStatus,
  MessageStatusStep,
  MessageStatusState
} from '../src/MessageStatus';

export default {
  title: 'Demos/MessageStatus',
  component: MessageStatus,
  args: {
    text: 'Analyzing your request...',
    status: 'loading'
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['loading', 'complete', 'error'],
      description: 'Current status state'
    },
    text: {
      control: 'text',
      description: 'Main status text to display'
    },
    steps: {
      description: 'Optional sub-steps to display'
    },
    icon: {
      description: 'Custom icon to display'
    },
    theme: {
      description: 'Custom theme overrides'
    },
    className: {
      description: 'Additional CSS classes'
    }
  }
} as Meta<typeof MessageStatus>;

type Story = StoryObj<typeof MessageStatus>;

export const Loading: Story = {
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const Complete: Story = {
  args: {
    status: 'complete',
    text: 'Analysis complete'
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const Error: Story = {
  args: {
    status: 'error',
    text: 'Failed to analyze request'
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const WithSteps: Story = {
  args: {
    text: 'Processing your code...',
    steps: [
      { id: '1', text: 'Reading file contents', status: 'complete' },
      { id: '2', text: 'Analyzing dependencies', status: 'complete' },
      { id: '3', text: 'Running linter checks', status: 'loading' },
      { id: '4', text: 'Generating suggestions', status: 'loading' }
    ]
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const WithStepsComplete: Story = {
  args: {
    status: 'complete',
    text: 'Code analysis complete',
    steps: [
      { id: '1', text: 'Reading file contents', status: 'complete' },
      { id: '2', text: 'Analyzing dependencies', status: 'complete' },
      { id: '3', text: 'Running linter checks', status: 'complete' },
      { id: '4', text: 'Generating suggestions', status: 'complete' }
    ]
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const WithStepsError: Story = {
  args: {
    status: 'error',
    text: 'Analysis failed',
    steps: [
      { id: '1', text: 'Reading file contents', status: 'complete' },
      { id: '2', text: 'Analyzing dependencies', status: 'complete' },
      { id: '3', text: 'Running linter checks', status: 'error' }
    ]
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const AllStates: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <MessageStatus status="loading" text="Searching files..." />
      <MessageStatus status="complete" text="Search complete" />
      <MessageStatus status="error" text="Search failed" />
    </div>
  )
};

export const InteractiveDemo: Story = {
  render: () => {
    const [status, setStatus] = useState<MessageStatusState>('loading');
    const [steps, setSteps] = useState<MessageStatusStep[]>([
      { id: '1', text: 'Searching codebase', status: 'loading' },
      { id: '2', text: 'Analyzing results', status: 'loading' },
      { id: '3', text: 'Generating response', status: 'loading' }
    ]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next > steps.length) {
            setStatus('complete');
            clearInterval(interval);
            return prev;
          }
          setSteps(prevSteps =>
            prevSteps.map((step, idx) => ({
              ...step,
              status: idx < next ? 'complete' : 'loading'
            }))
          );
          return next;
        });
      }, 1500);

      return () => clearInterval(interval);
    }, []);

    const statusText =
      status === 'complete'
        ? 'Task completed successfully'
        : 'Processing your request...';

    return (
      <div className="w-[400px]">
        <MessageStatus status={status} text={statusText} steps={steps} />
      </div>
    );
  }
};

export const ToolUsageExample: Story = {
  render: () => {
    const [steps, setSteps] = useState<MessageStatusStep[]>([]);
    const [status, setStatus] = useState<MessageStatusState>('loading');
    const [text, setText] = useState('Starting tool execution...');

    useEffect(() => {
      const timeline = [
        {
          delay: 500,
          action: () => {
            setText('Using Read tool...');
            setSteps([{ id: '1', text: 'Reading package.json', status: 'loading' as const }]);
          }
        },
        {
          delay: 1500,
          action: () => {
            setSteps(prev =>
              prev.map(s => (s.id === '1' ? { ...s, status: 'complete' as const } : s))
            );
          }
        },
        {
          delay: 2000,
          action: () => {
            setText('Using Grep tool...');
            setSteps(prev => [
              ...prev,
              { id: '2', text: 'Searching for imports', status: 'loading' as const }
            ]);
          }
        },
        {
          delay: 3500,
          action: () => {
            setSteps(prev =>
              prev.map(s => (s.id === '2' ? { ...s, status: 'complete' as const } : s))
            );
          }
        },
        {
          delay: 4000,
          action: () => {
            setText('Using Edit tool...');
            setSteps(prev => [
              ...prev,
              { id: '3', text: 'Modifying source file', status: 'loading' as const }
            ]);
          }
        },
        {
          delay: 5500,
          action: () => {
            setSteps(prev =>
              prev.map(s => (s.id === '3' ? { ...s, status: 'complete' as const } : s))
            );
            setText('Tools completed');
            setStatus('complete');
          }
        }
      ];

      const timeouts = timeline.map(item =>
        setTimeout(item.action, item.delay)
      );

      return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
      <div className="w-[400px]">
        <MessageStatus status={status} text={text} steps={steps} />
      </div>
    );
  }
};

export const MultipleStatuses: Story = {
  render: () => (
    <div className="w-[500px] space-y-3">
      <MessageStatus
        status="complete"
        text="Read src/index.ts"
        steps={[
          { id: '1', text: '156 lines read', status: 'complete' }
        ]}
      />
      <MessageStatus
        status="complete"
        text="Grep for dependencies"
        steps={[
          { id: '1', text: 'Found 12 matches', status: 'complete' }
        ]}
      />
      <MessageStatus
        status="loading"
        text="Analyzing code patterns"
        steps={[
          { id: '1', text: 'Parsing AST', status: 'complete' },
          { id: '2', text: 'Finding patterns', status: 'loading' }
        ]}
      />
    </div>
  )
};

export const CustomStyling: Story = {
  args: {
    text: 'Custom styled status',
    className: 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30'
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};

export const LongText: Story = {
  args: {
    text: 'Analyzing complex codebase with multiple files and dependencies to generate comprehensive suggestions',
    steps: [
      { id: '1', text: 'Scanning src/components directory for React components', status: 'complete' },
      { id: '2', text: 'Analyzing TypeScript interfaces and type definitions', status: 'loading' }
    ]
  },
  render: args => (
    <div className="w-[400px]">
      <MessageStatus {...args} />
    </div>
  )
};
