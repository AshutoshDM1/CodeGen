import { Message } from '@/store/chatStore';
import { ApiMessage, ApiMessageArray, ProcessedMessage } from '@/types/messages';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getMessage = async (projectId: number): Promise<ProcessedMessage[]> => {
  if (!projectId) return [];

  try {
    const response = await fetch(`${API_URL}/api/v1/message/getMessage/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Not using credentials to avoid CORS issues
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    console.log('API response:', data);

    // Try to handle different API response formats
    let messages: ApiMessageArray = [];

    if (data.messages) {
      messages = data.messages;
    } else if (data.data?.messages) {
      messages = data.data.messages;
    } else if (Array.isArray(data)) {
      messages = data;
    }

    // Ensure messages are in the right format
    return messages.map((msg: ApiMessage): ProcessedMessage => {
      // If msg already has the right structure, return it
      if (msg.role && (typeof msg.content === 'string' || msg.content?.startingContent)) {
        return msg as ProcessedMessage;
      }

      // If msg has a message property with the right structure, return that
      if (msg.message && msg.message.role) {
        return msg.message as ProcessedMessage;
      }

      // Default fallback structure
      return {
        role: msg.role || 'assistant',
        content: msg.content || (msg.message as any) || '',
      };
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};
