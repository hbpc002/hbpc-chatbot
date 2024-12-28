import React, { ComponentPropsWithoutRef } from 'react';
import { Message } from '../../types/chat';
import ReactMarkdown, { Components } from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
}

const CodeBlock: React.FC<Components['code']> = ({ node, inline, className, children, ...props }) => {
  const match = (className || '').match(/language-(?<lang>[\w-]+)/);
  return !inline && match ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, '')}
      style={vs}
      language={match.groups?.lang}
      PreTag="div"
      {...props}
    />
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