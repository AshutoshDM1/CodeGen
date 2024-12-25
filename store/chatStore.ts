import { create } from "zustand";

interface Message {
  role: "user" | "assistant";
  content: string | AIResponse;
}

interface AIResponse {
  startingContent?: string;
  code: Array<file | command>;
  endingContent?: string;
}

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addChunk: (chunk: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      role: "user",
      content: "I want to make a todo list",
    },
  ],
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  addChunk: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content += chunk;
      } else {
        messages.push({
          role: "assistant",
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

interface FileItem {
  name: string;
  type: "file" | "folder";
  
  children?: FileItem[];
}

interface FileTreeProps {
  item: FileItem;
  depth?: number;
}

export const codebase: FileItem[] = [
  {
    name: "vite-project",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "components",
            type: "folder",
            children: [
              {
                name: "App.tsx",
                type: "file",
              },
            ],
          },
          {
            name: "main.tsx",
            type: "file",
          },
        ],
      },
      {
        name: "index.html",
        type: "file",
      },
      {
        name: "package.json",
        type: "file",
      },
      {
        name: "tsconfig.json",
        type: "file",
      },
      {
        name: "vite.config.ts",
        type: "file",
      },
    ],
  },
];

export type file = {
  filePath: string;
  content: string;
  type: "file";
};

export type command = {
  type: "shell";
  content: string;
};

interface CodeStore {
  code: Array<file | command>;
  setCode: (code: Array<file | command>) => void;
  addChunkfile: (chunk: string, filePath: string) => void;
  addChunkcommand: (chunk: string) => void;
}

export const useCodeStore = create<CodeStore>((set) => ({
  code: [],
  setCode: (code) => set({ code }),
  addChunkfile: (chunk: string, filePath: string) =>
    set((state) => {
      const code = [...state.code];
      const item = code.find(
        (item) => item.type === "file" && item.filePath === filePath
      );
      if (item) {
        item.content += chunk;
      } else {
        code.push({ filePath, content: chunk, type: "file" });
      }
      return { code };
    }),
  addChunkcommand: (chunk: string) =>
    set((state) => {
      const code = [...state.code];
      const item = code.find((item) => item.type === "shell");
      if (item) {
        code.push({ type: "shell", content: chunk });
      }
      return { code };
    }),
}));

export const demoMessages: Message[] = [
  {
    role: "user",
    content: "Create a simple todo list application",
  },
  {
    role: "assistant",
    content: {
      startingContent:
        "I'll help you create a simple todo list application. Here's the code you'll need:",
      code: [
        {
          type: "file",
          filePath: "src/components/TodoList.tsx",
          content: `import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Add a new todo"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(todos.map(t =>
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                ));
              }}
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        },
        {
          type: "shell",
          content: "npm install @types/react @types/react-dom",
        },
      ],
      endingContent:
        "You can now import and use this TodoList component in your main App.tsx file. The component includes basic functionality for adding todos and marking them as complete.",
    },
  },
];
