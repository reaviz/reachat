import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { ThemeProvider, theme as reablocksTheme } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { chatTheme } from '@/theme';
import type { MessageAuthor } from '@/types';
import { MessageAuthorBadge } from './MessageAuthorBadge';

const renderBadge = (author: MessageAuthor, className?: string) =>
  render(
    <ThemeProvider theme={reablocksTheme}>
      <ChatContext.Provider
        value={{ sessions: [], activeSessionId: null, theme: chatTheme }}
      >
        <MessageAuthorBadge author={author} className={className} />
      </ChatContext.Provider>
    </ThemeProvider>
  );

afterEach(cleanup);

describe('MessageAuthorBadge', () => {
  it('renders the author name', () => {
    renderBadge({ name: 'Ada Lovelace' });

    expect(screen.getByText('Ada Lovelace')).toBeDefined();
  });

  it('renders a string avatar as an image', () => {
    const { container } = renderBadge({
      name: 'Ada',
      avatar: 'https://example.com/ada.png'
    });

    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/ada.png'
    );
  });

  it('renders a node avatar as-is', () => {
    renderBadge({
      name: 'Coder',
      avatar: <svg data-testid="bot-icon" />
    });

    expect(screen.getByTestId('bot-icon')).toBeDefined();
  });

  it('renders no avatar wrapper when avatar is absent', () => {
    const { container } = renderBadge({ name: 'Ada' });

    expect(container.querySelectorAll('span')).toHaveLength(1);
  });

  it('applies a custom class name', () => {
    const { container } = renderBadge({ name: 'Ada' }, 'custom-class');

    expect(container.getElementsByClassName('custom-class')).toHaveLength(1);
  });
});
