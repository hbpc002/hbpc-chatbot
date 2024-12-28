import { create } from 'zustand'
import { supabase } from '../supabase'

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
  sessions: [],
  currentSessionId: null,
  isLoading: false,

  loadSessions: async () => {
    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('*, chat_messages(*)')
      .order('updated_at', { ascending: false })

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
      }))
      
      set({ 
        sessions: formattedSessions,
        currentSessionId: formattedSessions[0]?.id || null 
      })
    }
  },

  createSession: async () => {
    const { data: session } = await supabase
      .from('chat_sessions')
      .insert({
        title: '新对话'
      })
      .select()
      .single();

    if (session) {
      const newSession = {
        id: session.id,
        title: '新对话',
        messages: []
      };

      set(state => ({
        sessions: [newSession, ...state.sessions],
        currentSessionId: session.id
      }));

      return newSession;
    }
    return null;
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