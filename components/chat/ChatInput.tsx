import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../../hooks/useChat';
import clsx from 'clsx';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const { input, setInput, isLoading, handleSubmit, inputRef } = useChat();
  const { theme } = useThemeContext();

  return (
    <form 
      onSubmit={handleSubmit} 
      className={clsx(
        "p-4 flex items-center",
        theme.bg,
        "border-t",
        theme.border
      )}
    >
      <motion.textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入你的问题..."
        className={clsx(
          "flex-1 p-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none",
          theme.inputBg,
          theme.inputText,
          theme.inputBorder,
          "scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
        )}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className={clsx(
          "ml-2 px-4 py-2 font-medium transition-colors",
          theme.buttonText,
          "shadow-lg rounded-lg",
          isLoading ? "bg-gray-400 cursor-not-allowed" : ""
        )}
        style={{ backgroundColor: theme.primary }}
      >
        发送
      </motion.button>
    </form>
  );
}; 