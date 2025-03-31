"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Alert from "@/components/workspace-components/Alert";
import AiChat from "@/components/workspace-components/AiChat";
import SidebarMain from "@/components/workspace-components/SidebarMain";
import { useChatStore } from "@/store/chatStore";
import { AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { messages } = useChatStore();
  console.log(messages);

  return (
    <>
      <AnimatePresence key="workspaceViewMainRoute" mode="wait" initial={true}>
        <div className="h-screen w-full">
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <Alert />
            <SidebarMain />
            <AiChat projectId={null} />
          </ResizablePanelGroup>
        </div>
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
