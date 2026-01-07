import { Meta } from '@storybook/react';
import { useState, useRef, useCallback } from 'react';
import { Chat, Session } from '../src';
import { RichTextEditor, RichTextEditorRef } from '../src/ChatInput/RichTextEditor';
import { InputPluginItem } from '../src/ChatInput/types';
import { fakeSessions } from './examples';

export default {
  title: 'Components/RichTextEditor',
  component: RichTextEditor
} as Meta;

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [sessions] = useState<Session[]>(fakeSessions);
  
  return (
    <Chat
      viewType="chat"
      sessions={sessions}
      activeSessionId={fakeSessions[0].id}
    >
      <div
        className="dark:bg-gray-950 bg-white p-5 rounded-lg"
        style={{ width: 500 }}
      >
        {children}
      </div>
    </Chat>
  );
};

export const Basic = () => {
  const [value, setValue] = useState('');

  return (
    <Wrapper>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <RichTextEditor
          value={value}
          placeholder="Type something..."
          onChange={setValue}
          autoFocus
        />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <strong>Value:</strong> {value || '(empty)'}
      </div>
    </Wrapper>
  );
};

export const WithFormatting = () => {
  const [value, setValue] = useState('');
  const editorRef = useRef<RichTextEditorRef>(null);

  const applyBold = () => {
    editorRef.current?.getEditor()?.chain().focus().toggleBold().run();
  };

  const applyItalic = () => {
    editorRef.current?.getEditor()?.chain().focus().toggleItalic().run();
  };

  const applyCode = () => {
    editorRef.current?.getEditor()?.chain().focus().toggleCode().run();
  };

  return (
    <Wrapper>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={applyBold}
            className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold"
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={applyItalic}
            className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 italic"
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            onClick={applyCode}
            className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-mono text-sm"
            title="Code (Ctrl+`)"
          >
            {'</>'}
          </button>
        </div>
        <RichTextEditor
          ref={editorRef}
          value={value}
          placeholder="Try Ctrl+B for bold, Ctrl+I for italic..."
          formatting={{ bold: true, italic: true, code: true }}
          onChange={setValue}
          autoFocus
        />
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Use keyboard shortcuts: <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl+B</kbd> bold,{' '}
        <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl+I</kbd> italic,{' '}
        <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">Ctrl+`</kbd> code
      </p>
    </Wrapper>
  );
};

export const WithMentions = () => {
  const [value, setValue] = useState('');

  const users: InputPluginItem[] = [
    { id: '1', label: 'John Doe', description: 'Engineering', icon: <UserIcon /> },
    { id: '2', label: 'Jane Smith', description: 'Design', icon: <UserIcon /> },
    { id: '3', label: 'Bob Wilson', description: 'Product', icon: <UserIcon /> },
    { id: '4', label: 'Alice Brown', description: 'Marketing', icon: <UserIcon /> },
  ];

  return (
    <Wrapper>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <RichTextEditor
          value={value}
          placeholder="Type @ to mention someone..."
          triggers={[
            {
              trigger: '@',
              items: users,
              renderHeader: () => <span>Team Members</span>
            }
          ]}
          onChange={setValue}
          autoFocus
        />
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Type <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">@</kbd> to mention a team member
      </p>
    </Wrapper>
  );
};

export const WithSlashCommands = () => {
  const [value, setValue] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const commands: InputPluginItem[] = [
    { id: 'help', label: 'help', description: 'Show help' },
    { id: 'clear', label: 'clear', description: 'Clear input' },
    { id: 'code', label: 'code', description: 'Insert code block', metadata: { value: '```\n\n```' } },
    { id: 'bold', label: 'bold', description: 'Make text bold', metadata: { value: '**bold text**' } },
  ];

  return (
    <Wrapper>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <RichTextEditor
          value={value}
          placeholder="Type / for commands..."
          triggers={[
            {
              trigger: '/',
              items: commands,
              renderHeader: () => <span>Commands</span>,
              onSelect: (item, insertText) => {
                setLastCommand(item.label);
                const cmdValue = (item.metadata as { value?: string })?.value;
                if (cmdValue) {
                  insertText(cmdValue);
                }
              }
            }
          ]}
          onChange={setValue}
          autoFocus
        />
      </div>
      {lastCommand && (
        <div className="mt-3 text-sm text-green-600 dark:text-green-400">
          Last command: /{lastCommand}
        </div>
      )}
    </Wrapper>
  );
};

export const Disabled = () => {
  return (
    <Wrapper>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden opacity-60">
        <RichTextEditor
          value="This editor is disabled"
          placeholder="Type something..."
          disabled
        />
      </div>
    </Wrapper>
  );
};

export const WithSubmitHandler = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const editorRef = useRef<RichTextEditorRef>(null);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      setMessages(prev => [...prev, value]);
      setValue('');
      editorRef.current?.setContent('');
    }
  }, [value]);

  return (
    <Wrapper>
      <div className="space-y-3">
        <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet. Press Enter to send.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className="mb-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                {msg}
              </div>
            ))
          )}
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <RichTextEditor
            ref={editorRef}
            value={value}
            placeholder="Type a message and press Enter..."
            onChange={setValue}
            onSubmit={handleSubmit}
            autoFocus
          />
        </div>
        <p className="text-xs text-gray-400">
          Press <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> to send,{' '}
          <kbd className="px-1 bg-gray-100 dark:bg-gray-800 rounded">Shift+Enter</kbd> for new line
        </p>
      </div>
    </Wrapper>
  );
};

export const ImperativeAPI = () => {
  const editorRef = useRef<RichTextEditorRef>(null);
  const [output, setOutput] = useState('');

  return (
    <Wrapper>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editorRef.current?.focus()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Focus
          </button>
          <button
            onClick={() => editorRef.current?.blur()}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Blur
          </button>
          <button
            onClick={() => editorRef.current?.insertText(' [inserted] ')}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Insert Text
          </button>
          <button
            onClick={() => editorRef.current?.setContent('Content was set!')}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Set Content
          </button>
          <button
            onClick={() => setOutput(editorRef.current?.getContent() || '')}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Get Content
          </button>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <RichTextEditor
            ref={editorRef}
            placeholder="Use the buttons above to interact..."
            autoFocus
          />
        </div>
        {output && (
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
            <strong>Content:</strong> {output}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
