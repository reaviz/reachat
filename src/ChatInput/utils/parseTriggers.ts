/**
 * Represents a parsed trigger (mention or command) in the text
 */
export interface ParsedTrigger {
  /**
   * The trigger character (e.g., '@', '/')
   */
  trigger: string;

  /**
   * The text after the trigger (the mention/command value)
   */
  value: string;

  /**
   * Start position in the original text
   */
  start: number;

  /**
   * End position in the original text
   */
  end: number;

  /**
   * Full text including trigger (e.g., '@username', '/command')
   */
  fullText: string;
}

/**
 * Parse triggers (mentions/commands) from text
 * Finds completed triggers that are followed by whitespace or end of text
 * and are not currently being typed (cursor is not inside them)
 */
export function parseTriggers(
  text: string,
  cursorPosition: number,
  triggers: string[]
): ParsedTrigger[] {
  const results: ParsedTrigger[] = [];

  for (const triggerChar of triggers) {
    let searchIndex = 0;

    while (true) {
      // Find the next occurrence of the trigger
      const triggerIndex = text.indexOf(triggerChar, searchIndex);
      if (triggerIndex === -1) break;

      // Check if this is a valid trigger position (start of text or preceded by whitespace)
      const isAtStart = triggerIndex === 0;
      const isAfterWhitespace =
        triggerIndex > 0 && /\s/.test(text[triggerIndex - 1]);

      if (isAtStart || isAfterWhitespace) {
        // Find where this trigger ends (whitespace or end of text)
        let endIndex = triggerIndex + 1;
        while (
          endIndex < text.length &&
          !/\s/.test(text[endIndex]) &&
          text[endIndex] !== triggerChar
        ) {
          endIndex++;
        }

        const triggerText = text.substring(triggerIndex, endIndex);
        const triggerValue = triggerText.substring(1); // Remove the trigger character

        // Check if cursor is inside this trigger (if so, it's being typed and shouldn't be highlighted)
        const isCursorInside =
          cursorPosition > triggerIndex && cursorPosition < endIndex;

        // Only include if it's a completed trigger (has value and cursor is not inside)
        if (triggerValue.length > 0 && !isCursorInside) {
          results.push({
            trigger: triggerChar,
            value: triggerValue,
            start: triggerIndex,
            end: endIndex,
            fullText: triggerText
          });
        }

        searchIndex = endIndex;
      } else {
        searchIndex = triggerIndex + 1;
      }
    }
  }

  // Sort by start position
  return results.sort((a, b) => a.start - b.start);
}

/**
 * Convert text with triggers into segments (text and trigger segments)
 */
export interface TextSegment {
  type: 'text' | 'trigger';
  content: string;
  trigger?: ParsedTrigger;
  start: number;
  end: number;
}

export function segmentText(
  text: string,
  cursorPosition: number,
  triggers: string[]
): TextSegment[] {
  const parsedTriggers = parseTriggers(text, cursorPosition, triggers);
  const segments: TextSegment[] = [];

  let lastIndex = 0;

  for (const trigger of parsedTriggers) {
    // Add text before this trigger
    if (trigger.start > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, trigger.start),
        start: lastIndex,
        end: trigger.start
      });
    }

    // Add the trigger segment
    segments.push({
      type: 'trigger',
      content: trigger.fullText,
      trigger,
      start: trigger.start,
      end: trigger.end
    });

    lastIndex = trigger.end;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
      start: lastIndex,
      end: text.length
    });
  }

  // If no triggers, return single text segment
  if (segments.length === 0) {
    segments.push({
      type: 'text',
      content: text,
      start: 0,
      end: text.length
    });
  }

  return segments;
}
