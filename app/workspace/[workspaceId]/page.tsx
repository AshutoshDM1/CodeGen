"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Alert from "@/components/workspace-components/Alert";
import AiChat from "@/components/workspace-components/AiChat";
import CodeEditor from "@/components/workspace-components/codeEditor";
import {
  useChatStore,
  useFullPreview,
  useProjectStore,
} from "@/store/chatStore";
import { useEffect, useRef } from "react";
import { useEditorCode } from "@/store/chatStore";
import { useTerminalStore } from "@/store/chatStore";
import { useShowPreview } from "@/store/chatStore";
import { AnimatePresence, motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { defaultProjectFiles } from "@/store/chatStore";
import { useParams } from "next/navigation";

const Dashboard = () => {
  const { fullPreview, setFullPreview } = useFullPreview();
  const { url } = useTerminalStore();
  const { showWorkspace, setShowWorkspace } = useShowPreview();
  const { setMessages } = useChatStore();
  const { project, setProjectNull } = useProjectStore();
  const { setCode } = useEditorCode((state) => state);
  const { workspaceId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatStore();
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    setMessages([]);
    setProjectNull();
    setCode(defaultProjectFiles);
  }, []);

  useEffect(() => {
    if (project) {
      setCode(project.lastUpdatedCode);
      setMessages(project.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  // Define startDevServer with useCallback

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {fullPreview ? (
          <div className="w-full h-full" key="fullPreview">
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full fixed top-0 pb-12"
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
                    Export
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
                  className="ai-chat-scrollbar"
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
              <AiChat
                projectId={workspaceId as string}
                messagesEndRef={messagesEndRef}
              />
              {showWorkspace === true ? (
                <CodeEditor />
              ) : (
                <div className="absolute w-fit top-2 right-14 flex items-center justify-center ai-chat-scrollbar">
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
