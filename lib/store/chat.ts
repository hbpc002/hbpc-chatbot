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
  createSession: (firstMessage: string) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  setCurrentSession: (id: string) => void
  addMessage: (message: ChatMessage) => Promise<void>
  updateLastMessage: (content: string) => void
  saveMessageToDatabase: (content: string) => Promise<void>
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

  createSession: async (firstMessage: string) => {
    const { data: session } = await supabase
      .from('chat_sessions')
      .insert({})
      .select()
      .single();

    if (session) {
      const title = firstMessage.length > 20 
        ? firstMessage.slice(0, 20) + '...' 
        : firstMessage;

      await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', session.id);

      set(state => ({
        sessions: [{
          id: session.id,
          title: title,
          messages: []
        }, ...state.sessions],
        currentSessionId: session.id
      }));
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

  addMessage: async (message: ChatMessage) => {
    const { currentSessionId } = get()
    if (!currentSessionId) return

    set(state => ({
      sessions: state.sessions.map(session => 
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    }))

    await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: message.role,
        content: message.content
      })
  },

  updateLastMessage: (content: string) => {
    const { currentSessionId } = get()
    if (!currentSessionId) return

    set(state => ({
      sessions: state.sessions.map(session => 
        session.id === currentSessionId
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
    }))
  },

  saveMessageToDatabase: async (content: string) => {
    const { currentSessionId } = get()
    if (!currentSessionId) return

    await supabase
      .from('chat_messages')
      .update({ content })
      .eq('session_id', currentSessionId)
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(1)
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