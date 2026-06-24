import type { ChatMessage } from '../types';

export const createUserMessage = (text: string): ChatMessage => ({
  id: `msg-user-${Date.now()}`,
  sender: 'user',
  text,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export const createBotMessage = (text: string): ChatMessage => ({
  id: `msg-ai-${Date.now()}`,
  sender: 'ai',
  text,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});
