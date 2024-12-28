import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore } from '../lib/store/chat';
import { ChatService } from '../services/chatService';
import { useError } from './useError';
import { Message } from '../types/chat';

export function useChat() {
  const {
    sessions,
    currentSessionId,
    loadSessions,
    createSession,
    deleteSession,
    setCurrentSession,
    addMessage,
    updateLastMessage,
    saveMessageToDatabase,
    updateSessionTitle,
    generateSessionTitle
  } = useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useError();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    clearError();

    try {
      const userInput = input.trim();
      
      if (!currentSessionId) {
        const newSession = await createSession();
        if (!newSession) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const userMessage: Message = { role: 'user', content: userInput };
      await addMessage(userMessage);
      
      setInput('');
      setIsLoading(true);

      const assistantMessage: Message = { role: 'assistant', content: '' };
      await addMessage(assistantMessage);

      const currentMessages = sessions.find(s => s.id === currentSessionId)?.messages || [];
      const messages = [...currentMessages, userMessage];
      
      const reader = await ChatService.sendMessage(messages);
      const fullContent = await ChatService.processStream(reader, (text) => {
        updateLastMessage(text);
      });

      await saveMessageToDatabase(fullContent);

      if (currentMessages.length === 0) {
        await generateSessionTitle(currentSessionId!, userInput);
      }

    } catch (error) {
      handleError(error as Error);
      await addMessage({ 
        role: 'assistant', 
        content: '抱歉，发生了错误。' 
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, currentSessionId, sessions, createSession, addMessage]);

  return {
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
    clearError,
    handleError,
    setIsLoading
  };
} 