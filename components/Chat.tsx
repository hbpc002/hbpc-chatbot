'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChat } from '../hooks/useChat';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PencilIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Session } from '../types/chat';

const Chat: React.FC = () => {
  const {
    sessions,
    currentSession,
    currentSessionId,
    input,
    setInput,
    isLoading,
    error,
    inputRef,
    messagesEndRef,
    handleSubmit,
    createSession,
    deleteSession,
    setCurrentSession,
    updateSessionTitle,
    generateSessionTitle,
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleTitleEdit = (session: Session) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleTitleSave = async (sessionId: string) => {
    if (editTitle.trim()) {
      await updateSessionTitle(sessionId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCreateSession = async () => {
    if (input.trim()) {
      try {
        console.log("Creating session with input:", input.trim());
        await createSession(input.trim());
      } catch (error) {
        console.error("Error creating session:", error);
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <main className="relative h-[95vh] w-screen overflow-hidden bg-gray-50">
      {/* 移动端菜单按钮 */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* 响应式侧边栏 */}
        <aside className={clsx(
          "fixed lg:relative lg:block z-50 bg-white border-r border-gray-200 flex flex-col shadow-lg",
          "w-[280px] h-full overflow-y-auto",
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateSession}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span className="font-medium">新建对话</span>
            </motion.button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => setCurrentSession(session.id)}
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
                    onBlur={() => handleTitleSave(session.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSave(session.id);
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
                        handleTitleEdit(session);
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
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all ml-2 p-1 rounded-full hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </nav>
        </aside>

        {/* 聊天区域调整 */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
            {currentSession?.messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框区域 - 固定在底部 */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={isLoading}
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                发送
              </motion.button>
            </form>
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;