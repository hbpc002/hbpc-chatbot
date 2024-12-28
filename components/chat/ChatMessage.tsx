import React from 'react';
import { Message } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
}

// 定义 CodeProps 接口
interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const match = (className || '').match(/language-([\w-]+)/);
  return !inline && match ? (
    <SyntaxHighlighter
      style={vs}
      language={match[1] || 'text'}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "mb-4 p-3 rounded-lg",
        message.role === 'user' ? "bg-gray-100 text-gray-800 self-end" : "bg-gray-200 text-gray-800 self-start"
      )}
    >
      <ReactMarkdown components={{ code: CodeBlock }}>{message.content}</ReactMarkdown>
    </motion.div>
  );
}; 