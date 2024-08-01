import { describe, it, expect } from 'vitest';
import { groupSessionsByDate } from './grouping';
import { Session } from '@/types';
import { subDays } from 'date-fns';

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

    expect(grouped).toHaveLength(6);
    expect(grouped[0].heading).toBe('Today');
    expect(grouped[1].heading).toBe('Yesterday');
    expect(grouped[2].heading).toBe('Last Week');
    expect(grouped[3].heading).toBe('Last Month');
    expect(grouped[4].heading).toMatch(/^[A-Z][a-z]+$/);
    expect(grouped[5].heading).toBe('Last Year');

    expect(grouped[0].sessions).toHaveLength(1);
    expect(grouped[1].sessions).toHaveLength(1);
    expect(grouped.flatMap(g => g.sessions)).toHaveLength(sessions.length);
  });

  it('handles empty input', () => {
    const grouped = groupSessionsByDate([]);
    expect(grouped).toHaveLength(0);
  });

  it('groups multiple sessions in the same category', () => {
    const sessions: Session[] = [
      createSession(0),
      createSession(0),
      createSession(1),
      createSession(1),
    ];

    const grouped = groupSessionsByDate(sessions);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].heading).toBe('Today');
    expect(grouped[0].sessions).toHaveLength(2);
    expect(grouped[1].heading).toBe('Yesterday');
    expect(grouped[1].sessions).toHaveLength(2);
  });

  it('sorts groups in the correct order', () => {
    const sessions: Session[] = [
      createSession(400), // Last Year
      createSession(0),   // Today
      createSession(60),  // A few months ago
      createSession(1),   // Yesterday
    ];

    const grouped = groupSessionsByDate(sessions);

    expect(grouped[0].heading).toBe('Today');
    expect(grouped[1].heading).toBe('Yesterday');
    expect(grouped[grouped.length - 1].heading).toBe('Last Year');
  });

  it('sorts sessions within each group by createdAt in descending order', () => {
    const now = new Date();
    const sessions: Session[] = [
      { ...createSession(0), createdAt: new Date(now.getTime() - 1000) },
      { ...createSession(0), createdAt: now },
      { ...createSession(1), createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 1000) },
      { ...createSession(1), createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    ];

    const grouped = groupSessionsByDate(sessions);

    expect(grouped[0].sessions[0].createdAt).toEqual(now);
    expect(grouped[1].sessions[0].createdAt).toEqual(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  });
});
