import React from 'react';
import { ChatMessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useThemeContext } from '../../contexts/ThemeContext';

interface ChatMessageProps {
  message: ChatMessageType;
  createdAt?: string;
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
  const { theme } = useThemeContext();
  
  const formattedTime = message.created_at 
    ? format(new Date(message.created_at), 'yyyy/MM/dd HH:mm:ss', { locale: zhCN })
    : '';

  return (
    <div className={clsx(
      "mb-4",
      message.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start"
    )}>
      {formattedTime && (
        <span className="text-xs text-gray-400 mb-1">
          {formattedTime}
        </span>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "p-3 rounded-lg",
          message.role === 'user' 
            ? theme.messageUserBg + " text-gray-800 max-w-[85%]" 
            : theme.messageAssistantBg + " text-gray-800 max-w-[98%]"
        )}
      >
        <ReactMarkdown components={{ code: CodeBlock }}>{message.content}</ReactMarkdown>
      </motion.div>
    </div>
  );
}; 