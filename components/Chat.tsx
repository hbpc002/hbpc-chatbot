'use client';

import React, { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChat } from '../hooks/useChat';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

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
  } = useChat();

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <main className="grid grid-cols-[280px_1fr] h-screen w-screen overflow-hidden bg-gray-50">
      {/* 左侧会话列表 - 添加独立滚动 */}
      <aside className="bg-white border-r border-gray-200 flex flex-col shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createSession}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="font-medium">新建对话</span>
          </motion.button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {sessions.map(session => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setCurrentSession(session.id)}
              className={`group flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                session.id === currentSessionId 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="truncate font-medium">新对话</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1 rounded-full hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </nav>
      </aside>

      {/* 右侧聊天区域 - 优化布局和滚动 */}
      <div className="flex flex-col h-full overflow-hidden">
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
    </main>
  );
};

export default Chat;