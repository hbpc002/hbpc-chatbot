'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { Sidebar } from './Sidebar';
import { useChat } from '../../hooks/useChat';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Chat: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    sessions,
    currentSessionId,
    messages,
    handleSendMessage,
    handleCreateSession,
    setCurrentSession,
    handleTitleEdit,
    handleTitleSave,
    deleteSession,
    editingId,
    editTitle,
    setEditTitle,
  } = useChat();

  const { theme } = useThemeContext();

  return (
    <main className={`relative h-[95vh] w-screen overflow-hidden ${theme.bg} text-${theme.text} ${theme.shadow}`}>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex h-full">
        <aside className={clsx(
          "fixed lg:relative lg:block z-50 bg-white border-r border-gray-200 flex flex-col shadow-lg",
          "w-[280px] h-full overflow-y-auto",
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          theme.bg,
          `text-${theme.text}`
        )}>
          <Sidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            currentTheme={theme}
            handleCreateSession={handleCreateSession}
            setCurrentSession={setCurrentSession}
            handleTitleEdit={handleTitleEdit}
            handleTitleSave={handleTitleSave}
            deleteSession={deleteSession}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );
};

export default Chat; 