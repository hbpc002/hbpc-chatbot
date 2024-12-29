import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Highlight, themes } from 'prism-react-renderer';
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
  const { theme } = useThemeContext();
  const match = (className || '').match(/language-([\w-]+)/);
  const language = match?.[1] || 'text';
  
  if (!inline && match) {
    return (
      <div className="relative my-4">
        <div className="absolute right-2 top-2 text-xs text-gray-400/80 font-mono">
          {language}
        </div>
        <Highlight
          theme={themes.vsDark}
          code={String(children).replace(/\n$/, '')}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className="rounded-md !mt-2 !mb-2 p-4 bg-[#1E1E1E] overflow-x-auto">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 mr-4 text-gray-500 text-right select-none">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    );
  }

  return (
    <code 
      className={clsx(
        "px-1.5 py-0.5 rounded-md", 
        theme.bg === 'bg-gray-900' 
          ? "bg-gray-500 text-gray-100"  // 暗色主题下的内联代码样式
          : "bg-gray-300 text-gray-800"  // 亮色主题下的内联代码样式
      )} 
      {...props}
    >
      {children}
    </code>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useThemeContext();

  return (
    <div className="mb-4">
      {message.created_at && (
        <div className={clsx(
          "text-xs mb-1", 
          theme.text,
          message.role === 'user' ? "text-right" : "text-left" // 让时间戳的对齐方式跟随消息
        )}>
          {new Date(message.created_at).toLocaleString()}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "p-3 rounded-lg",
          message.role === 'user' 
            ? `${theme.messageUserBg} ${theme.text} ml-auto max-w-[85%] w-fit`
            : `${theme.messageAssistantBg} ${theme.text}`
        )}
      >
        <ReactMarkdown 
          components={{ 
            code: CodeBlock 
          }}
        >
          {message.content}
        </ReactMarkdown>
      </motion.div>
    </div>
  );
}; 