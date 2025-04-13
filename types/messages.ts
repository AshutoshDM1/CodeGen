import { Message, AIResponse } from '@/store/chatStore';

// API message structure from backend
export interface ApiMessage {
  id?: number;
  role?: 'user' | 'assistant';
  content?: string | AIResponse;
  createdAt?: string;
  updatedAt?: string;
  projectId?: number;
  message?: {
    role: 'user' | 'assistant';
    content: string | AIResponse;
  };
}

// Processed message ready for UI
export interface ProcessedMessage extends Message {
  id?: number;
  createdAt?: string;
}

// Array of messages from API
export type ApiMessageArray = ApiMessage[];
