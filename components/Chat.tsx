'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("无法获取响应流");
      }

      setIsLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const text = decoder.decode(value);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          newMessages[newMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + text
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，发生了错误。' }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              } max-w-[80%]`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {message.role === 'user' ? '用户' : 'AI助手'}
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
          className="flex-1 p-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          发送
        </button>
      </form>
    </div>
  );
} 