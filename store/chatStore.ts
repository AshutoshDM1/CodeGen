import { create } from "zustand";

export const projectFiles = {
  "package.json": {
    file: {
      contents: `{\n  "name": "vite-react-typescript-starter",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "framer-motion": "^11.3.19",\n    "lucide-react": "^0.344.0",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.9.1",\n    "@types/react": "^18.3.5",\n    "@types/react-dom": "^18.3.0",\n    "@vitejs/plugin-react": "^4.3.1",\n    "autoprefixer": "^10.4.18",\n    "eslint": "^9.9.1",\n    "eslint-plugin-react-hooks": "^5.1.0-rc.0",\n    "eslint-plugin-react-refresh": "^0.4.11",\n    "globals": "^15.9.0",\n    "postcss": "^8.4.35",\n    "tailwindcss": "^3.4.1",\n    "typescript": "^5.5.3",\n    "typescript-eslint": "^8.3.0",\n    "vite": "^5.4.2"\n  }\n}`,
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
          contents: `import React from 'react'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-950 text-white">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed w-full top-0 bg-black/20 backdrop-blur-lg z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
          >
            CodeGen
          </motion.div>
          <div className="flex gap-8 items-center">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              className="hover:text-blue-400 transition-colors"
              href="#"
            >
              Home
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1 }}
              className="hover:text-blue-400 transition-colors"
              href="#"
            >
              Features
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="pt-32 px-4 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center"
      >
        <motion.h1 
          variants={fadeIn}
          className="text-6xl md:text-7xl font-bold mb-6"
        >
          Build Faster with
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> AI</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl text-gray-300 mb-12 max-w-2xl"
        >
          Experience the next generation of coding with AI-powered assistance. Write better code, faster than ever before.
        </motion.p>

        <motion.div 
          variants={fadeIn}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg shadow-blue-500/30"
          >
            Try it Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur hover:bg-white/20 px-8 py-4 rounded-xl font-medium text-lg border border-white/30"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          {[
            {
              title: "Smart Completion",
              description: "AI-powered code suggestions that understand your context",
              icon: "🤖"
            },
            {
              title: "Real-time Help",
              description: "Get instant solutions to your coding problems",
              icon: "⚡"
            },
            {
              title: "Code Analysis",
              description: "Automatic code review and optimization suggestions",
              icon: "🔍"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-blue-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-3 gap-12 mt-24"
        >
          {[
            { number: "10K+", label: "Developers" },
            { number: "1M+", label: "Lines Generated" },
            { number: "99%", label: "Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App`,
        },
      },
    },
  },
};

// Add this helper function to clean code content
function cleanCodeContent(content: string): string {
  return content
    .replace(/^>?\s*/, "") // Remove leading '>' and whitespace
    .replace(/\s*<\/boltAction>\s*$/, "") // Remove trailing boltAction tag
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\([^\\])/g, "$1")
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;lt;/g, "<")
    .replace(/&amp;gt;/g, ">")
    .replace(/\{&gt;/g, "{>")
    .replace(/&lt;\}/g, "<}")
    .replace(/=&gt;/g, "=>")
    .trim();
}

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
      // Clean the code before storing it
      const cleanedCode = cleanCodeContent(code);

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

        // Set the file at the final level with cleaned code
        const fileName = parts[parts.length - 1];
        parentObj[fileName] = { file: { contents: cleanedCode } };
      } else {
        // Handle root level files with cleaned code
        current[filePath] = { file: { contents: cleanedCode } };
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
// asdf
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
    {
      role: "user",
      content:
        "Adapt the current landing page's content and theme to represent my Codegen application",
    },
    {
      role: "assistant",
      content: {
        startingContent: `Okay, I will adapt the current landing page to represent your Codegen application, using the existing structure, Tailwind CSS, framer-motion, and lucide-react icons. \n
Greetings!\n
The following files will be created or modified: \n
src/App.tsx \n 
This update will transform the landing page content and theme to showcase your Codegen application, including relevant text, icons, and imagery \n


I have completed the task. You can now view the updated Codegen landing page in the preview.`,
        projectFiles: projectFiles,
        endingContent: "Here's the complete project files:",
      },
    },
  ],

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
  NONE = "none",
}

interface ShowPreview {
  showPreview: Show;
  setShowCode: () => void;
  setShowTerminal: () => void;
  setShowPreview: () => void;
  setShowNone: () => void;
  showWorkspace: boolean;
  setShowWorkspace: (showWorkspace: boolean) => void;
}

export const useShowPreview = create<ShowPreview>((set) => ({
  showPreview: Show.PREVIEW,
  showWorkspace: true,
  setShowWorkspace: (showWorkspace: boolean) => set({ showWorkspace }),
  setShowCode: () => set({ showPreview: Show.CODE }),
  setShowTerminal: () => set({ showPreview: Show.TERMINAL }),
  setShowPreview: () => set({ showPreview: Show.PREVIEW }),
  setShowNone: () => set({ showPreview: Show.NONE }),
}));

