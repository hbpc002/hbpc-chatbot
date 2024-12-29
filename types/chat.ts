export interface ChatMessageType {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Session {
  id: string;
  title: string;
  messages: ChatMessageType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatResponse {
  success: boolean;
  error?: string;
  data?: any;
} 