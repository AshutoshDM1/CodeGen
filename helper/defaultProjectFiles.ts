export const defaultProjectFiles = {
  'package.json': {
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
  'tsconfig.json': {
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
  'tsconfig.node.json': {
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
  'vite.config.ts': {
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
  'postcss.config.js': {
    file: {
      contents: `export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }`,
    },
  },
  'tailwind.config.js': {
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
  'index.html': {
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
      'main.tsx': {
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
      'index.css': {
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
      'App.tsx': {
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
              'button.tsx': {
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
          'utils.ts': {
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
      'vite.svg': {
        file: {
          contents: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`,
        },
      },
    },
  },
};
