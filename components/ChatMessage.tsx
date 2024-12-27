import React from 'react';
import { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { CodeProps } from 'react-markdown/lib/ast-to-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div 
        className={clsx(
          'max-w-[85%] px-6 py-3 rounded-2xl shadow-sm',
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
            : 'bg-white border border-gray-100 text-gray-700'
        )}
      >
        <ReactMarkdown
          className={clsx(
            'prose max-w-none',
            isUser ? 'prose-invert' : 'prose-blue',
            'prose-p:my-1 prose-pre:my-2',
            'prose-code:before:content-none prose-code:after:content-none'
          )}
          components={{
            // 代码块渲染
            code({ node, inline, className, children, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              
              if (!inline && language) {
                return (
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    PreTag="div"
                    className="rounded-lg !my-3"
                    showLineNumbers={true}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
              
              return (
                <code
                  className={clsx(
                    'px-1.5 py-0.5 rounded-md text-sm',
                    isUser 
                      ? 'bg-blue-400 bg-opacity-50' 
                      : 'bg-gray-100'
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // 链接渲染
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'underline',
                  isUser ? 'text-blue-100' : 'text-blue-500'
                )}
              >
                {children}
              </a>
            ),
            // 列表渲染
            ul: ({ children }) => (
              <ul className="list-disc list-inside my-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside my-2">{children}</ol>
            ),
            // 表格渲染
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200">
                  {children}
                </table>
              </div>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
} 