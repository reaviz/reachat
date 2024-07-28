import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import { Session } from './types';

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

export function groupSessionsByDate(sessions: Session[]): GroupedSessions[] {
  const grouped: any = {};

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

  return sortedGroups.map(heading => ({
    heading,
    sessions: grouped[heading].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }));
}
