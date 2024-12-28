import { PencilIcon } from '@heroicons/react/24/outline';
import { Session } from '../../types/chat';
import clsx from 'clsx';

interface SessionItemProps {
  session: Session;
  currentSessionId: string;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onSelect: () => void;
  onTitleEdit: () => void;
  onTitleSave: () => void;
  onDelete: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  currentSessionId,
  editingId,
  editTitle,
  setEditTitle,
  onSelect,
  onTitleEdit,
  onTitleSave,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all',
        session.id === currentSessionId 
          ? 'bg-blue-50 text-blue-600' 
          : 'hover:bg-gray-50'
      )}
    >
      {editingId === session.id ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={onTitleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onTitleSave();
            }
          }}
          className="flex-1 px-2 py-1 text-sm border rounded"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="truncate flex-1">{session.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTitleEdit();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all ml-2 p-1 rounded-full hover:bg-red-50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}; 