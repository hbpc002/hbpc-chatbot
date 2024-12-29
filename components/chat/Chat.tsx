'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { Sidebar } from './Sidebar';
import { useChat } from '../../hooks/useChat';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Session, ChatMessage as IChatMessage } from '../../types/chat';

const Chat: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const {
    sessions,
    currentSessionId,
    messages, 
    handleSendMessage,
    createSession,
    setCurrentSession,
    handleTitleEdit,
    handleTitleSave,
    deleteSession,
    editingId,
    editTitle,
    setEditTitle,
  } = useChat();

  const { theme } = useThemeContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <main className={clsx("flex flex-col h-screen", theme.bg)}>
      <header className={clsx("flex items-center p-0 border-b", theme.border, theme.bg)}>
        <button
          ref={toggleButtonRef} 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={clsx(
            "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg",
            theme.bg,
            theme.text
          )}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <div className="flex h-full">
        <aside
          ref={sidebarRef}
          className={clsx(
            "fixed lg:relative lg:block z-50 flex flex-col shadow-lg",
            "w-[280px] h-full overflow-y-auto",
            "transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            theme.bg,
            theme.text,
            theme.border
          )}
        >
          <Sidebar
            sessions={sessions as Session[]}
            currentSessionId={currentSessionId || ''}
            currentTheme={theme}
            handleCreateSession={createSession}
            setCurrentSession={setCurrentSession}
            handleTitleEdit={handleTitleEdit}
            handleTitleSave={handleTitleSave}
            deleteSession={deleteSession}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          />
        </aside>

        <div className={clsx("flex-1 flex flex-col overflow-hidden", theme.bg, theme.text)}>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
                createdAt={message.created_at}
              />
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );
};

export default Chat; 