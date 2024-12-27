export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatResponse {
  success: boolean;
  error?: string;
  data?: any;
} 