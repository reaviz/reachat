import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import { Session } from './types';

interface GroupedSessions {
  [key: string]: Session[];
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

export function groupSessionsByDate(sessions: Session[]): GroupedSessions {
  const grouped: GroupedSessions = {};

  sessions.forEach(session => {
    const createdAt = new Date(session.createdAt);

    if (isToday(createdAt)) {
      if (!grouped['Today']) grouped['Today'] = [];
      grouped['Today'].push(session);
    } else if (isYesterday(createdAt)) {
      if (!grouped['Yesterday']) grouped['Yesterday'] = [];
      grouped['Yesterday'].push(session);
    } else if (isThisWeek(createdAt)) {
      if (!grouped['Last Week']) grouped['Last Week'] = [];
      grouped['Last Week'].push(session);
    } else if (isThisMonth(createdAt)) {
      if (!grouped['Last Month']) grouped['Last Month'] = [];
      grouped['Last Month'].push(session);
    } else if (isThisYear(createdAt)) {
      const monthName = format(createdAt, 'MMMM');
      if (!grouped[monthName]) grouped[monthName] = [];
      grouped[monthName].push(session);
    } else {
      if (!grouped['Last Year']) grouped['Last Year'] = [];
      grouped['Last Year'].push(session);
    }
  });

  // Remove empty groups
  Object.keys(grouped).forEach(key => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  // Sort groups
  const sortedGroups = Object.keys(grouped).sort((a, b) =>
    sortOrder.indexOf(a) - sortOrder.indexOf(b)
  );

  const sortedGrouped: GroupedSessions = {};
  sortedGroups.forEach(key => {
    // Sort sessions within each group by createdAt date (most recent first)
    sortedGrouped[key] = grouped[key].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return sortedGrouped;
}
