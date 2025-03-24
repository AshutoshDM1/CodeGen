import { create } from "zustand";

export const projectFiles = {
  "package.json": {
    file: {
      contents: `{\n  "name": "vite-react-app",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "@vitejs/plugin-react": "^4.2.0",\n    "autoprefixer": "^10.4.17",\n    "postcss": "^8.4.35",\n    "tailwindcss": "^3.4.1",\n    "vite": "^5.0.0"\n  }\n}`,
    },
  },
  "vite.config.js": {
    file: {
      contents: `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    host: true,\n    port: 5173\n  }\n})`,
    },
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>CodeGen</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>`,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}`,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`,
    },
  },
  "tailwind.config.ts": {
    file: {
      contents: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}`,
    },
  },
  src: {
    directory: {
      "index.css": {
        file: {
          contents: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
        },
      },
      "main.jsx": {
        file: {
          contents: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)`,
        },
      },
      "App.tsx": {
        file: {
          contents: `import React from 'react'\n function App() {\n  return (\n    <div className="min-h-screen bg-gray-100 flex items-center justify-center">\n      <h1 className="text-4xl font-bold text-gray-800">\n        Hello from React + Vite + Tailwind!\n      </h1>\n    </div>\n  )\n}\n\nexport default App`,
        },
      },
    },
  },
};

export const useEditorCode = create<{
  EditorCode: projectFiles;
  setEditorCode: (filePath: string, code: string) => void;
  getfileCode: (filePath: string) => string;
}>((set) => ({
  EditorCode: projectFiles,
  getfileCode: (filePath: string): string => {
    return findFileContent(useEditorCode.getState().EditorCode, filePath) ?? "";
  },
  setEditorCode: (filePath, code) =>
    set((state) => {
      const parts = filePath.split("/");
      let current = { ...state.EditorCode };
      console.log("setEditorCode called ");

      // Handle nested paths
      if (parts.length > 1) {
        let parentObj = current;

        // Create directory structure if it doesn't exist
        for (let i = 0; i < parts.length - 1; i++) {
          const dirName = parts[i];

          // Check if directory exists, create it if not
          if (!parentObj[dirName]) {
            parentObj[dirName] = { directory: {} };
          } else if (!parentObj[dirName].directory) {
            parentObj[dirName].directory = {};
          }

          // Move to next level
          parentObj = parentObj[dirName].directory as {
            [key: string]: FileContent;
          };
        }

        // Set the file at the final level
        const fileName = parts[parts.length - 1];
        parentObj[fileName] = { file: { contents: code } };
      } else {
        // Handle root level files
        current[filePath] = { file: { contents: code } };
      }

      return { EditorCode: current };
    }),
}));

export interface Message {
  role: "user" | "assistant";
  content: string | AIResponse;
}

export interface FileContent {
  file?: {
    contents: string;
  };
  directory?: {
    [key: string]: FileContent;
  };
}

export type projectFiles = {
  [key: string]: FileContent;
};

export interface AIResponse {
  startingContent?: string;
  projectFiles: projectFiles;
  endingContent?: string;
}

interface AIMessage {
  startingContent: string;
  projectFiles: projectFiles;
  endingContent: string;
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
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    // { role: "user", content: "Make a simple react app with tailwind css" },
    // {
    //   role: "assistant",
    //   content: {
    //     startingContent:
    //       "Sure, I'll create a simple React app with Tailwind CSS for you. Here's the initial setup:",
    //     projectFiles: projectFiles,
    //     endingContent: "Here's the complete project files:",
    //   },
    // },
  ],

  // asdfasdfasdf
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  addAIbeforeMsg: (chunk: string) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      // console.log(lastMessage);
      if (lastMessage && lastMessage.role === "assistant") {
        if (typeof lastMessage.content !== "string") {
          lastMessage.content.startingContent += chunk;
        }
      }
      return { messages };
    }),
  addAIafterMsg: (chunk: string) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        if (typeof lastMessage.content !== "string") {
          lastMessage.content.endingContent += chunk;
        }
      }
      return { messages };
    }),
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
  fileupdating: boolean;
  setFilePaths: (filePaths: string) => void;
  setFileupdating: (fileupdating: boolean) => void;
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
        name: "App.tsx",
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

export const useFilePaths = create<FilePaths>((set) => ({
  fileupdating: false,
  filePaths: "src/App.tsx",
  setFilePaths: (filePaths) => set({ filePaths }),
  setFileupdating: (fileupdating: boolean) =>
    set({ fileupdating: !fileupdating }),
}));

interface FileExplorer {
  fileExplorer: FileItem[];
  setFileExplorer: (fileExplorer: FileItem[]) => void;
  addFileExplorer: (fileName: string) => void;
  deleteFileExplorer: (fileName: string) => void;
  renameFileExplorer: (fileName: string, newName: string) => void;
  newFolderExplorer: (folderName: string) => void;
}

export const useFileExplorer = create<FileExplorer>((set) => ({
  fileExplorer: codebase,
  setFileExplorer: (fileExplorer) => set({ fileExplorer }),
  addFileExplorer: (fileName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentFolder = Array.from(openFolders).pop(); // Get last opened folder

      if (currentFolder) {
        // Add file to the selected folder
        return {
          fileExplorer: state.fileExplorer.map((item) => {
            if (item.name === currentFolder && item.type === "folder") {
              return {
                ...item,
                children: [
                  ...(item.children || []),
                  { name: fileName, type: "file" },
                ],
              };
            }
            return item;
          }),
        };
      }

      // If no folder is open, add to root
      return {
        fileExplorer: [...state.fileExplorer, { name: fileName, type: "file" }],
      };
    }),
  deleteFileExplorer: (fileName: string) =>
    set({
      fileExplorer: useFileExplorer
        .getState()
        .fileExplorer.filter((item) => item.name !== fileName),
    }),
  renameFileExplorer: (fileName: string, newName: string) =>
    set({
      fileExplorer: useFileExplorer
        .getState()
        .fileExplorer.map((item) =>
          item.name === fileName ? { ...item, name: newName } : item
        ),
    }),
  newFolderExplorer: (folderName: string) =>
    set({
      fileExplorer: [
        ...useFileExplorer.getState().fileExplorer,
        { name: folderName, type: "folder" },
      ],
    }),
}));

export function findFileContent(
  files: Record<string, FileContent>,
  path: string
): string | null {
  // Split the path into parts
  const parts = path.split("/");

  let current: FileContent | undefined = files[parts[0]];

  // For paths like "src/App.tsx", we need to traverse the directory structure
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

interface FileExplorerState {
  openFolders: Set<string>;
  setOpenFolder: (path: string, isOpen: boolean) => void;
}

export const useFileExplorerState = create<FileExplorerState>((set) => ({
  openFolders: new Set<string>(),
  setOpenFolder: (path: string, isOpen: boolean) =>
    set((state) => {
      const newOpenFolders = new Set(state.openFolders);
      if (isOpen) {
        newOpenFolders.add(path);
      } else {
        newOpenFolders.delete(path);
      }
      return { openFolders: newOpenFolders };
    }),
}));
