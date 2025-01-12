"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "@/components/worspace/Sidebar";
import AiChat from "@/components/worspace/AiChat";
import CodeEditor from "@/components/worspace/codeEditor";
import { useWebContainer } from "@/hooks/useWebContainer";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const webcontainer = useWebContainer();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupWebContainer = async () => {
      try {
        setIsLoading(true);
        if (!webcontainer) return;

        const projectFiles = {
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
                    <title>React + Vite App</title>
                  </head>
                  <body>
                    <div id="root"></div>
                    <script type="module" src="/src/main.jsx"></script>
                  </body>
                </html>`,
            },
          },
          src: {
            directory: {
              "main.jsx": {
                file: {
                  contents: `
                    import React from 'react'
                    import ReactDOM from 'react-dom/client'
                    import App from './App'

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
                        <div>
                          <h1>Hello from React + Vite in WebContainer!</h1>
                        </div>
                      )
                    }
                    
                    export default App`,
                },
              },
            },
          },
        };

        // Mount the files
        await webcontainer.mount(projectFiles);

        // Install dependencies
        const installProcess = await webcontainer.spawn("npm", ["install"]);
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error("Installation failed");
        }

        // Start the development server
        const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);

        // Listen for server-ready event
        webcontainer.on("server-ready", (port, url) => {
          console.log("Server is ready at:", url);
          setUrl(url);
          setIsLoading(false);
        });

        // Change the output handling
        devProcess.output.pipeTo(
          new WritableStream({
            write(chunk) {
              console.log(chunk);
              if (chunk.includes("Error")) {
                setIsLoading(false);
              }
            },
          })
        );
      } catch (error) {
        console.error("Setup failed:", error);
        setIsLoading(false);
      }
    };

    setupWebContainer();
  }, [webcontainer]);

  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <Sidebar />
        <AiChat />
        {isLoading ? (
          <div className="flex items-center justify-center w-1/2">
            <p>Loading preview...</p>
          </div>
        ) : url ? (
          <iframe
            width="50%"
            height="100%"
            src={url}
            allow="cross-origin-isolated"
            sandbox="allow-same-origin allow-scripts allow-forms"
            className="border-none"
          />
        ) : (
          <div className="flex items-center justify-center w-1/2">
            <p>Failed to load preview</p>
          </div>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
