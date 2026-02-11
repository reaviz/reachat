import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  differenceInYears
} from 'date-fns';
import { Session } from '@/types';

export interface GroupedSessions {
  heading: string;
  sessions: Session[];
}

const sortOrder = [
  'Today',
  'Yesterday',
  'Last Week',
  'Last Month',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'Last Year'
];

// Pre-compute a Map for O(1) sort order lookup instead of O(n) indexOf
const sortOrderMap = new Map(sortOrder.map((v, i) => [v, i]));

export function groupSessionsByDate(sessions: Session[]): GroupedSessions[] {
  const grouped: Record<string, Session[]> = {};
  const now = new Date();

  sessions.forEach(session => {
    const createdAt = new Date(session.createdAt);

    let group: string;
    if (isToday(createdAt)) {
      group = 'Today';
    } else if (isYesterday(createdAt)) {
      group = 'Yesterday';
    } else if (isThisWeek(createdAt)) {
      group = 'Last Week';
    } else if (differenceInYears(now, createdAt) === 0) {
      const monthDiff = now.getMonth() - createdAt.getMonth();
      const yearDiff = now.getFullYear() - createdAt.getFullYear();
      const adjustedMonthDiff = yearDiff > 0 ? monthDiff + 12 : monthDiff;
      if (
        adjustedMonthDiff === 1 ||
        (adjustedMonthDiff === 0 && now.getDate() > createdAt.getDate())
      ) {
        group = 'Last Month';
      } else {
        group = format(createdAt, 'MMMM');
      }
    } else {
      group = 'Last Year';
    }

    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(session);
  });

  // Sort groups using Map for O(1) lookup per comparison
  const sortedGroups = Object.keys(grouped).sort(
    (a, b) => (sortOrderMap.get(a) ?? 999) - (sortOrderMap.get(b) ?? 999)
  );

  return sortedGroups.map(heading => ({
    heading,
    sessions: grouped[heading].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }));
}
