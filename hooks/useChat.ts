import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore } from '../lib/store/chat';
import { ChatService } from '../services/chatService';
import { useError } from './useError';
import { Message, Session } from '../types/chat';

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
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadSessions();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    clearError();

    try {
      if (!currentSessionId) {
        const newSession = await createSession();
        if (!newSession) return;
        
        const userMessage: Message = { role: 'user', content: input };
        await addMessage(userMessage, newSession.id);
        await generateSessionTitle(newSession.id, input);
        
        setInput('');
        setIsLoading(true);

        const assistantMessage: Message = { role: 'assistant', content: '' };
        await addMessage(assistantMessage, newSession.id);

        const reader = await ChatService.sendMessage([userMessage]);
        const fullContent = await ChatService.processStream(reader, (text) => {
          updateLastMessage(text, newSession.id);
        });

        await saveMessageToDatabase(fullContent, newSession.id);
        
      } else {
        const userMessage: Message = { role: 'user', content: input };
        await addMessage(userMessage);
        
        const currentSession = sessions.find(s => s.id === currentSessionId);
        if (currentSession && currentSession.messages.length === 0) {
          await generateSessionTitle(currentSessionId, input);
        }

        setInput('');
        setIsLoading(true);

        const assistantMessage: Message = { role: 'assistant', content: '' };
        await addMessage(assistantMessage);

        const allMessages = [...(currentSession?.messages || []), userMessage];
        const reader = await ChatService.sendMessage(allMessages);
        const fullContent = await ChatService.processStream(reader, (text) => {
          updateLastMessage(text);
        });

        await saveMessageToDatabase(fullContent);
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
  }, [input, isLoading, currentSessionId, sessions]);

  const handleTitleEdit = (session: Session) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleTitleSave = async (sessionId: string) => {
    if (!editTitle.trim()) return;
    
    try {
      await updateSessionTitle(sessionId, editTitle);
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('保存标题失败:', error);
      handleError(error as Error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentSessionId || !message.trim()) return;
    
    await addMessage({ role: 'user', content: message });
    // 添加发送消息到API的逻辑
  };

  return {
    sessions,
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
    setIsLoading,
    messages,
    editingId,
    editTitle,
    setEditTitle,
    handleTitleEdit,
    handleTitleSave,
    handleSendMessage,
  };
} 