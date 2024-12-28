import React, { ComponentPropsWithoutRef } from 'react';
import { Message } from '../types/chat';
import ReactMarkdown, { Components } from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useThemeContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "mb-4 p-3 rounded-lg",
        message.role === 'user' ? theme.messageUserBg + " text-gray-800 self-end" : theme.messageAssistantBg + " text-gray-800 self-start"
      )}
    >
      <ReactMarkdown components={{ code: CodeBlock }}>{message.content}</ReactMarkdown>
    </motion.div>
  );
}; 