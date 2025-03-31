"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Alert from "@/components/workspace-components/Alert";
import AiChat from "@/components/workspace-components/AiChat";
import CodeEditor from "@/components/workspace-components/codeEditor";
import SidebarMain from "@/components/workspace-components/SidebarMain";
import {
  useChatStore,
  useFullPreview,
  useProjectStore,
} from "@/store/chatStore";
import { useEffect, useCallback } from "react";
import { useWebContainer } from "@/hooks/useWebContainer";
import { useEditorCode } from "@/store/chatStore";
import { useTerminalStore } from "@/store/chatStore";
import { useShowPreview } from "@/store/chatStore";
import { useRef } from "react";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { cleanTerminalOutput } from "@/components/workspace-components/webContainer";
import { AnimatePresence, motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { defaultProjectFiles } from "@/store/chatStore";
import { useParams } from "next/navigation";
import JSZip from "jszip";

const Dashboard = () => {
  const { fullPreview, setFullPreview } = useFullPreview();
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const { url, setUrl, setIsSavingFiles } = useTerminalStore();
  const setIsLoading = useTerminalStore(
    (state) => state.setIsLoadingWebContainer
  );
  const { EditorCode } = useEditorCode();
  const addCommand = useTerminalStore((state) => state.addCommand);
  const { showWorkspace, setShowWorkspace } = useShowPreview();
  const { setMessages } = useChatStore();
  const isInitialized = useRef(false);
  const prevEditorCode = useRef(EditorCode);
  const devProcessRef = useRef<{
    kill: () => void;
    output: ReadableStream<string>;
    exit: Promise<number>;
  } | null>(null);
  const serverReadyRef = useRef(false);
  const { project, setProject } = useProjectStore((state) => state);
  const { setCode } = useEditorCode((state) => state);
  const { workspaceId } = useParams();

  useEffect(() => {
    if (workspaceId === "default") {
      setProject({
        projectName: "Demo Project",
        projectDescription: "This is a demo project",
        projectId: "Demo123",
        lastUpdatedCode: defaultProjectFiles,
        messages: [
          {
            role: "user",
            content:
              "Adapt the current landing page's content and theme to represent my Codegen application",
          },
          {
            role: "assistant",
            content: {
              startingContent: "Hello, how can I help you today?",
              projectFiles: defaultProjectFiles,
              endingContent: "Let me know if you need anything else.",
            },
          },
        ],
      });
      console.log(project);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, setProject]);

  useEffect(() => {
    if (project) {
      setCode(project.lastUpdatedCode);
      setMessages(project.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  // Define startDevServer with useCallback
  const startDevServer = useCallback(
    async (container: WebContainer) => {
      if (!container) return;

      console.log("Starting dev server...");
      const devProcess = await container.spawn("npm", ["run", "dev"]);
      devProcessRef.current = devProcess;

      // Set up server-ready listener only once
      if (!serverReadyRef.current) {
        container.on("server-ready", (port: number, serverUrl: string) => {
          const cleanUrl = `Server is ready at: ${serverUrl}`;
          console.log("Server ready at port:", port);
          addCommand(cleanUrl);
          setUrl(serverUrl);
          setIsLoading(false);
          serverReadyRef.current = true;
          setIsSavingFiles(false);
        });
      }

      // Handle process output
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            const cleanedOutput = cleanTerminalOutput(chunk);
            if (cleanedOutput) {
              addCommand(cleanedOutput);
            }
            if (chunk.includes("Error")) {
              setIsLoading(false);
            }
          },
        })
      );
    },
    [addCommand, setIsLoading, setIsSavingFiles, setUrl]
  );

  // Function to remount files
  const remountFiles = useCallback(async () => {
    if (!webcontainer) return;

    try {
      console.log("Remounting files...");
      addCommand("> 📦 Remounting files...");

      // Kill the current dev server if it exists
      if (devProcessRef.current) {
        await devProcessRef.current.kill();
      }

      // Reset server ready state
      serverReadyRef.current = false;

      // Mount the files
      const files = EditorCode as unknown as FileSystemTree;
      await webcontainer.mount(files);
      addCommand("> ✅ Files remounted successfully");

      const installProcess = await webcontainer.spawn("npm", ["install"]);
      const installExitCode = await installProcess.exit;
      console.log("Install exit code:", installExitCode);
      console.log("hi ");
      console.log("Mounted files:", Object.keys(files).join(", "));
      if (installExitCode !== 0) {
        throw new Error("Installation failed");
      }
      // Restart the dev server
      await startDevServer(webcontainer);
      addCommand("> 🚀 Restarting development server...");
    } catch (error) {
      console.error("Remount failed:", error);
      addCommand("> ❌ Error remounting files: " + (error as Error).message);
      setIsLoading(false);
      setIsSavingFiles(false);
    }
  }, [
    EditorCode,
    addCommand,
    setIsLoading,
    setIsSavingFiles,
    startDevServer,
    webcontainer,
  ]);

  const npmRunDev = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);
      devProcessRef.current = devProcess;
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        })
      );
      addCommand("> 🚀 Running npm run dev...");
    } catch (error) {
      console.error("> ❌ Error running npm run dev:", error);
    }
  }, [webcontainer, addCommand]);

  const npmInstall = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const installProcess = await webcontainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        })
      );
      addCommand("> 🚀 Running npm install...");
    } catch (error) {
      console.error("> ❌ Error running npm install:", error);
    }
  }, [webcontainer, addCommand]);

  // Initial setup - only runs once when the WebContainer is first available
  useEffect(() => {
    const setupWebContainer = async () => {
      if (!webcontainer || isInitialized.current) return;

      try {
        console.log("Initial WebContainer setup...");
        setIsLoading(true);

        const files = EditorCode as unknown as FileSystemTree;
        await webcontainer.mount(files);

        const installProcess = await webcontainer.spawn("npm", ["install"]);
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error("Installation failed");
        }

        await startDevServer(webcontainer);
        isInitialized.current = true;
        prevEditorCode.current = EditorCode;
      } catch (error) {
        console.error("Setup failed:", error);
        setIsLoading(false);
      }
    };

    if (!webcontainerLoading && !isInitialized.current) {
      setupWebContainer();
    }
  }, [
    webcontainer,
    webcontainerLoading,
    EditorCode,
    setIsLoading,
    startDevServer,
  ]);

  const handleExport = useCallback(async () => {
    if (!webcontainer) return;
    try {
      addCommand("> 📦 Preparing project for export...");
      addCommand("> 🔍 Excluding node_modules to reduce file size...");
      // Import JSZip dynamically
      const JSZipModule = await import("jszip");
      const JSZip = JSZipModule.default;
      const combinedZip = new JSZip();

      // Add each file and directory to the zip directly (except node_modules)
      addCommand("> 📄 Collecting project files...");

      // Function to recursively add files to zip
      const addToZip = async (path: string, zipTarget: JSZip) => {
        const entries = await webcontainer.fs.readdir(path, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = path === "." ? entry.name : `${path}/${entry.name}`;

          // Skip node_modules
          if (entry.name === "node_modules") {
            continue;
          }

          if (entry.isDirectory()) {
            // Recursively process directories
            await addToZip(fullPath, zipTarget);
          } else {
            // Add file directly to zip at the correct path
            const content = await webcontainer.fs.readFile(fullPath);
            zipTarget.file(fullPath, content);
          }
        }
      };

      // Start recursive process from root
      await addToZip(".", combinedZip);

      // Generate the combined zip file
      addCommand("> 🔒 Creating ZIP archive without node_modules...");
      const combinedZipBlob = await combinedZip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      console.log("Exporting project without node_modules...");
      addCommand("> ✅ Project export successful (without node_modules)");
      addCommand(
        "> 💡 Run 'npm install' after extracting to install dependencies"
      );

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(combinedZipBlob);
      link.download = "project-without-node_modules.zip";

      // Trigger the download
      link.click();

      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      addCommand("> ✅ Export completed");
    } catch (error) {
      console.error("Export failed:", error);
      addCommand(`> ❌ Export failed: ${(error as Error).message}`);
      addCommand(
        "> 💡 Tip: Try a simple export with node_modules if this fails"
      );
    }
  }, [webcontainer, addCommand]);

  // Listen for remount events
  useEffect(() => {
    const handleRemount = () => {
      remountFiles();
    };
    const handleNpmRunDev = () => {
      npmRunDev();
    };
    const handleNpmInstall = () => {
      npmInstall();
    };
    const handleExportZip = () => {
      handleExport();
    };
    // Simple export fallback if the main export fails
    const handleSimpleExport = async () => {
      if (!webcontainer) return;
      try {
        addCommand("> 📦 Exporting project with simple method...");
        // Export only src directory which usually contains the source code
        let data;
        try {
          data = await webcontainer.export("src", { format: "zip" });
          addCommand("> ✅ Exported 'src' directory successfully");
        } catch (e) {
          // If no src directory, try to export everything except node_modules
          console.log(e);
          addCommand("> ℹ️ No 'src' directory found, trying root export");
          data = await webcontainer.export(".", { format: "zip" });
          addCommand(
            "> ⚠️ Warning: This includes node_modules and may be large"
          );
        }

        const zip = new Blob([data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zip);
        link.download = "project-export.zip";
        link.click();

        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 100);

        addCommand("> ✅ Simple export completed");
      } catch (error) {
        console.error("Simple export failed:", error);
        addCommand(`> ❌ Simple export failed: ${(error as Error).message}`);
      }
    };

    window.addEventListener("export-project", handleExportZip);
    window.addEventListener("simple-export", handleSimpleExport);
    window.addEventListener("remount-webcontainer", handleRemount);
    window.addEventListener("npm-run-dev", handleNpmRunDev);
    window.addEventListener("npm-install", handleNpmInstall);

    return () => {
      window.removeEventListener("remount-webcontainer", handleRemount);
      window.removeEventListener("npm-run-dev", handleNpmRunDev);
      window.removeEventListener("npm-install", handleNpmInstall);
      window.removeEventListener("export-project", handleExportZip);
      window.removeEventListener("simple-export", handleSimpleExport);
    };
  }, [
    webcontainer,
    remountFiles,
    npmRunDev,
    npmInstall,
    handleExport,
    addCommand,
  ]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (devProcessRef.current) {
        console.log("Cleaning up dev server...");
        devProcessRef.current.kill();
      }
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {fullPreview ? (
          <div className="h-screen w-full" key="fullPreview">
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full "
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-black border-b border-border"
              >
                <div className="w-[50%] items-center gap-2 hidden 2xl:flex">
                  <div className="w-full flex items-center gap-1 px-3 py-1.5 bg-[#111] rounded-md flex-1 max-w-2xl">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="w-full text-sm text-neutral-300 truncate">
                      http://localhost:5173
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const event = new CustomEvent("remount-webcontainer");
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const event = new CustomEvent("export-project");
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export (No node_modules)
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFullPreview(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 7l5 5-5 5V7m13 0l5 5-5 5V7" />
                    </svg>
                    Back to Workspace
                  </motion.button>
                </div>
              </motion.div>
              <div className="h-full w-full overflow-y-auto ai-chat-scrollbar">
                <motion.iframe
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  height={"100%"}
                  width={"100%"}
                  src={url}
                  allow="cross-origin-isolated"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            </motion.div>
          </div>
        ) : (
          <div key="workspaceView" className="h-screen w-full">
            <Alert />
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-screen"
            >
              <SidebarMain />
              <AiChat projectId={workspaceId as string} />
              {showWorkspace === true ? (
                <CodeEditor />
              ) : (
                <div className="absolute w-fit top-2 right-14 flex items-center justify-center">
                  <InteractiveHoverButton
                    content="Show Workspace"
                    className="w-[222px] gap-10  flex items-center justify-center px-4 font-medium"
                    onClick={() => setShowWorkspace(true)}
                    arrow={true}
                  />
                </div>
              )}
            </ResizablePanelGroup>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
