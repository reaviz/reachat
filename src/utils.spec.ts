import { describe, it, expect } from 'vitest';
import { groupSessionsByDate } from './utils';
import { Session } from './types';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';

describe('groupSessionsByDate', () => {
  const createSession = (daysAgo: number): Session => ({
    id: `session-${daysAgo}`,
    createdAt: subDays(new Date(), daysAgo),
    updatedAt: subDays(new Date(), daysAgo),
    name: `Test Session ${daysAgo} days ago`,
    conversations: [],
  });

  it('groups sessions correctly', () => {
    const sessions: Session[] = [
      createSession(0),  // Today
      createSession(1),  // Yesterday
      createSession(3),  // Last Week
      createSession(20), // Last Month
      createSession(60), // A few months ago
      createSession(400) // Last Year
    ];

    const grouped = groupSessionsByDate(sessions);

    expect(Object.keys(grouped)).toEqual(['Today', 'Yesterday', 'Last Week', 'Last Month', expect.stringMatching(/^[A-Z][a-z]+$/), 'Last Year']);
    expect(grouped['Today'].length).toBe(1);
    expect(grouped['Yesterday'].length).toBe(1);
    expect(grouped['Last Week'].length).toBe(1);
    expect(grouped['Last Month'].length).toBe(1);
    expect(Object.values(grouped).flat().length).toBe(sessions.length);
  });

  it('handles empty input', () => {
    const grouped = groupSessionsByDate([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });

  it('groups multiple sessions in the same category', () => {
    const sessions: Session[] = [
      createSession(0),
      createSession(0),
      createSession(1),
      createSession(1),
    ];

    const grouped = groupSessionsByDate(sessions);

    expect(grouped['Today'].length).toBe(2);
    expect(grouped['Yesterday'].length).toBe(2);
  });

  it('sorts groups in the correct order', () => {
    const sessions: Session[] = [
      createSession(400), // Last Year
      createSession(0),   // Today
      createSession(60),  // A few months ago
      createSession(1),   // Yesterday
    ];

    const grouped = groupSessionsByDate(sessions);
    const groupOrder = Object.keys(grouped);

    expect(groupOrder[0]).toBe('Today');
    expect(groupOrder[1]).toBe('Yesterday');
    expect(groupOrder[groupOrder.length - 1]).toBe('Last Year');
  });
});
