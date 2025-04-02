import { create } from "zustand";

export const defaultProjectFiles = {
  "package.json": {
    file: {
      contents: `{
  "name": "codegen-ai-project",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.279.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.6.3",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.15",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.30",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`,
    },
  },
  "tsconfig.json": {
    file: {
      contents: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
    },
  },
  "tsconfig.node.json": {
    file: {
      contents: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
    },
  },
  "vite.config.ts": {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173
  }
})`,
    },
  },
  "postcss.config.js": {
    file: {
      contents: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
    },
  },
  "tailwind.config.js": {
    file: {
      contents: `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`,
    },
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeGen AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  },
  src: {
    directory: {
      "main.tsx": {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        },
      },
      "index.css": {
        file: {
          contents: `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
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

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  number: string;
  label: string;
}

function App(): React.ReactNode {
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
          ].map((feature: Feature, index: number) => (
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
          ].map((stat: Stat, index: number) => (
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
      components: {
        directory: {
          ui: {
            directory: {
              "button.tsx": {
                file: {
                  contents: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,
                },
              },
            },
          },
        },
      },
      lib: {
        directory: {
          "utils.ts": {
            file: {
              contents: `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,
            },
          },
        },
      },
    },
  },
  public: {
    directory: {
      "vite.svg": {
        file: {
          contents: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`,
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
  setCode: (code: projectFiles) => void;
}>((set) => ({
  EditorCode: defaultProjectFiles,
  getfileCode: (filePath: string): string => {
    return findFileContent(useEditorCode.getState().EditorCode, filePath) ?? "";
  },
  setCode: (code: projectFiles) => set({ EditorCode: code }),
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

type project = {
  projectName: string;
  projectId: string;
  projectDescription: string;
  lastUpdatedCode: projectFiles;
  messages: Message[];
};

interface projectStore {
  project: project | null;
  setProject: (project: project) => void;
}

export const useProjectStore = create<projectStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
}));

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
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
  showWorkspace: false,
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
  isLoadingWebContainerMessage: string;
  setIsLoadingWebContainerMessage: (
    isLoadingWebContainerMessage: string
  ) => void;
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
  isLoadingWebContainerMessage: "Building the Web Container...",
  setIsLoadingWebContainer: (isLoadingWebContainer) =>
    set({ isLoadingWebContainer }),
  setIsLoadingWebContainerMessage: (isLoadingWebContainerMessage) =>
    set({ isLoadingWebContainerMessage }),
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
        name: "main.tsx",
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
