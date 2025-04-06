import { create } from 'zustand';
import { projectFiles } from '@/types/webContainerFiles';

export interface Message {
  role: 'user' | 'assistant';
  content: string | AIResponse;
}

export interface AIResponse {
  startingContent?: string;
  projectFiles: projectFiles;
  endingContent?: string;
  updatedFiles?: Array<{ action: string; filePath: string }>;
}

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addChunk: (chunk: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  addAIbeforeMsg: (chunk: string) => void;
  addAIafterMsg: (chunk: string) => void;
  setUpdatedFilesChat: (updatedFiles: Array<{ action: string; filePath: string }>) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  setUpdatedFilesChat: (updatedFiles: Array<{ action: string; filePath: string }>) =>
    set((state) => {
      console.log(updatedFiles);
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        if (typeof lastMessage.content === 'object') {
          lastMessage.content = {
            ...lastMessage.content,
            updatedFiles: [...updatedFiles],
          };
        }
      }
      return { messages };
    }),
  addAIbeforeMsg: (chunk: string) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      // console.log(lastMessage);
      if (lastMessage && lastMessage.role === 'assistant') {
        if (typeof lastMessage.content !== 'string') {
          lastMessage.content.startingContent += chunk;
        }
      }
      return { messages };
    }),
  addAIafterMsg: (chunk: string) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        if (typeof lastMessage.content !== 'string') {
          lastMessage.content.endingContent += chunk;
        }
      }
      return { messages };
    }),
  addChunk: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content += chunk;
      } else {
        messages.push({
          role: 'assistant',
          content: chunk,
        });
      }
      return { messages };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

// interface CodeStore {
//   code: Array<file | command>;
//   setCode: (code: Array<file | command>) => void;
//   addChunkfile: (chunk: string, filePath: string) => void;
//   addChunkcommand: (chunk: string) => void;
// }

// export const useCodeStore = create<CodeStore>((set) => ({
//   code: [],
//   setCode: (code) => set({ code }),
//   addChunkfile: (chunk: string, filePath: string) =>
//     set((state) => {
//       const code = [...state.code];
//       const item = code.find((item) => item.type === 'file' && item.filePath === filePath);
//       if (item) {
//         item.content += chunk;
//       } else {
//         code.push({ filePath, content: chunk, type: 'file' });
//       }
//       return { code };
//     }),
//   addChunkcommand: (chunk: string) =>
//     set((state) => {
//       const code = [...state.code];
//       const item = code.find((item) => item.type === 'shell');
//       if (item) {
//         code.push({ type: 'shell', content: chunk });
//       }
//       return { code };
//     }),
// }));
