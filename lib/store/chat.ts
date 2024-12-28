import { create } from 'zustand'
import { supabase } from '../supabase'
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
}

interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  clientId: string
  
  loadSessions: () => Promise<void>
  createSession: () => Promise<ChatSession | null>
  deleteSession: (id: string) => Promise<void>
  setCurrentSession: (id: string) => void
  addMessage: (message: ChatMessage, sessionId?: string) => Promise<void>
  updateLastMessage: (content: string, sessionId?: string) => void
  saveMessageToDatabase: (content: string, sessionId?: string) => Promise<void>
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>
  generateSessionTitle: (sessionId: string, firstMessage: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  clientId: typeof window !== 'undefined' ? 
    localStorage.getItem('clientId') || uuidv4() : '',
  sessions: [],
  currentSessionId: null,
  isLoading: false,

  loadSessions: async () => {
    try {
      // 1. 检查现有会话
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. 如果没有会话，先进行匿名登录
      if (!session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }

      // 3. 再次获取会话确认用户ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('无法获取用户信息');

      // 4. 获取聊天会话
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*, chat_messages(*)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      if (sessions) {
        const formattedSessions = sessions.map(session => ({
          id: session.id,
          title: session.title,
          messages: session.chat_messages.map((msg: {
            role: string;
            content: string;
          }) => ({
            role: msg.role,
            content: msg.content
          }))
        }));
        
        set({ 
          sessions: formattedSessions,
          currentSessionId: formattedSessions[0]?.id || null 
        });
      }
    } catch (error) {
      console.error('加载会话失败:', error);
      // 可以在这里添加错误处理逻辑
    }
  },

  createSession: async () => {
    try {
      // 1. 确保有用户会话
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();
      if (getUserError) {
        console.error('获取用户信息失败:', getUserError);
        return null;
      }

      if (!user) {
        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          console.error('匿名登录失败:', signInError);
          throw signInError;
        }
        // 重新获取用户信息
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (!newUser) {
          throw new Error('无法获取用户信息');
        }
      }

      // 2. 创建新会话
      const { data: newSession, error: createSessionError } = await supabase
        .from('chat_sessions')
        .insert({
          title: '新对话',
          user_id: user.id
        })
        .select()
        .single();

      if (createSessionError) {
        console.error('创建会话记录失败:', createSessionError);
        throw createSessionError;
      }

      if (!newSession) {
        throw new Error('创建会话失败');
      }

      const formattedSession = {
        id: newSession.id,
        title: '新对话',
        messages: []
      };

      set(state => ({
        sessions: [formattedSession, ...state.sessions],
        currentSessionId: formattedSession.id
      }));

      return formattedSession;
    } catch (error) {
      console.error('创建新会话过程中发生错误:', error);
      return null;
    }
  },

  deleteSession: async (id: string) => {
    await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id)

    set(state => ({
      sessions: state.sessions.filter(s => s.id !== id),
      currentSessionId: state.sessions[0]?.id || null
    }))
  },

  setCurrentSession: (id: string) => {
    set({ currentSessionId: id })
  },

  addMessage: async (message: ChatMessage, sessionId?: string) => {
    const targetSessionId = sessionId || get().currentSessionId;
    if (!targetSessionId) return;

    set(state => ({
      sessions: state.sessions.map(session => 
        session.id === targetSessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    }));

    await supabase
      .from('chat_messages')
      .insert({
        session_id: targetSessionId,
        role: message.role,
        content: message.content
      });
  },

  updateLastMessage: (content: string, sessionId?: string) => {
    const targetSessionId = sessionId || get().currentSessionId;
    if (!targetSessionId) return;

    set(state => ({
      sessions: state.sessions.map(session => 
        session.id === targetSessionId
          ? {
              ...session,
              messages: session.messages.map((msg, index) => 
                index === session.messages.length - 1
                  ? { ...msg, content }
                  : msg
              )
            }
          : session
      )
    }));
  },

  saveMessageToDatabase: async (content: string, sessionId?: string) => {
    const targetSessionId = sessionId || get().currentSessionId;
    if (!targetSessionId) return;

    await supabase
      .from('chat_messages')
      .update({ content })
      .eq('session_id', targetSessionId)
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1);
  },

  updateSessionTitle: async (sessionId: string, title: string) => {
    await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)

    set(state => ({
      sessions: state.sessions.map(session =>
        session.id === sessionId
          ? { ...session, title }
          : session
      )
    }))
  },

  generateSessionTitle: async (sessionId: string, firstMessage: string) => {
    const title = firstMessage.length > 20 
      ? firstMessage.slice(0, 20) + '...'
      : firstMessage

    await get().updateSessionTitle(sessionId, title)
  }
}))

export default useChatStore 