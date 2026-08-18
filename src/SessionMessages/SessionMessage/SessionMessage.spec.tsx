import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { ThemeProvider, theme as reablocksTheme } from 'reablocks';
import type { ReactNode } from 'react';
import { ChatContext } from '@/ChatContext';
import { chatTheme, ChatTheme } from '@/theme';
import type { Message } from '@/types';
import { SessionMessage } from './SessionMessage';

const testTheme: ChatTheme = {
  ...chatTheme,
  messages: {
    ...chatTheme.messages,
    message: {
      ...chatTheme.messages.message,
      cursor: 'test-cursor'
    }
  }
};

interface RenderOptions {
  isLoading?: boolean;
  children?: ReactNode;
  isLast?: boolean;
  showAuthor?: boolean;
}

const renderMessage = (
  message: Message,
  { isLoading = false, children, isLast, showAuthor }: RenderOptions = {}
) =>
  render(
    <ThemeProvider theme={reablocksTheme}>
      <ChatContext.Provider
        value={{
          sessions: [],
          activeSessionId: null,
          theme: testTheme,
          isLoading
        }}
      >
        <SessionMessage
          message={message}
          isLast={isLast}
          showAuthor={showAuthor}
        >
          {children}
        </SessionMessage>
      </ChatContext.Provider>
    </ThemeProvider>
  );

afterEach(cleanup);

describe('SessionMessage', () => {
  describe('author header', () => {
    it('renders the author name when author is set', () => {
      renderMessage({
        id: 'm1',
        role: 'user',
        content: 'hi',
        author: { id: 'u1', name: 'Austin' }
      });

      expect(screen.getByText('Austin')).toBeDefined();
    });

    it('renders an image when avatar is a string url', () => {
      const { container } = renderMessage({
        id: 'm1',
        role: 'assistant',
        content: 'hi',
        author: { name: 'Helper', avatar: 'https://example.com/a.png' }
      });

      const img = container.querySelector('img');
      expect(img?.getAttribute('src')).toBe('https://example.com/a.png');
    });

    it('renders a custom node avatar as-is', () => {
      renderMessage({
        id: 'm1',
        role: 'assistant',
        content: 'hi',
        author: { name: 'Helper', avatar: <span data-testid="avatar">H</span> }
      });

      expect(screen.getByTestId('avatar')).toBeDefined();
    });

    it('does not render a header when author is absent', () => {
      const { container } = renderMessage({
        id: 'm1',
        role: 'user',
        content: 'hi'
      });

      expect(container.querySelector('img')).toBeNull();
      expect(screen.queryByText('Austin')).toBeNull();
    });

    it('hides the header when showAuthor is false', () => {
      renderMessage(
        {
          id: 'm1',
          role: 'user',
          content: 'hi',
          author: { name: 'Austin' }
        },
        { showAuthor: false }
      );

      expect(screen.queryByText('Austin')).toBeNull();
    });

    it('lets custom children replace the author header', () => {
      renderMessage(
        {
          id: 'm1',
          role: 'tool',
          content: 'ran query',
          author: { name: 'Researcher' }
        },
        { children: <div data-testid="custom">custom body</div> }
      );

      expect(screen.getByTestId('custom')).toBeDefined();
      expect(screen.queryByText('Researcher')).toBeNull();
    });
  });

  describe('role presentation', () => {
    it('does not render actions for user messages', () => {
      renderMessage({ id: 'm1', role: 'user', content: 'hi' });

      expect(screen.queryByTitle('Copy message')).toBeNull();
    });

    it('renders actions for assistant messages', () => {
      renderMessage({ id: 'm1', role: 'assistant', content: 'hi' });

      expect(screen.getByTitle('Copy message')).toBeDefined();
    });

    it('renders actions for custom agent roles', () => {
      renderMessage({ id: 'm1', role: 'researcher', content: 'hi' });

      expect(screen.getByTitle('Copy message')).toBeDefined();
    });

    it('does not render actions for system or tool messages', () => {
      renderMessage({ id: 'm1', role: 'system', content: 'connected' });
      renderMessage({ id: 'm2', role: 'tool', content: 'ran query' });

      expect(screen.queryByTitle('Copy message')).toBeNull();
    });

    it('renders sources for assistant and custom agent roles', () => {
      renderMessage({
        id: 'm1',
        role: 'assistant',
        content: 'hi',
        sources: [{ title: 'Assistant source' }]
      });
      renderMessage({
        id: 'm2',
        role: 'researcher',
        content: 'hi',
        sources: [{ title: 'Agent source' }]
      });

      expect(screen.getByText('Assistant source')).toBeDefined();
      expect(screen.getByText('Agent source')).toBeDefined();
    });

    it('does not render sources for system or tool messages', () => {
      renderMessage({
        id: 'm1',
        role: 'system',
        content: 'connected',
        sources: [{ title: 'System source' }]
      });
      renderMessage({
        id: 'm2',
        role: 'tool',
        content: 'ran query',
        sources: [{ title: 'Tool source' }]
      });

      expect(screen.queryByText('System source')).toBeNull();
      expect(screen.queryByText('Tool source')).toBeNull();
    });
  });

  describe('loading cursor', () => {
    const cursor = (container: HTMLElement) =>
      container.getElementsByClassName('test-cursor');

    it('shows the cursor on the last assistant message while loading', () => {
      const { container } = renderMessage(
        { id: 'm1', role: 'assistant', content: 'hi' },
        { isLoading: true, isLast: true }
      );

      expect(cursor(container)).toHaveLength(1);
    });

    it('shows the cursor on the last custom-role message while loading', () => {
      const { container } = renderMessage(
        { id: 'm1', role: 'researcher', content: 'hi' },
        { isLoading: true, isLast: true }
      );

      expect(cursor(container)).toHaveLength(1);
    });

    it('does not show the cursor on system or tool messages', () => {
      const system = renderMessage(
        { id: 'm1', role: 'system', content: 'connected' },
        { isLoading: true, isLast: true }
      );
      const tool = renderMessage(
        { id: 'm2', role: 'tool', content: 'ran query' },
        { isLoading: true, isLast: true }
      );

      expect(cursor(system.container)).toHaveLength(0);
      expect(cursor(tool.container)).toHaveLength(0);
    });

    it('does not show the cursor when not the last message', () => {
      const { container } = renderMessage(
        { id: 'm1', role: 'assistant', content: 'hi' },
        { isLoading: true, isLast: false }
      );

      expect(cursor(container)).toHaveLength(0);
    });
  });
});
