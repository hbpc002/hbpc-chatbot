// 基础消息类型
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;  // 添加可选的 created_at 字段
}

// 数据库消息类型
export interface ChatMessage extends Message {
  id?: string;
  session_id?: string;
  created_at?: string;
}

// 会话类型
export interface Session {
  id: string;
  title: string;
  messages: ChatMessage[];  // 使用 ChatMessage 类型
  created_at?: string;
  updated_at?: string;
}

export interface ChatResponse {
  success: boolean;
  error?: string;
  data?: any;
} 