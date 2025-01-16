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

interface Messages {
  messages: string;
  setMessages: (messages: string) => void;
}

export const useMessages = create<Messages>((set) => ({
  messages: "",
  setMessages: (messages) => set({ messages }),
}));

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

export const codebase: FileItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "index.css",
        type: "file",
      },
      {
        name: "main.jsx",
        type: "file",
      },
      {
        name: "App.jsx",
        type: "file",
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
  },
  {
    name: "vite.config.js",
    type: "file",
  },
  {
    name: "index.html",
    type: "file",
  },
  {
    name: "postcss.config.js",
    type: "file",
  },
  {
    name: "tailwind.config.js",
    type: "file",
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

export enum Show {
  CODE = "code",
  PREVIEW = "preview",
  TERMINAL = "terminal",
}

interface ShowPreview {
  showPreview: Show;
  setShowCode: () => void;
  setShowTerminal: () => void;
  setShowPreview: () => void;
}

export const useShowPreview = create<ShowPreview>((set) => ({
  showPreview: Show.CODE,
  setShowCode: () => set({ showPreview: Show.CODE }),
  setShowTerminal: () => set({ showPreview: Show.TERMINAL }),
  setShowPreview: () => set({ showPreview: Show.PREVIEW }),
}));

interface TerminalStore {
  terminal: string[];
  addCommand: (terminal: string) => void;
  clearTerminal: () => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  terminal: ["Welcome to the terminal"],
  addCommand: (terminal) =>
    set((state) => ({ terminal: [...state.terminal, terminal] })),
  clearTerminal: () => set({ terminal: [] }),
}));

interface FilePaths {
  filePaths: string;
  setFilePaths: (filePaths: string) => void;
}

export const useFilePaths = create<FilePaths>((set) => ({
  filePaths: "src/App.jsx",
  setFilePaths: (filePaths) => set({ filePaths }),
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

export const projectFiles = {
  "package.json": {
    file: {
      contents: `{
          "name": "vite-react-app",
          "private": true,
          "version": "0.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
          },
          "devDependencies": {
            "@vitejs/plugin-react": "^4.2.0",
            "autoprefixer": "^10.4.17",
            "postcss": "^8.4.35",
            "tailwindcss": "^3.4.1",
            "vite": "^5.0.0"
          }
        }`,
    },
  },
  "vite.config.js": {
    file: {
      contents: `
          import { defineConfig } from 'vite'
          import react from '@vitejs/plugin-react'

          export default defineConfig({
            plugins: [react()],
            server: {
              host: true,
              port: 5173
            }
          })`,
    },
  },
  "index.html": {
    file: {
      contents: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>CodeGen</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.jsx"></script>
            </body>
          </html>`,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `
          export default {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          }`,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `
          /** @type {import('tailwindcss').Config} */
          export default {
            content: [
              "./index.html",
              "./src/**/*.{js,ts,jsx,tsx}",
            ],
            theme: {
              extend: {},
            },
            plugins: [],
          }`,
    },
  },
  src: {
    directory: {
      "index.css": {
        file: {
          contents: `
              @tailwind base;
              @tailwind components;
              @tailwind utilities;`,
        },
      },
      "main.jsx": {
        file: {
          contents: `
              import React from 'react'
              import ReactDOM from 'react-dom/client'
              import App from './App'
              import './index.css'

              ReactDOM.createRoot(document.getElementById('root')).render(
                <React.StrictMode>
                  <App />
                </React.StrictMode>
              )`,
        },
      },
      "App.jsx": {
        file: {
          contents: `
              function App() {
                return (
                  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-gray-800">
                      Hello from React + Vite + Tailwind!
                    </h1>
                  </div>
                )
              }
              
              export default App`,
        },
      },
    },
  },
};

type FileContent = {
  file?: {
    contents: string;
  };
  directory?: {
    [key: string]: FileContent;
  };
};

export function findFileContent(
  files: Record<string, FileContent>,
  path: string
): string | null {
  // Split the path into parts
  const parts = path.split("/");

  let current: FileContent | undefined = files[parts[0]];

  // For paths like "src/App.jsx", we need to traverse the directory structure
  for (let i = 1; i < parts.length; i++) {
    if (!current) return null;

    // If we're in a directory, get the next part
    if (current.directory) {
      current = current.directory[parts[i]];
    } else {
      return null;
    }
  }

  // Return the file contents if we found them
  return current?.file?.contents ?? null;
}

// Usage example:
// const content = findFileContent(projectFiles, "src/App.jsx");