interface TerminalStore {
  terminal: string[];
  url: string;
  addCommand: (terminal: string) => void;
  clearTerminal: () => void;
  showTerminalInput: boolean;
  setShowTerminalInput: (showTerminalInput: boolean) => void;
  setUrl: (url: string) => void;
  isLoadingWebContainer: boolean;
  setIsLoadingWebContainer: (isLoadingWebContainer: boolean) => void;
  isSavingFiles: boolean;
  setIsSavingFiles: (isSavingFiles: boolean) => void;
}

interface FullPreview {
  fullPreview: boolean;
  setFullPreview: (fullPreview: boolean) => void;
}

export const useFullPreview = create<FullPreview>((set) => ({
  fullPreview: false,
  setFullPreview: (fullPreview: boolean) => set({ fullPreview }),
}));

export const useTerminalStore = create<TerminalStore>((set) => ({
  isSavingFiles: false,
  setIsSavingFiles: (isSavingFiles: boolean) => set({ isSavingFiles }),
  isLoadingWebContainer: true,
  setIsLoadingWebContainer: (isLoadingWebContainer) =>
    set({ isLoadingWebContainer }),
  showTerminalInput: true,
  url: "",
  terminal: ["Welcome to the terminal"],
  addCommand: (terminal) =>
    set((state) => ({ terminal: [...state.terminal, terminal] })),
  clearTerminal: () => set({ terminal: [] }),
  setShowTerminalInput: (showTerminalInput) => set({ showTerminalInput }),
  setUrl: (url: string) => set({ url }),
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
  addFileByAI: (filePath: string, fileName: string) => void;
  deleteFileExplorer: (fileName: string) => void;
  renameFileExplorer: (fileName: string, newName: string) => void;
  renameFolderExplorer: (folderPath: string, newName: string) => void;
  newFolderExplorer: (folderName: string) => void;
}

export const useFileExplorer = create<FileExplorer>((set) => ({
  fileExplorer: codebase,
  setFileExplorer: (fileExplorer) => set({ fileExplorer }),
  addFileByAI: (filePath: string, fileName: string) =>
    set((state) => {
      const { setOpenFolder } = useFileExplorerState.getState();
      // Parse the file path to extract folder structure
      const pathParts = filePath.split("/");
      const fileNameFromPath = pathParts.pop() || fileName; // Use the last part as filename or fallback to provided fileName

      // If there are no folders in the path, just add the file to root
      if (pathParts.length === 0) {
        return {
          fileExplorer: [
            ...state.fileExplorer,
            { name: fileNameFromPath, type: "file" },
          ],
        };
      }

      // Keep track of the current path as we build it
      let currentPath = "";

      // Helper function to recursively create/navigate folder structure
      const addFileToPath = (
        items: FileItem[],
        remainingPath: string[],
        file: string
      ): FileItem[] => {
        if (remainingPath.length === 0) {
          // We've reached the target folder, add the file here
          return [...items, { name: file, type: "file" }];
        }

        const currentFolder = remainingPath[0];
        const nextPath = remainingPath.slice(1);

        // Update the current path
        currentPath = currentPath
          ? `${currentPath}/${currentFolder}`
          : currentFolder;
        // Open the folder
        setOpenFolder(currentPath, true);

        // Check if the folder already exists
        const existingFolder = items.find(
          (item) => item.name === currentFolder && item.type === "folder"
        );

        if (existingFolder) {
          // Folder exists, continue navigating
          return items.map((item) => {
            if (item.name === currentFolder && item.type === "folder") {
              return {
                ...item,
                children: addFileToPath(item.children || [], nextPath, file),
              };
            }
            return item;
          });
        } else {
          // Folder doesn't exist, create it and continue
          return [
            ...items,
            {
              name: currentFolder,
              type: "folder",
              children: addFileToPath([], nextPath, file),
            },
          ];
        }
      };

      // Start the recursive process
      return {
        fileExplorer: addFileToPath(
          state.fileExplorer,
          pathParts,
          fileNameFromPath
        ),
      };
    }),
  addFileExplorer: (fileName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentPath = Array.from(openFolders).pop(); // Get last opened folder

      if (!currentPath) {
        // If no folder is open, add to root
        return {
          fileExplorer: [
            ...state.fileExplorer,
            { name: fileName, type: "file" },
          ],
        };
      }

      // Split the path into parts for nested folders
      const pathParts = currentPath.split("/");

      // Helper function to recursively find and update the target folder
      const addFileToPath = (items: FileItem[], path: string[]): FileItem[] => {
        if (path.length === 0) {
          // We've reached the target location, add the new file here
          return [...items, { name: fileName, type: "file" }];
        }

        const currentFolder = path[0];
        const remainingPath = path.slice(1);

        return items.map((item) => {
          if (item.name === currentFolder && item.type === "folder") {
            return {
              ...item,
              children: addFileToPath(item.children || [], remainingPath),
            };
          }
          return item;
        });
      };

      // Start the recursive process from the root
      return {
        fileExplorer: addFileToPath(state.fileExplorer, pathParts),
      };
    }),
  deleteFileExplorer: (fileName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentPath = Array.from(openFolders).pop(); // Get last opened folder

      if (!currentPath) {
        // If no folder is open, delete from root
        return {
          fileExplorer: state.fileExplorer.filter(
            (item) => item.name !== fileName
          ),
        };
      }

      // Split the path into parts for nested folders
      const pathParts = currentPath.split("/");

      // Helper function to recursively find and delete the file
      const deleteFileFromPath = (
        items: FileItem[],
        path: string[]
      ): FileItem[] => {
        if (path.length === 0) {
          // We've reached the target location, remove the file here
          return items.filter(
            (item) => item.name !== fileName.split("/").pop()
          );
        }

        const currentFolder = path[0];
        const remainingPath = path.slice(1);

        return items.map((item) => {
          if (item.name === currentFolder && item.type === "folder") {
            return {
              ...item,
              children: deleteFileFromPath(item.children || [], remainingPath),
            };
          }
          return item;
        });
      };

      // Start the recursive process from the root
      return {
        fileExplorer: deleteFileFromPath(state.fileExplorer, pathParts),
      };
    }),
  renameFileExplorer: (fileName: string, newName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentPath = Array.from(openFolders).pop(); // Get last opened folder

      if (!currentPath) {
        // If no folder is open, rename at root level
        return {
          fileExplorer: state.fileExplorer.map((item) =>
            item.name === fileName ? { ...item, name: newName } : item
          ),
        };
      }

      // Split the path into parts for nested folders
      const pathParts = currentPath.split("/");

      // Helper function to recursively find and rename the item
      const renameItemInPath = (
        items: FileItem[],
        path: string[]
      ): FileItem[] => {
        if (path.length === 0) {
          // We've reached the target location, rename the item here
          return items.map((item) =>
            item.name === fileName.split("/").pop()
              ? { ...item, name: newName }
              : item
          );
        }

        const currentFolder = path[0];
        const remainingPath = path.slice(1);

        return items.map((item) => {
          if (item.name === currentFolder && item.type === "folder") {
            return {
              ...item,
              children: renameItemInPath(item.children || [], remainingPath),
            };
          }
          return item;
        });
      };

      // Start the recursive process from the root
      return {
        fileExplorer: renameItemInPath(state.fileExplorer, pathParts),
      };
    }),
  renameFolderExplorer: (folderPath: string, newName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentPath = Array.from(openFolders).pop(); // Get last opened folder

      if (!currentPath) {
        // If no folder is open, we can't rename
        return { fileExplorer: state.fileExplorer };
      }

      // Get the current folder's full path
      const pathParts = currentPath.split("/");
      const targetFolder = pathParts[pathParts.length - 1]; // Get the last folder in the path

      // Helper function to recursively find and rename the folder
      const renameFolderInPath = (
        items: FileItem[],
        path: string[],
        depth: number = 0
      ): FileItem[] => {
        return items.map((item) => {
          // If we're at the target depth and found our folder
          if (
            depth === path.length - 1 &&
            item.name === targetFolder &&
            item.type === "folder"
          ) {
            return { ...item, name: newName };
          }

          // If this is a folder in our path, traverse into it
          if (item.type === "folder" && item.name === path[depth]) {
            return {
              ...item,
              children: renameFolderInPath(
                item.children || [],
                path,
                depth + 1
              ),
            };
          }

          return item;
        });
      };

      // Start the recursive process from the root
      return {
        fileExplorer: renameFolderInPath(state.fileExplorer, pathParts),
      };
    }),
  newFolderExplorer: (folderName: string) =>
    set((state) => {
      const { openFolders } = useFileExplorerState.getState();
      const currentPath = Array.from(openFolders).pop(); // Get last opened folder

      if (!currentPath) {
        // If no folder is open, add to root
        return {
          fileExplorer: [
            ...state.fileExplorer,
            { name: folderName, type: "folder", children: [] },
          ],
        };
      }

      // Split the path into parts for nested folders
      const pathParts = currentPath.split("/");

      // Helper function to recursively find and update the target folder
      const addFolderToPath = (
        items: FileItem[],
        path: string[]
      ): FileItem[] => {
        if (path.length === 0) {
          // We've reached the target location, add the new folder here
          return [...items, { name: folderName, type: "folder", children: [] }];
        }

        const currentFolder = path[0];
        const remainingPath = path.slice(1);

        return items.map((item) => {
          if (item.name === currentFolder && item.type === "folder") {
            return {
              ...item,
              children: addFolderToPath(item.children || [], remainingPath),
            };
          }
          return item;
        });
      };

      // Start the recursive process from the root
      return {
        fileExplorer: addFolderToPath(state.fileExplorer, pathParts),
      };
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
