import  { FC } from 'react';
import { Session } from './types';

interface SessionListItemProps {
  session: Session;
  isActive: boolean;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  session,
  isActive,
  onSelectSession,
  onDeleteSession
}) => {
  return (
    <div
      className={`session border p-4 mb-4 rounded ${isActive ? 'bg-blue-100' : 'bg-white'} cursor-pointer`}
      onClick={() => onSelectSession && onSelectSession(session.id)}
    >
      <h2 className="text-xl font-bold">{session.title}</h2>
      {onDeleteSession && (
        <button
          className="mt-2 text-red-500 hover:text-red-700"
          onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
        >
          Delete
        </button>
      )}
    </div>
  );
};