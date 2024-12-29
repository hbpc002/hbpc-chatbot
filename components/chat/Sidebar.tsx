import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, Cog6ToothIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Session } from '../../types/chat';
import { ThemeSettings } from './ThemeSettings';
import clsx from 'clsx';
import { SessionItem } from './SessionItem';
import { useState, useRef, useEffect } from 'react';
import  ReactDOM  from 'react-dom';
import { useUser } from '../../hooks/useUser';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Theme } from '../../types/theme';

interface SidebarProps {
  sessions: Session[];
  currentSessionId: string | null;
  handleCreateSession: () => void;
  setCurrentSession: (id: string) => void;
  handleTitleEdit: (session: Session) => void;
  handleTitleSave: (sessionId: string) => void;
  deleteSession: (id: string) => Promise<void>;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  currentTheme: Theme;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  handleCreateSession,
  setCurrentSession,
  handleTitleEdit,
  handleTitleSave,
  deleteSession,
  editingId,
  editTitle,
  setEditTitle,
  currentTheme,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useUser();
  const username = user?.name;
  const { theme } = useThemeContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  const sidebarClassName = clsx(
    'w-full h-full flex flex-col',
    theme.bg,
    theme.text,
    theme.border
  );

  return (
    <motion.aside className={sidebarClassName}>
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateSession}
          className={clsx(
            "w-full flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-all",
            theme.buttonText,
            theme.buttonShadow,
            theme.buttonRounded
          )}
          style={{ backgroundColor: theme.primary }}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span>新建对话</span>
        </motion.button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {sessions.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            currentSessionId={currentSessionId || ''}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            onSelect={() => setCurrentSession(session.id)}
            onTitleEdit={() => handleTitleEdit(session)}
            onTitleSave={() => handleTitleSave(session.id)}
            onDelete={() => deleteSession(session.id)}
          />
        ))}
      </nav>

      <div className="relative px-4 py-2 border-t border-gray-200 mt-auto flex items-center justify-end">
        {isLoading ? (
          <span className="mr-2 text-gray-600 text-sm">Loading...</span>
        ) : (
          <span className="mr-2 text-gray-600 text-sm">{username}</span>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-center w-auto p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        {isSettingsOpen &&  ReactDOM.createPortal(
          <div ref={settingsRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <ThemeSettings onClose={() => setIsSettingsOpen(false)} />
          </div>,
          document.body
        )}
      </div>
    </motion.aside>
  );
}; 