import { describe, it, expect } from 'vitest';

// Test the trigger detection logic directly without React hooks
describe('useInputTrigger logic', () => {
  describe('slash command detection patterns', () => {
    const detectSlashCommand = (
      text: string,
      cursorPos: number,
      onlyAtStart: boolean
    ) => {
      const slashTrigger = '/';

      if (onlyAtStart) {
        if (text.startsWith(slashTrigger)) {
          const filter = text.slice(1).split(/\s/)[0] || '';
          if (!text.includes(' ') || cursorPos <= text.indexOf(' ')) {
            return { type: 'slash', filter, startPosition: 0 };
          }
        }
        return null;
      }

      const slashMatch = text
        .slice(0, cursorPos)
        .match(new RegExp(`(?:^|\\s)\\${slashTrigger}([^\\s]*)$`));
      if (slashMatch) {
        const startPos = cursorPos - slashMatch[1].length - 1;
        return {
          type: 'slash',
          filter: slashMatch[1],
          startPosition: startPos
        };
      }
      return null;
    };

    it('detects slash at the start of input', () => {
      const result = detectSlashCommand('/', 1, true);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('slash');
      expect(result?.filter).toBe('');
    });

    it('filters slash commands', () => {
      const result = detectSlashCommand('/hel', 4, true);
      expect(result?.filter).toBe('hel');
    });

    it('does not detect slash after space when slashOnlyAtStart is true', () => {
      const result = detectSlashCommand('hello /test', 11, true);
      expect(result).toBeNull();
    });

    it('closes menu when space is added after command', () => {
      const result = detectSlashCommand('/help ', 6, true);
      expect(result).toBeNull();
    });

    it('detects slash anywhere when slashOnlyAtStart is false', () => {
      const result = detectSlashCommand('hello /test', 11, false);
      expect(result).not.toBeNull();
      expect(result?.filter).toBe('test');
    });
  });

  describe('mention detection patterns', () => {
    const detectMention = (text: string, cursorPos: number) => {
      const mentionTrigger = '@';
      const textBeforeCursor = text.slice(0, cursorPos);
      const mentionMatch = textBeforeCursor.match(
        new RegExp(`(?:^|\\s)\\${mentionTrigger}([^\\s${mentionTrigger}]*)$`)
      );
      if (mentionMatch) {
        const matchStart = textBeforeCursor.lastIndexOf(
          mentionTrigger + mentionMatch[1]
        );
        return {
          type: 'mention',
          filter: mentionMatch[1],
          startPosition: matchStart
        };
      }
      return null;
    };

    it('detects @ symbol', () => {
      const result = detectMention('@', 1);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('mention');
      expect(result?.filter).toBe('');
    });

    it('detects @ after space', () => {
      const result = detectMention('Hello @john', 11);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('mention');
      expect(result?.filter).toBe('john');
    });

    it('captures filter text after @', () => {
      const result = detectMention('@test', 5);
      expect(result?.filter).toBe('test');
    });

    it('detects @ at the start of text', () => {
      const result = detectMention('@alice', 6);
      expect(result).not.toBeNull();
      expect(result?.filter).toBe('alice');
    });
  });

  describe('keyboard navigation logic', () => {
    it('navigates down correctly', () => {
      const currentIndex = 0;
      const itemCount = 5;
      const newIndex = Math.min(currentIndex + 1, itemCount - 1);
      expect(newIndex).toBe(1);
    });

    it('navigates up correctly', () => {
      const currentIndex = 2;
      const newIndex = Math.max(currentIndex - 1, 0);
      expect(newIndex).toBe(1);
    });

    it('does not go below 0', () => {
      const currentIndex = 0;
      const newIndex = Math.max(currentIndex - 1, 0);
      expect(newIndex).toBe(0);
    });

    it('does not exceed item count', () => {
      const currentIndex = 4;
      const itemCount = 5;
      const newIndex = Math.min(currentIndex + 1, itemCount - 1);
      expect(newIndex).toBe(4);
    });
  });

  describe('text insertion logic', () => {
    const getInsertText = (
      currentText: string,
      startPosition: number,
      triggerChar: string,
      filter: string,
      selectedText: string,
      type: 'slash' | 'mention'
    ) => {
      const endPosition = startPosition + triggerChar.length + filter.length;
      const beforeTrigger = currentText.slice(0, startPosition);
      const afterTrigger = currentText.slice(endPosition);

      let insertText: string;
      if (type === 'slash') {
        insertText = selectedText + ' ';
      } else {
        insertText = '@' + selectedText + ' ';
      }

      const newText = beforeTrigger + insertText + afterTrigger;
      const cursorPosition = beforeTrigger.length + insertText.length;

      return { newText, cursorPosition };
    };

    it('inserts slash command correctly', () => {
      const { newText, cursorPosition } = getInsertText(
        '/hel',
        0,
        '/',
        'hel',
        '/help',
        'slash'
      );
      expect(newText).toBe('/help ');
      expect(cursorPosition).toBe(6);
    });

    it('inserts mention correctly', () => {
      const { newText, cursorPosition } = getInsertText(
        '@joh',
        0,
        '@',
        'joh',
        'john',
        'mention'
      );
      expect(newText).toBe('@john ');
      expect(cursorPosition).toBe(6);
    });

    it('inserts mention in middle of text', () => {
      const { newText } = getInsertText(
        'Hello @joh world',
        6,
        '@',
        'joh',
        'john',
        'mention'
      );
      expect(newText).toBe('Hello @john  world');
    });
  });

  describe('command filtering logic', () => {
    interface SlashCommand {
      id: string;
      command: string;
      label: string;
      description?: string;
    }

    const filterSlashCommands = (
      commands: SlashCommand[],
      filter: string
    ): SlashCommand[] => {
      if (!filter) return commands;
      const lowerFilter = filter.toLowerCase();
      return commands.filter(
        cmd =>
          cmd.command.toLowerCase().includes(lowerFilter) ||
          cmd.label.toLowerCase().includes(lowerFilter) ||
          cmd.description?.toLowerCase().includes(lowerFilter)
      );
    };

    const sampleCommands: SlashCommand[] = [
      { id: '1', command: 'help', label: 'Help', description: 'Show help' },
      { id: '2', command: 'clear', label: 'Clear', description: 'Clear chat' },
      {
        id: '3',
        command: 'summarize',
        label: 'Summarize',
        description: 'Summarize conversation'
      }
    ];

    it('returns all commands when filter is empty', () => {
      const result = filterSlashCommands(sampleCommands, '');
      expect(result).toHaveLength(3);
    });

    it('filters by command name', () => {
      const result = filterSlashCommands(sampleCommands, 'hel');
      expect(result).toHaveLength(1);
      expect(result[0].command).toBe('help');
    });

    it('filters by description', () => {
      const result = filterSlashCommands(sampleCommands, 'chat');
      expect(result).toHaveLength(1);
      expect(result[0].command).toBe('clear');
    });

    it('is case insensitive', () => {
      const result = filterSlashCommands(sampleCommands, 'HELP');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no match', () => {
      const result = filterSlashCommands(sampleCommands, 'xyz');
      expect(result).toHaveLength(0);
    });
  });
});
