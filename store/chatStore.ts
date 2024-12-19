import { create } from 'zustand'

interface ChatStore {
  messages: string[]
  setMessages: (messages: string[]) => void
  addMessage: (message: string) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] })
}))
