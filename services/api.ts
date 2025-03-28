import { projectFiles } from "@/store/chatStore";
import axios from "axios";

export const exampleBefoer =
  'Okay, I will create a simple todo list application using React and Tailwind CSS.\n\n1.  Greetings!\n2.  The following files will be created or modified:\n    *   `src/App.jsx`\n    *   `src/components/TodoList.jsx`\n    *   `src/components/TodoItem.jsx`\n    *   `src/components/AddTodo.jsx`\n3.  This application will allow you to add, remove, and mark todos as complete.\n\n<boltArtifact id="simple-todo-list" title="Simple Todo List App">\n\nI have completed the task. You can now view the todo list application in the preview.\n \n ';

export const exampleAfter =
  "\n \n I have completed the task. You can now view the todo list application in the preview. \n \n";

export const messageuser = {
  messages: [
    {
      role: "user",
      content:
        "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n",
    },
    {
      role: "user",
      content:
        'Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n<boltArtifact id="project-import" title="Project Files"><boltAction type="file" filePath="eslint.config.js">import js from \'@eslint/js\';\nimport globals from \'globals\';\nimport reactHooks from \'eslint-plugin-react-hooks\';\nimport reactRefresh from \'eslint-plugin-react-refresh\';\nimport tseslint from \'typescript-eslint\';\n\nexport default tseslint.config(\n  { ignores: [\'dist\'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: [\'**/*.{ts,tsx}\'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      \'react-hooks\': reactHooks,\n      \'react-refresh\': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      \'react-refresh/only-export-components\': [\n        \'warn\',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n</boltAction><boltAction type="file" filePath="index.html"><!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n</boltAction><boltAction type="file" filePath="package.json">{\n  "name": "vite-react-typescript-starter",\n  "private": true,\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "lint": "eslint .",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "lucide-react": "^0.344.0",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  },\n  "devDependencies": {\n    "@eslint/js": "^9.9.1",\n    "@types/react": "^18.3.5",\n    "@types/react-dom": "^18.3.0",\n    "@vitejs/plugin-react": "^4.3.1",\n    "autoprefixer": "^10.4.18",\n    "eslint": "^9.9.1",\n    "eslint-plugin-react-hooks": "^5.1.0-rc.0",\n    "eslint-plugin-react-refresh": "^0.4.11",\n    "globals": "^15.9.0",\n    "postcss": "^8.4.35",\n    "tailwindcss": "^3.4.1",\n    "typescript": "^5.5.3",\n    "typescript-eslint": "^8.3.0",\n    "vite": "^5.4.2"\n  }\n}\n</boltAction><boltAction type="file" filePath="postcss.config.js">export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n</boltAction><boltAction type="file" filePath="tailwind.config.js">/** @type {import(\'tailwindcss\').Config} */\nexport default {\n  content: [\'./index.html\', \'./src/**/*.{js,ts,jsx,tsx}\'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n</boltAction><boltAction type="file" filePath="tsconfig.app.json">{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "isolatedModules": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n    "jsx": "react-jsx",\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"]\n}\n</boltAction><boltAction type="file" filePath="tsconfig.json">{\n  "files": [],\n  "references": [\n    { "path": "./tsconfig.app.json" },\n    { "path": "./tsconfig.node.json" }\n  ]\n}\n</boltAction><boltAction type="file" filePath="tsconfig.node.json">{\n  "compilerOptions": {\n    "target": "ES2022",\n    "lib": ["ES2023"],\n    "module": "ESNext",\n    "skipLibCheck": true,\n\n    /* Bundler mode */\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "isolatedModules": true,\n    "moduleDetection": "force",\n    "noEmit": true,\n\n    /* Linting */\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["vite.config.ts"]\n}\n</boltAction><boltAction type="file" filePath="vite.config.ts">import { defineConfig } from \'vite\';\nimport react from \'@vitejs/plugin-react\';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: [\'lucide-react\'],\n  },\n});\n</boltAction><boltAction type="file" filePath="src/App.tsx">import React from \'react\';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-100 flex items-center justify-center">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n</boltAction><boltAction type="file" filePath="src/index.css">@tailwind base;\n@tailwind components;\n@tailwind utilities;\n</boltAction><boltAction type="file" filePath="src/main.tsx">import { StrictMode } from \'react\';\nimport { createRoot } from \'react-dom/client\';\nimport App from \'./App.tsx\';\nimport \'./index.css\';\n\ncreateRoot(document.getElementById(\'root\')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n</boltAction><boltAction type="file" filePath="src/vite-env.d.ts">/// <reference types="vite/client" />\n</boltAction></boltArtifact>\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n',
    },
    {
      role: "user",
      content: `The format in which you will respond is Introduction of what you are going to do 1. greating  2. all file names 3. a message to the user here is the example if user ask for a todo list app ${exampleBefoer} and then <boltArtifact>...</boltArtifact>  then tell the user that you have completed the task ${exampleAfter}
        you have to strictly follow this format and nothing else But the file`,
    },
    {
      role: "user",
      content: `1. use frame-motion and good styling 2. Keeping in mind the project is already have boilerplate code which is created by vite Having js as language and jsx files and tailwind css as styling language which is already installed in the project 3. dont forget to update the package.json file otherwise it will not work in webcontainer  , here all the files are already created and you can see them in the project files ${projectFiles}`,
    },
    {
      role: "user",
      content:
        "can you make footer for this project and make it look good and responsive  and dont forget to update the package.json file otherwise it will not work in webcontainer",
    },
  ],
};

export const enhancePromptAPI = async (prompt: string) => {
  const response = await axios.post("http://localhost:4000/api/refinePrompt", {
    prompt: prompt,
  });
  return response.data;
};
