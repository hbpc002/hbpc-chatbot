import { Message } from '../types/chat';

export class ChatService {
  static async sendMessage(messages: Message[]): Promise<ReadableStreamDefaultReader> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    return reader;
  }

  static async processStream(
    reader: ReadableStreamDefaultReader,
    onChunk: (text: string) => void
  ): Promise<string> {
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = decoder.decode(value);
      fullContent += text;
      onChunk(fullContent);
    }

    return fullContent;
  }
} 