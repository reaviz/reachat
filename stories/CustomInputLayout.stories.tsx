import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import {
  Chat,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  Session,
  SendButton,
  StopButton,
  ChatInputRenderContext
} from '../src';
import { fakeSessions, createSendMessageHandler } from './examples';

export default {
  title: 'Demos/Custom Input Layout',
  component: ChatInput
} as Meta;

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-3.5 h-3.5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const BoltIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/**
 * Demonstrates a model selector dropdown rendered in the `append` slot,
 * below the text editor but inside the input container.
 */
export const WithModelSelector: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const models = [
    { id: 'gpt-4o', label: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast & cheap' },
    { id: 'claude-sonnet', label: 'Claude Sonnet', description: 'Balanced' },
    { id: 'claude-haiku', label: 'Claude Haiku', description: 'Fastest' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            append={
              <div className="flex items-center gap-2 px-1 pb-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                      bg-gray-100 hover:bg-gray-200 text-gray-600
                      dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                      transition-colors cursor-pointer"
                  >
                    <BoltIcon />
                    {selectedModel}
                    <ChevronDownIcon />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute bottom-full left-0 mb-1 w-48 py-1
                        bg-white border border-gray-200 rounded-lg shadow-lg
                        dark:bg-gray-900 dark:border-gray-700 z-20"
                    >
                      {models.map(model => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model.label);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            ${selectedModel === model.label ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                          `}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {model.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates a toolbar in the `prepend` slot with quick-action buttons
 * rendered above the text editor.
 */
export const WithToolbar: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const [webSearch, setWebSearch] = useState(false);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            prepend={
              <div className="flex items-center gap-1 px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                    transition-colors cursor-pointer
                    ${
    webSearch
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
    }`}
                >
                  <GlobeIcon />
                  Web Search
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                    bg-gray-100 hover:bg-gray-200 text-gray-600
                    dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                    transition-colors cursor-pointer"
                >
                  <PaperclipIcon />
                  Attach
                </button>
              </div>
            }
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates the `actions` render prop for fully custom action buttons.
 * The render function receives ChatInputRenderContext with state and callbacks.
 */
export const WithCustomActions: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            actions={(ctx: ChatInputRenderContext) => (
              <>
                {ctx.isLoading ? (
                  <StopButton onClick={ctx.stopMessage} />
                ) : (
                  <>
                    <button
                      type="button"
                      className="px-2 py-2 text-xs rounded-full
                        bg-gray-100 hover:bg-gray-200 text-gray-500
                        dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                        transition-colors cursor-pointer"
                      title="Attach file"
                    >
                      <PaperclipIcon />
                    </button>
                    <SendButton
                      onClick={ctx.sendMessage}
                      disabled={ctx.disabled || !ctx.message.trim()}
                    />
                  </>
                )}
              </>
            )}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Combines all customization options: prepend toolbar, append model selector,
 * and custom actions with the reusable SendButton/StopButton components.
 */
export const FullCustomLayout: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [webSearch, setWebSearch] = useState(false);

  const models = [
    { id: 'gpt-4o', label: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast & cheap' },
    { id: 'claude-sonnet', label: 'Claude Sonnet', description: 'Balanced' },
    { id: 'claude-haiku', label: 'Claude Haiku', description: 'Fastest' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            prepend={
              <div className="flex items-center gap-1 px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                    transition-colors cursor-pointer
                    ${
    webSearch
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
    }`}
                >
                  <GlobeIcon />
                  Web Search
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                    bg-gray-100 hover:bg-gray-200 text-gray-600
                    dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                    transition-colors cursor-pointer"
                >
                  <PaperclipIcon />
                  Attach
                </button>
              </div>
            }
            append={
              <div className="flex items-center gap-2 px-1 pb-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                      bg-gray-100 hover:bg-gray-200 text-gray-600
                      dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                      transition-colors cursor-pointer"
                  >
                    <BoltIcon />
                    {selectedModel}
                    <ChevronDownIcon />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute bottom-full left-0 mb-1 w-48 py-1
                        bg-white border border-gray-200 rounded-lg shadow-lg
                        dark:bg-gray-900 dark:border-gray-700 z-20"
                    >
                      {models.map(model => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model.label);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            ${selectedModel === model.label ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                          `}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {model.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            }
            actions={(ctx: ChatInputRenderContext) => (
              <>
                {ctx.isLoading ? (
                  <StopButton onClick={ctx.stopMessage} />
                ) : (
                  <SendButton
                    onClick={ctx.sendMessage}
                    disabled={ctx.disabled || !ctx.message.trim()}
                  />
                )}
              </>
            )}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates `actionsPlacement="bottom"` which renders the action buttons
 * as a row below the text editor instead of overlaying it.
 */
export const ActionsBottom: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const models = [
    { id: 'gpt-4o', label: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast & cheap' },
    { id: 'claude-sonnet', label: 'Claude Sonnet', description: 'Balanced' },
    { id: 'claude-haiku', label: 'Claude Haiku', description: 'Fastest' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            actionsPlacement="bottom"
            actions={(ctx: ChatInputRenderContext) => (
              <div className="flex items-center justify-between w-full">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg
                      bg-gray-100 hover:bg-gray-200 text-gray-600
                      dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
                      transition-colors cursor-pointer"
                  >
                    <BoltIcon />
                    {selectedModel}
                    <ChevronDownIcon />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute bottom-full left-0 mb-1 w-48 py-1
                        bg-white border border-gray-200 rounded-lg shadow-lg
                        dark:bg-gray-900 dark:border-gray-700 z-20"
                    >
                      {models.map(model => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model.label);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            ${selectedModel === model.label ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                          `}
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {model.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {model.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {ctx.isLoading ? (
                    <StopButton onClick={ctx.stopMessage} />
                  ) : (
                    <SendButton
                      onClick={ctx.sendMessage}
                      disabled={ctx.disabled || !ctx.message.trim()}
                    />
                  )}
                </div>
              </div>
            )}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates `actionsPlacement="top"` which renders the action buttons
 * as a row above the text editor.
 */
export const ActionsTop: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            actionsPlacement="top"
            actions={(ctx: ChatInputRenderContext) => (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {ctx.message.length > 0
                    ? `${ctx.message.length} characters`
                    : 'Start typing...'}
                </span>
                <div className="flex items-center gap-2">
                  {ctx.isLoading ? (
                    <StopButton onClick={ctx.stopMessage} />
                  ) : (
                    <SendButton
                      onClick={ctx.sendMessage}
                      disabled={ctx.disabled || !ctx.message.trim()}
                    />
                  )}
                </div>
              </div>
            )}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates `actionsPlacement="after"` which renders the action buttons
 * to the right of the editor on the same row.
 */
export const ActionsAfter: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            actionsPlacement="after"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

/**
 * Demonstrates `actionsPlacement="before"` which renders the action buttons
 * to the left of the editor on the same row.
 */
export const ActionsBefore: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Ask anything..."
            actionsPlacement="before"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
